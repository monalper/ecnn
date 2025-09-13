// backend/src/utils/create-comments-table.js
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { CreateTableCommand } = require("@aws-sdk/client-dynamodb");

const region = process.env.AWS_REGION || "eu-north-1";

const dynamoDBClient = new DynamoDBClient({ 
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const createCommentsTable = async () => {
  const tableName = process.env.DYNAMODB_COMMENTS_TABLE || 'OpenWallComments';

  const params = {
    TableName: tableName,
    KeySchema: [
      {
        AttributeName: 'commentId',
        KeyType: 'HASH' // Partition key
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'commentId',
        AttributeType: 'S'
      },
      {
        AttributeName: 'articleSlug',
        AttributeType: 'S'
      }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'ArticleSlugIndex',
        KeySchema: [
          {
            AttributeName: 'articleSlug',
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
    console.log('Comments table created successfully:', result);
    return result;
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('Comments table already exists');
      return { message: 'Table already exists' };
    }
    console.error('Error creating comments table:', error);
    throw error;
  }
};

// Script olarak çalıştırılırsa
if (require.main === module) {
  createCommentsTable()
    .then(() => {
      console.log('Comments table creation completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to create comments table:', error);
      process.exit(1);
    });
}

module.exports = { createCommentsTable };

