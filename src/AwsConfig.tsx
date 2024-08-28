import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const docClient = new DynamoDBClient({
    region: 'localhost',
    endpoint: 'http://localhost:8080',
    credentials: {
        accessKeyId: 'fakeMyKeyId',  // Fake credentials
        secretAccessKey: 'fakeSecret'
    }
});

export { docClient };
