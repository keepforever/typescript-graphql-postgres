## Database Testing:

-   create fresh database
-   check connection
-   run mutations and queries
-   verifty expected behavior
-   destroy test database upon test completion.

we will write a script to drop database before tests start.

we add a script to package.json

```json
{
    "scripts": {
        "start": "nodemon --exec ts-node src/index.ts",
        "db:setup": "ts-node src/test-utils/setup.ts",
        "test": "npm run db:setup && jest"
    }
}
```

test runs the intermitant 'db:setup' prior to running tests. 

### We create a database locally, naming the database after what we named the database in testConn

```sh
createdb typegraphql-example-test
```