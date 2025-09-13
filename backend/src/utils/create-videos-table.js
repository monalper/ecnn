const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');

const region = process.env.AWS_REGION || "eu-north-1";
const VIDEOS_TABLE = process.env.DYNAMODB_VIDEO_TABLE || 'OpenWallVideos';

const dynamoDBClient = new DynamoDBClient({ 
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const createVideosTable = async () => {
  const params = {
    TableName: VIDEOS_TABLE,
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
    console.log(`Creating DynamoDB table: ${VIDEOS_TABLE}`);
    const command = new CreateTableCommand(params);
    await dynamoDBClient.send(command);
    console.log(`✅ Table ${VIDEOS_TABLE} created successfully!`);
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log(`ℹ️  Table ${VIDEOS_TABLE} already exists.`);
    } else {
      console.error('❌ Error creating table:', error);
      throw error;
    }
  }
};

// Run the script if called directly
if (require.main === module) {
  require('dotenv').config();
  createVideosTable()
    .then(() => {
      console.log('Videos table setup completed.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to create videos table:', error);
      process.exit(1);
    });
}

module.exports = { createVideosTable }; 