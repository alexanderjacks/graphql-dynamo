const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const {
	graphql,
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLNonNull
} = require('graphql')

// sets as a promise, to work with DocumentClient callback syntax
const promisify = jax => new Promise((resolve, reject) => {
  jax((error, result) => {
    if(error) {
      reject(error)
    } else {
      resolve(result)
    }
  })
})


// Method to insert first name into the hello msg
const getGreeting = firstName => promisify(callback =>
  dynamoDb.get({
    TableName: process.env.DYNAMODB_TABLE,
    Key: { firstName },
  }, callback))
  .then(result => {
    if(!result.Item) {
      return firstName
    }
    return result.Item.nickname
  })
  .then(name => `Hello, ${name}.`)


const changeNickname = (firstName, nickname) => promisify(callback =>
  dynamoDb.update({
    TableName: process.env.DYNAMODB_TABLE,
    Key: { firstName },
    UpdateExpression: 'SET nickname = :nickname',
    ExpressionAttributeValues: {
      ':nickname': nickname
    }
  }, callback))
  .then(() => nickname)


// Schema declaration
const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'RootQueryType', // could be any name
		fields: {
			// 1st query field
			greeting: {
				// grabs the user's name
				args: {
					firstName: {
						name: 'firstName',
						type: new GraphQLNonNull(GraphQLString)
					}
				},
				type: GraphQLString,
				// create the greeting message
				resolve: (parent, args) => getGreeting(args.firstName)
			}
		}
	}),
	mutation: new GraphQLObjectType({
    name: 'RootMutationType', // could be any name
    fields: {
      changeNickname: {
        args: {
          // grabs the user's first name, also nickname
          firstName: { name: 'firstName', type: new GraphQLNonNull(GraphQLString) },
          nickname: { name: 'nickname', type: new GraphQLNonNull(GraphQLString) }
        },
        type: GraphQLString,
        // update the nickname
        resolve: (parent, args) => changeNickname(args.firstName, args.nickname)
      }
    }
  })
})

// Setting up the GET request for AWS.
module.exports.query = (event, context, callback) => graphql(schema, event.queryStringParameters.query)
	.then(
		result => callback(null, {statusCode: 200, body: JSON.stringify(result)}),
		err => callback(err)
	)