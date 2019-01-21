import { Connection } from "typeorm";
import { gCall } from "../../../testUtils/gCall";
import { testConn } from "../../../testUtils/testConn";
// since we'll be making calls to the database, 
// we must first establish a connection. 

// instantiate Connection
let conn: Connection; 
// beforeAll is a method available to us via Jest in .test files.
beforeAll( async () => {
    // we do NOT pass in 'true' to testcon here because we only want
    // to drop database upon test initiation. 
    conn = await testConn()
})

afterAll( async () => {
    // if we hover over .close(), it shows us that .close() returns 
    // a promise. 
    await conn.close()
})
// define the mutation
const registerMutation = `
mutation Register($data: RegisterInput!) {
  register(
    data: $data
  ) {
    id
    firstName
    lastName
    email
    name
  }
}
`;

describe("Register", () => {
    it("create user", async () => {
        console.log(
            await gCall({
                source: registerMutation,
                variableValues: {
                    data: {
                        firstName: "bob",
                        lastName: "bob2",
                        email: "bob@bob.com",
                        password: "asdfasdf"
                    }
                }
            })
        );
    });
});