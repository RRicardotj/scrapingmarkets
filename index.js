require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();
const server = require('http').Server(app);
// require('./socket').init(server, { cookie: false });

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();
});

app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
    type RootQuery {
      events: [String!]!
    }

    type RootMutation {
      createEvent(name: String): String
    }
    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => {
      return ['Jamon cerrano', 'Aceite de oliva', 'Caldo de pollo'];
    },
    createEvent: (args) => {
      const { name } = args;

      return name;
    },
  },
  graphiql: true,
}));

const port = process.env.SERVER_PORT || 8080;

server.listen(port);
console.log(`Listening on port ${port}`); // eslint-disable-line
