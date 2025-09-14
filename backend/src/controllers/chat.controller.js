const { v4: uuidv4 } = require('uuid');

// Aktif kullanıcıları ve mesajları saklamak için
const activeUsers = new Map();
const chatMessages = [];

// Kullanıcı bağlantısını yönet
const handleUserConnection = (socket) => {
  const userId = uuidv4();
  const user = {
    id: userId,
    socketId: socket.id,
    username: `Kullanıcı_${Math.floor(Math.random() * 1000)}`,
    joinTime: new Date(),
    isOnline: true
  };

  activeUsers.set(userId, user);
  
  // Kullanıcıya kendi bilgilerini gönder
  socket.emit('userInfo', {
    id: user.id,
    username: user.username
  });

  // Tüm kullanıcılara yeni kullanıcı bilgisini gönder
  socket.broadcast.emit('userJoined', {
    id: user.id,
    username: user.username,
    joinTime: user.joinTime
  });

  // Mevcut kullanıcı listesini gönder
  const usersList = Array.from(activeUsers.values()).map(u => ({
    id: u.id,
    username: u.username,
    isOnline: u.isOnline
  }));
  socket.emit('usersList', usersList);

  // Son 50 mesajı gönder
  socket.emit('messageHistory', chatMessages.slice(-50));

  console.log(`Kullanıcı bağlandı: ${user.username} (${socket.id})`);
  console.log(`Aktif kullanıcı sayısı: ${activeUsers.size}`);

  return user;
};

// Kullanıcı bağlantısını kes
const handleUserDisconnection = (socket) => {
  const user = Array.from(activeUsers.values()).find(u => u.socketId === socket.id);
  
  if (user) {
    activeUsers.delete(user.id);
    
    // Diğer kullanıcılara kullanıcının ayrıldığını bildir
    socket.broadcast.emit('userLeft', {
      id: user.id,
      username: user.username
    });

    console.log(`Kullanıcı ayrıldı: ${user.username} (${socket.id})`);
    console.log(`Aktif kullanıcı sayısı: ${activeUsers.size}`);
  }
};

// Mesaj gönderme
const handleMessage = (socket, messageData) => {
  const user = Array.from(activeUsers.values()).find(u => u.socketId === socket.id);
  
  if (!user) {
    socket.emit('error', { message: 'Kullanıcı bulunamadı' });
    return;
  }

  const message = {
    id: uuidv4(),
    userId: user.id,
    username: user.username,
    content: messageData.content,
    timestamp: new Date(),
    type: 'message'
  };

  // Mesajı kaydet (son 100 mesajı tut)
  chatMessages.push(message);
  if (chatMessages.length > 100) {
    chatMessages.shift();
  }

  // Tüm kullanıcılara mesajı gönder
  socket.broadcast.emit('newMessage', message);
  
  // Gönderen kullanıcıya mesajın iletildiğini bildir
  socket.emit('messageSent', message);

  console.log(`Mesaj gönderildi: ${user.username}: ${messageData.content}`);
};

// Kullanıcı adı değiştirme
const handleUsernameChange = (socket, newUsername) => {
  const user = Array.from(activeUsers.values()).find(u => u.socketId === socket.id);
  
  if (!user) {
    socket.emit('error', { message: 'Kullanıcı bulunamadı' });
    return;
  }

  const oldUsername = user.username;
  user.username = newUsername;

  // Diğer kullanıcılara kullanıcı adı değişikliğini bildir
  socket.broadcast.emit('usernameChanged', {
    userId: user.id,
    oldUsername: oldUsername,
    newUsername: newUsername
  });

  // Kullanıcıya güncellenmiş bilgilerini gönder
  socket.emit('userInfo', {
    id: user.id,
    username: user.username
  });

  console.log(`Kullanıcı adı değiştirildi: ${oldUsername} -> ${newUsername}`);
};

// Yazıyor durumu
const handleTyping = (socket, isTyping) => {
  const user = Array.from(activeUsers.values()).find(u => u.socketId === socket.id);
  
  if (user) {
    socket.broadcast.emit('userTyping', {
      userId: user.id,
      username: user.username,
      isTyping: isTyping
    });
  }
};

// Sistem mesajı gönderme
const sendSystemMessage = (io, content) => {
  const message = {
    id: uuidv4(),
    userId: 'system',
    username: 'Sistem',
    content: content,
    timestamp: new Date(),
    type: 'system'
  };

  chatMessages.push(message);
  if (chatMessages.length > 100) {
    chatMessages.shift();
  }

  io.emit('newMessage', message);
};

module.exports = {
  handleUserConnection,
  handleUserDisconnection,
  handleMessage,
  handleUsernameChange,
  handleTyping,
  sendSystemMessage,
  activeUsers,
  chatMessages
}; 