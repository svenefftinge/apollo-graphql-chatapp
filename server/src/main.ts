const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");
import users from "./mocks/users";
import channels from "./mocks/channels";

// The GraphQL schema in string form
const typeDefs = `
  type User {
    id: String!,

    """The readable name"""
    name: String!
  }

  type Channel {
    id: String!

    title: String!
    members: [User!]!
    messages: [Message!]!

    latestMessage: Message!
  }

  type Message {
    id: String!
    author: User!
    date: String!
    text: String!
  }

  type Query { 
    channels: [Channel!]!, users: [User!]! 
    channel(channelId: String!): Channel
  }

  type Mutation {
    postMessage(channelId: String!, authorId: String!, message: String!): Message!
  }
`;

interface User {
  id: string;
  name: string;
}

interface Channel {
  id: string;
  title: string;
  messages: Message[];
}

interface Message {
  id: string;
  text: string;
  date: string;
  author: User;
}

let messageIdCounter = 10000;

// The resolvers
const resolvers = {
  Query: {
    channels: () => channels,
    channel: (obj: any, args: { channelId: string }) => channels.find(c => c.id === args.channelId),
    users: () => users
  },
  Mutation: {
    postMessage: (_: any, args: { channelId: string; authorId: string; message: string }) => {
      const author = users.find(user => user.id === args.authorId);
      if (!author) {
        throw new Error(`Author with id ${args.authorId} not found`);
      }
      const channel = channels.find(c => c.id === args.channelId);
      if (!channel) {
        throw new Error(`Channel with id ${args.authorId} not found`);
      }

      const newMessage: Message = {
        id: `m${messageIdCounter++}`,
        text: args.message,
        date: new Date().toISOString(),
        author
      };

      console.log("New Message", newMessage);

      channel.messages = channel.messages.concat(newMessage);
      return newMessage;
    }
  },
  Channel: {
    latestMessage: (obj: Channel) =>
      obj.messages.reduce((prev: Message, curr: Message) => {
        const d1 = new Date(prev.date).getTime();
        const d2 = new Date(curr.date).getTime();
        if (d2 > d1) {
          return curr;
        }
        return prev;
      })
  }
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// Initialize the app
const app = express();

app.use(cors());

// The GraphQL endpoint
app.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

// Start the server
app.listen(3000, () => {
  console.log("Go to http://localhost:3000/graphiql to run queries!");
});
