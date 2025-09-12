const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');

const region = process.env.AWS_REGION || "eu-north-1";
const GALLERY_TABLE = process.env.DYNAMODB_GALLERY_TABLE || 'OpenWallGallery';

const dynamoDBClient = new DynamoDBClient({ 
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const createGalleryTable = async () => {
  const params = {
    TableName: GALLERY_TABLE,
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH' // Partition key
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S' // String
      }
    ],
    BillingMode: 'PAY_PER_REQUEST', // On-demand billing
    Tags: [
      {
        Key: 'Project',
        Value: 'OpenWall'
      },
      {
        Key: 'Environment',
        Value: process.env.NODE_ENV || 'development'
      }
    ]
  };

  try {
    console.log(`Creating DynamoDB table: ${GALLERY_TABLE}`);
    const command = new CreateTableCommand(params);
    await dynamoDBClient.send(command);
    console.log(`✅ Table ${GALLERY_TABLE} created successfully!`);
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log(`ℹ️  Table ${GALLERY_TABLE} already exists.`);
    } else {
      console.error('❌ Error creating table:', error);
      throw error;
    }
  }
};

// Run the script if called directly
if (require.main === module) {
  require('dotenv').config();
  createGalleryTable()
    .then(() => {
      console.log('Gallery table setup completed.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to create gallery table:', error);
      process.exit(1);
    });
}

module.exports = { createGalleryTable }; 