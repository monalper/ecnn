// backend/src/utils/check-and-create-tables.js
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { CreateTableCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');

const region = process.env.AWS_REGION || "eu-north-1";
const tableName = process.env.DYNAMODB_COMMENT_LIKES_TABLE || 'OpenWallCommentLikes';

const dynamoDBClient = new DynamoDBClient({ 
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const checkAndCreateTable = async () => {
  try {
    // Check if table exists
    await dynamoDBClient.send(new DescribeTableCommand({ TableName: tableName }));
    console.log(`Table ${tableName} already exists`);
  } catch (error) {
    if (error.name === 'ResourceNotFoundException') {
      console.log(`Table ${tableName} does not exist. Creating...`);
      
      const params = {
        TableName: tableName,
        KeySchema: [
          {
            AttributeName: 'likeId',
            KeyType: 'HASH' // Partition key
          }
        ],
        AttributeDefinitions: [
          {
            AttributeName: 'likeId',
            AttributeType: 'S'
          },
          {
            AttributeName: 'commentId',
            AttributeType: 'S'
          }
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'CommentIdIndex',
            KeySchema: [
              {
                AttributeName: 'commentId',
                KeyType: 'HASH'
              }
            ],
            Projection: {
              ProjectionType: 'ALL'
            },
            ProvisionedThroughput: {
              ReadCapacityUnits: 5,
              WriteCapacityUnits: 5
            }
          }
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      };

      try {
        const result = await dynamoDBClient.send(new CreateTableCommand(params));
        console.log('Table created successfully:', result);
      } catch (createError) {
        console.error('Error creating table:', createError);
      }
    } else {
      console.error('Error checking table:', error);
    }
  }
};

// Run the script
checkAndCreateTable();
