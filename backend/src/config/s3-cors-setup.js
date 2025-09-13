// backend/src/config/s3-cors-setup.js
const { S3Client, PutBucketCorsCommand } = require("@aws-sdk/client-s3");
require('dotenv').config();

const s3Client = new S3Client({ 
  region: process.env.AWS_REGION || "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const corsRules = [
  {
    AllowedHeaders: ["*"],
    AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
    AllowedOrigins: [
      "https://openwall.com.tr",
      "https://www.openwall.com.tr",
      "https://openwall.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    ExposeHeaders: ["ETag", "Content-Length", "Content-Type"],
    MaxAgeSeconds: 3000
  }
];

async function setupCORS() {
  try {
    const command = new PutBucketCorsCommand({
      Bucket: process.env.S3_BUCKET_NAME || 'openwall',
      CORSConfiguration: {
        CORSRules: corsRules
      }
    });

    await s3Client.send(command);
    console.log('S3 CORS ayarları başarıyla güncellendi!');
    console.log('İzin verilen domainler:', corsRules[0].AllowedOrigins);
  } catch (error) {
    console.error('S3 CORS ayarları güncellenirken hata:', error);
  }
}

// Script'i çalıştır
if (require.main === module) {
  setupCORS();
}

module.exports = { setupCORS }; 