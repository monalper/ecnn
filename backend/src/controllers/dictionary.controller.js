const {
  TABLE_NAME,
  docClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  DeleteCommand,
  UpdateCommand
} = require('../models/dictionary.dynamodb');

// Get all dictionary entries
exports.getAll = async (req, res) => {
  try {
    const command = new ScanCommand({ TableName: TABLE_NAME });
    const data = await docClient.send(command);
    const entries = (data.Items || []).sort((a, b) => a.word.localeCompare(b.word));
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get entry by word
exports.getByWord = async (req, res) => {
  try {
    const command = new GetCommand({ TableName: TABLE_NAME, Key: { word: req.params.word } });
    const { Item } = await docClient.send(command);
    if (!Item) return res.status(404).json({ message: 'Word not found' });
    res.json(Item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new entry
exports.create = async (req, res) => {
  try {
    const { word, definition, type } = req.body;
    if (!word || !definition) return res.status(400).json({ message: 'Word and definition required' });
    // Check if exists
    const getCmd = new GetCommand({ TableName: TABLE_NAME, Key: { word } });
    const { Item } = await docClient.send(getCmd);
    if (Item) return res.status(400).json({ message: 'Word already exists' });
    // Definition her zaman dizi olarak kaydedilsin
    const defArr = Array.isArray(definition) ? definition : [definition];
    const putCmd = new PutCommand({ TableName: TABLE_NAME, Item: { word, definition: defArr, type: type || '', createdAt: Date.now() } });
    await docClient.send(putCmd);
    res.status(201).json({ word, definition: defArr, type });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update entry
exports.update = async (req, res) => {
  try {
    const { definition, type } = req.body;
    const word = req.params.word;
    const defArr = Array.isArray(definition) ? definition : [definition];
    let UpdateExpression = 'set #d = :d';
    let ExpressionAttributeNames = { '#d': 'definition' };
    let ExpressionAttributeValues = { ':d': defArr };
    if (typeof type !== 'undefined') {
      UpdateExpression += ', #t = :t';
      ExpressionAttributeNames['#t'] = 'type';
      ExpressionAttributeValues[':t'] = type;
    }
    const updateCmd = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { word },
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });
    const { Attributes } = await docClient.send(updateCmd);
    if (!Attributes) return res.status(404).json({ message: 'Word not found' });
    res.json(Attributes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete entry
exports.remove = async (req, res) => {
  try {
    const word = req.params.word;
    const delCmd = new DeleteCommand({ TableName: TABLE_NAME, Key: { word } });
    await docClient.send(delCmd);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search dictionary entries
exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.json([]);
    }
    
    const searchTerm = q.toLowerCase().trim();
    const command = new ScanCommand({ TableName: TABLE_NAME });
    const data = await docClient.send(command);
    const entries = data.Items || [];
    
    // Word ve definition'da ara
    const results = entries
      .filter(entry => {
        const wordMatch = entry.word && entry.word.toLowerCase().includes(searchTerm);
        const defMatch = entry.definition && 
          (Array.isArray(entry.definition) 
            ? entry.definition.some(def => def.toLowerCase().includes(searchTerm))
            : entry.definition.toLowerCase().includes(searchTerm));
        return wordMatch || defMatch;
      })
      .sort((a, b) => a.word.localeCompare(b.word))
      .slice(0, 10)
      .map(entry => ({
        word: entry.word,
        definition: Array.isArray(entry.definition) ? entry.definition[0] : entry.definition,
        type: entry.type
      }));
    
    res.json(results);
  } catch (err) {
    console.error('Dictionary search error:', err);
    res.status(500).json({ message: 'Arama sırasında bir hata oluştu.' });
  }
};
