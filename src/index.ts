import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prismaclient } from "./lib/db";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  app.get("/", (req, res) => {
    console.log("Hello");
  });

  const typeDefs = `
  type USER{

    salt:String!
    id:ID!
    lastName:String!
    firstName:String!
    password:String!
    email:String!
    profileImageURL :String
  }
  type Query{
    hello:String
    getAllUSers:[USER]
  }

  type Mutation{
    createUser(firstName:String! , lastName:String!, email:String!,password:String!):Boolean
  }
  `;

  //create graphql Server
  const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: {
      Query: {
        hello: () => "Hey there, I am graphql Server",
        getAllUSers: async () => {
          return await prismaclient.user.findMany();
        },
      },
      Mutation: {
        createUser: async (
          _,
          {
            firstName,
            lastName,
            email,
            password,
          }: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
          }
        ) => {
          await prismaclient.user.create({
            data: {
              email,
              firstName,
              lastName,
              password,
              salt: "random_Salt",
            },
          });
          return true;
        },
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
