// backend/src/config/s3-bucket-check.js
const { S3Client, GetBucketAclCommand, GetBucketPolicyCommand, GetBucketCorsCommand } = require("@aws-sdk/client-s3");
require('dotenv').config();

const s3Client = new S3Client({ 
  region: process.env.AWS_REGION || "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

async function checkBucketConfiguration() {
  const bucketName = process.env.S3_BUCKET_NAME || 'openwall';
  
  try {
    console.log(`S3 Bucket: ${bucketName}`);
    console.log(`AWS Region: ${process.env.AWS_REGION || "eu-north-1"}`);
    console.log('---');
    
    // Check bucket ACL
    try {
      const aclCommand = new GetBucketAclCommand({ Bucket: bucketName });
      const aclResult = await s3Client.send(aclCommand);
      console.log('✅ Bucket ACL mevcut');
      console.log('ACL Owner:', aclResult.Owner?.DisplayName);
      console.log('ACL Grants:', aclResult.Grants?.length || 0);
    } catch (error) {
      console.log('❌ Bucket ACL hatası:', error.message);
    }
    
    // Check bucket policy
    try {
      const policyCommand = new GetBucketPolicyCommand({ Bucket: bucketName });
      const policyResult = await s3Client.send(policyCommand);
      console.log('✅ Bucket Policy mevcut');
      console.log('Policy:', policyResult.Policy);
    } catch (error) {
      console.log('❌ Bucket Policy hatası:', error.message);
    }
    
    // Check CORS
    try {
      const corsCommand = new GetBucketCorsCommand({ Bucket: bucketName });
      const corsResult = await s3Client.send(corsCommand);
      console.log('✅ Bucket CORS mevcut');
      console.log('CORS Rules:', corsResult.CORSRules?.length || 0);
    } catch (error) {
      console.log('❌ Bucket CORS hatası:', error.message);
    }
    
  } catch (error) {
    console.error('Bucket kontrol hatası:', error);
  }
}

// Script'i çalıştır
if (require.main === module) {
  checkBucketConfiguration();
}

module.exports = { checkBucketConfiguration }; 