import { createConnection } from "typeorm";

// we will use the 'drop' variable to toggle if the database is getting dropped when we call this testConn function
export const testConn = (drop: boolean = false) => {
    return createConnection({
        // same as ormconfig.json
        name: "default",
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "postgres",
        database: "typegraphql-example-test",
        synchronize: drop,
        dropSchema: drop,
        entities: [__dirname + "../entity/*.*"]
    })
}