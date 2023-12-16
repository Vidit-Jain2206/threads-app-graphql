import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  app.get("/", (req, res) => {
    console.log("Hello");
  });

  const typeDefs = `
  type USER{
    id:ID!
    username:String!
    password:String!
    profilePic :String!
  }
  type Query{
    hello:String
  }
  `;

  //create graphql Server
  const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: {
      Query: {
        hello: () => "Hey there, I am graphql Server",
      },
    },
  });

  //start the graphql server
  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.listen(PORT, () => {
    console.log(`Server is running on PORT - ${PORT}`);
  });
}

init();
