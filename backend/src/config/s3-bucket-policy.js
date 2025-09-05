// backend/src/config/s3-bucket-policy.js
const { S3Client, PutBucketPolicyCommand } = require("@aws-sdk/client-s3");
require('dotenv').config();

const s3Client = new S3Client({ 
  region: process.env.AWS_REGION || "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

async function setupBucketPolicy() {
  const bucketName = process.env.S3_BUCKET_NAME || 'openwall';
  
  // Bucket policy that allows public read access to uploaded files
  const bucketPolicy = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'PublicReadGetObject',
        Effect: 'Allow',
        Principal: '*',
        Action: 's3:GetObject',
        Resource: `arn:aws:s3:::${bucketName}/*`
      }
    ]
  };

  try {
    const command = new PutBucketPolicyCommand({
      Bucket: bucketName,
      Policy: JSON.stringify(bucketPolicy)
    });

    await s3Client.send(command);
    console.log('✅ Bucket policy başarıyla güncellendi!');
    console.log('Artık yüklenen dosyalar public olarak erişilebilir.');
  } catch (error) {
    console.error('❌ Bucket policy güncellenirken hata:', error);
    if (error.name === 'AccessDenied') {
      console.log('💡 AWS IAM kullanıcınızın s3:PutBucketPolicy iznine sahip olduğundan emin olun.');
    }
  }
}

// Script'i çalıştır
if (require.main === module) {
  setupBucketPolicy();
}

module.exports = { setupBucketPolicy }; 