import React, { useEffect, useState } from 'react'
import { docClient } from '../../../AwsConfig'
import { invoiceType } from '../../Classes/InvoiceType'
import {GetCommand, PutCommand} from '@aws-sdk/lib-dynamodb'
import { CognitoIdentityServiceProvider, DynamoDB } from 'aws-sdk'
import { useNavigate } from 'react-router-dom'
import { UserInput } from '../SmallComponents/UserInput'
import { signUp, signIn, autoSignIn, getCurrentUser } from 'aws-amplify/auth'
import { CreateTableCommand, DynamoDBClient, DeleteTableCommand } from "@aws-sdk/client-dynamodb";

const TableName = 'Users2'
var cognitoIdentityServiceProcier = new CognitoIdentityServiceProvider()

const client = new DynamoDBClient({
  region: 'localhost',
  endpoint: 'http://localhost:8080',
  credentials: {
    accessKeyId: 'fakeMyKeyId',
    secretAccessKey: 'fakeSecret'
  }
})


const randomInvoice = new invoiceType(
  'INV-1001',
  '2024-09-15',
  'Jane Doe',
  1520.75,
  'Pending',
  '2024-08-19',
  30,
  'Web development services',
  'jane.doe@example.com',
  {
    street: '123 Maple Street',
    city: 'Los Angeles',
    postCode: '90001',
    country: 'USA'
  },
  {
    street: '456 Oak Avenue',
    city: 'San Francisco',
    postCode: '94102',
    country: 'USA'
  },
  [
    { name: 'Website Design', quantity: 1, price: 1200, total: 1200 },
    { name: 'Hosting', quantity: 1, price: 100, total: 100 },
    { name: 'Maintenance', quantity: 2, price: 110.375, total: 220.75 },
  ]
);

const writeToTable = async () => {
  const command = new PutCommand({
    TableName: TableName,
    Item: randomInvoice
})
  try {
    const data = await docClient.send(command)
    console.log(data)
  } catch (err) {
    console.error(err)
  }
}

const getFromtable = async () => {
  const command = new GetCommand({
    TableName: TableName,
    Key: {
      id: 'INV-1001'
    }
  })

  const data = await docClient.send(command)
  console.log(data.Item) 
}


export const TestPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");

  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser().then((data) => {
      console.log(data.signInDetails?.loginId)
      if(data.signInDetails?.loginId) {
        navigate('/test/' + data.signInDetails.loginId)
      }
    }).catch((err) => {
      console.log(err)
    })

  }, [])

  const OnSignUp = async () => {
    if(!signUpPassword || !signUpEmail || !signUpPhone) {
      alert('Please fill in all the fields')
      return
    }
    console.log(signUpPhone)
    await signUp({
      username: signUpEmail,
      password: signUpPassword,
      options: {
        userAttributes: {
          phone_number: signUpPhone
        }
      }
    }).then((data) => {
      console.log(data)
      console.log(data.nextStep)
      
      navigate('confirm/' + signUpEmail)
      
    }).catch((err) => {
      console.log(err)
    })
  }

  const onSignIn = async () => {
    if(!email || !password) {
      alert('Please fill in all the fields')
      return
    }

    await signIn({
      username: email,
      password: password
    }).then((data) => {
      console.log(data)
      console.log(data.nextStep)
      navigate('/test/' + email)
    }).catch((err) => {
      console.log(err)
    })
  }

  // const params = {
  //   TableName: TableName,
  //   KeySchema:[
  //     { AttributeName: 'id', KeyType: 'HASH' }
  //   ],
  //   AttributeDefinitions: [
  //     { AttributeName: 'id', AttributeType: 'S' }
  //   ],
  //   ProvisionedThroughput: {
  //     ReadCapacityUnits: 1,
  //     WriteCapacityUnits: 1
  //   }
  // }

  // const command = new CreateTableCommand({
  //   TableName: "Users",
  //   AttributeDefinitions: [
  //     {AttributeName: "email", AttributeType: "S"}
  //   ],
  //   KeySchema:[{AttributeName: "email", KeyType: "HASH"}],
  //   ProvisionedThroughput: {
  //     ReadCapacityUnits: 1,
  //     WriteCapacityUnits: 1
  //   }
  // })

  const deleteCommand = new DeleteTableCommand({
    TableName: "Users"
  })


  useEffect(() => {
    // client.send(command).then((data) => {
    //   console.log(data)
    // }).catch((err) => {
    //   console.log(err)
    // })

    // client.send(deleteCommand).then((data) => {
    //   console.log(data)
    // }).then((err) => {
    //   console.log(err)
    // })
  }, [])

  const [method, setMethod] = useState("login")

  return (
    <form className="px-[1.5rem] py-4 max-w-[500px] m-auto mt-[200px] flex flex-col items-center shadow-md border-1 border-solid border-grey">
      {method ==="SignUp" ? 

      <>
        <h1>Sign Up</h1>
        <UserInput header="Email" value={signUpEmail} setValue={setSignUpEmail} />
        <UserInput header="Password" value={signUpPassword} setValue={setSignUpPassword} />
        <UserInput header="Phone" value={signUpPhone} setValue={setSignUpPhone} />
      </>
      
      : 
      <>
        <h1>Login</h1>
        <UserInput header="Email" value={email} setValue={setEmail} />
        <UserInput header="Password" value={password} setValue={setPassword} />
      </>}
      {method === "login" ? 
            <>
              <button className="px-[1.5rem] py-2 text-black underline" type="button" onClick={() => setMethod("SignUp")}>Sign Up</button> 
              <button className="px-[1.5rem] py-2 bg-black text-white rounded-[4000px] mt-4" type="submit" onClick={() => {onSignIn()}}>{method}</button>
            </>
          : 
          <>
            <button className="px-[1.5rem] py-2 text-black underline" type="button" onClick={() => {setMethod("login")}}>Already have an account?</button>
            <button className="px-[1.5rem] py-2 bg-black text-white rounded-[4000px] mt-4" type="submit" onClick={OnSignUp}>{method}</button>
          </>
        }
      
    </form>
  )}
