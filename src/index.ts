import "reflect-metadata";
import {ApolloServer} from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import * as Express from 'express';
import { createConnection } from "typeorm";
import RegisterResolver  from './modules/user/Register'

// instanciate server within a main function so we can use async/await 
const main = async () => {
    // createConnection will read from ormconfig.json to make the connection to the database. 
    await createConnection()
    // ApolloServer constructor requires a schema or type definitions. 
    // that's where graphql comes in..
    const schema = await buildSchema({
        resolvers: [RegisterResolver],
    });
    const apolloServer = new ApolloServer({schema})

    // instantiate application
    const app = Express()
    // pass application to apolloServer via the 
    // applyMiddleware function. 
    apolloServer.applyMiddleware({app})
    // set server port to listen on. 
    app.listen(4000, () => {
        console.log(`
        **************************************

            Server Started on http://localhost:4000/graphql
        
        **************************************
        `);
    })

}

main()