import { testConn } from './testConn';

// we call .then because sometimes node glitches and 
// process.exit helps assure the process is quit upon 
// completion of the tests. 
testConn(true).then(() => process.exit)