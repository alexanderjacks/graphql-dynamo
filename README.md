### 🕸📞 📇 GraphQL talking to DynamoDB
GraphQL + NoSQL boilerplate in Node on AWS
Alex Jacks, 2019, MIT

## 📦 Get Ready for Use
* Clone or Download this code
* Open Terminal:
```npm install```

## 📞 Request Format
* Open Terminal:
```curl -G 'https://tqs59xap04.execute-api.us-east-1.amazonaws.com/dev/query' --data-urlencode 'query={greeting(firstName: "M")}'```
* You will receive a reply from a Dynamo endpoint that returns a hello + the name you send

## 🚀 Further Steps
* Modify the _handler.js_ file, lines 52 - 86, in order to tinker with the GraphQL schema.
* Refer to [this work](https://github.com/serverless/examples/tree/master/aws-node-graphql-api-with-dynamodb) (how I built this) & learn how to reach out & modify the Dynamo endpoint!
