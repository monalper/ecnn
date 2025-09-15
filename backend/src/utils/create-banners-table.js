// backend/src/utils/create-banners-table.js
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { CreateTableCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');

const region = process.env.AWS_REGION || 'eu-north-1';
const tableName = process.env.DYNAMODB_BANNERS_TABLE || 'OpenWallBanners';

const dynamoDBClient = new DynamoDBClient({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

async function createBannersTable() {
  try {
    // Önce tablo var mı kontrol et
    try {
      await dynamoDBClient.send(new DescribeTableCommand({ TableName: tableName }));
      console.log(`✅ ${tableName} tablosu zaten mevcut.`);
      return;
    } catch (error) {
      if (error.name !== 'ResourceNotFoundException') {
        throw error;
      }
      // Tablo yok, oluşturalım
    }

    const params = {
      TableName: tableName,
      KeySchema: [
        {
          AttributeName: 'bannerId',
          KeyType: 'HASH' // Partition key
        }
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'bannerId',
          AttributeType: 'S'
        }
      ],
      BillingMode: 'PAY_PER_REQUEST', // On-demand pricing
      Tags: [
        {
          Key: 'Environment',
          Value: process.env.NODE_ENV || 'development'
        },
        {
          Key: 'Project',
          Value: 'OpenWall'
        }
      ]
    };

    console.log(`🔄 ${tableName} tablosu oluşturuluyor...`);
    const result = await dynamoDBClient.send(new CreateTableCommand(params));
    console.log(`✅ ${tableName} tablosu başarıyla oluşturuldu!`);
    console.log('Tablo ARN:', result.TableDescription.TableArn);
    
  } catch (error) {
    console.error('❌ Tablo oluşturulurken hata:', error);
    throw error;
  }
}

// Script doğrudan çalıştırıldığında tabloyu oluştur
if (require.main === module) {
  createBannersTable()
    .then(() => {
      console.log('🎉 Banner tablosu oluşturma işlemi tamamlandı!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Hata:', error);
      process.exit(1);
    });
}

module.exports = { createBannersTable };
