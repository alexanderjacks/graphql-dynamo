const {
	graphql,
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLNonNull
} = require('graphql')

// Method to insert first name into the hello msg
const getGreeting = firstName => `Hello there, ${firstName}.`

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
})

// Setting up the GET request for AWS.
module.exports.query = (event, context, callback) => graphql(schema, event.queryStringParameters.query)
	.then(
		result => callback(null, {statusCode: 200, body: JSON.stringify(result)}),
		err => callback(err)
	)