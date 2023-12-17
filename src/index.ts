import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prismaclient } from "./lib/db";
import { createGrpahqlServer } from "./graphql";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  //create graphql Server
  const server = await createGrpahqlServer();
  app.use("/graphql", expressMiddleware(server));

  app.listen(PORT, () => {
    console.log(`Server is running on PORT - ${PORT}`);
  });
}

init();
