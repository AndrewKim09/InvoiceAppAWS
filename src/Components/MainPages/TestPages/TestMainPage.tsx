import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PutCommand, DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const TestMainPage = () => {
  const email = useParams<{ email: string }>()
  console.log(email)
  const client = new DynamoDBClient({
    region: 'localhost',
    endpoint: 'http://localhost:8080',
    credentials: {
      accessKeyId: 'fakeMyKeyId',
      secretAccessKey: 'fakeSecret'
    }
  })

  const docClient = DynamoDBDocumentClient.from(client);

  const putCommand = new PutCommand({
    TableName: 'Users',
    Item: {
      email: email.email,
      invoices: []
    }
  })

  const getCommand = new GetCommand({
    TableName: "Users",
    Key: {
      email: email.email
    }
  })

  // const addUserToTable = async () => { 
  //   docClient.send(putCommand).then((data) => {
  //     console.log(data.$metadata)
  //   }).catch((err) => {
  //     console.log(err)
  //   })
  // }

  const getUserFromTable = async () => {
    docClient.send(getCommand).then((data) => {
      console.log(data.Item)
    }).catch((err) => {
      console.log(err)
    })
  }

  useEffect(() => {
    // addUserToTable();
    getUserFromTable();
  }, [])
  return (
    <div>TestMainPage</div>
  )
}
