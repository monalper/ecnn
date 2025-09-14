// backend/src/utils/create-comment-likes-table.js
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');

const region = process.env.AWS_REGION || "eu-north-1";
const tableName = process.env.DYNAMODB_COMMENT_LIKES_TABLE || 'OpenWallCommentLikes';

const dynamoDBClient = new DynamoDBClient({ 
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const createCommentLikesTable = async () => {
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
    console.log(`Creating table ${tableName}...`);
    const result = await dynamoDBClient.send(new CreateTableCommand(params));
    console.log('Table created successfully:', result);
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('Table already exists');
    } else {
      console.error('Error creating table:', error);
    }
  }
};

// Run the script
createCommentLikesTable();
