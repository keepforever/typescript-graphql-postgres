"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const redis_1 = require("./redis");
const cors_1 = __importDefault(require("cors"));
const Register_1 = require("./modules/user/Register");
const Login_1 = require("./modules/user/Login");
const Me_1 = require("./modules/user/Me");
const ConfirmUser_1 = require("./modules/user/ConfirmUser");
const main = () => __awaiter(this, void 0, void 0, function* () {
    let retries = 10;
    while (retries) {
        try {
            yield typeorm_1.createConnection();
            break;
        }
        catch (err) {
            console.log(err);
            retries -= 1;
            console.log(`${retries} retries remaining...`);
            yield new Promise(res => {
                console.log(`
                    test env var 
                    ${process.env.DB_HOST}
                `);
                setTimeout(res, 5000);
            });
        }
    }
    const schema = yield type_graphql_1.buildSchema({
        resolvers: [
            Register_1.RegisterResolver,
            Login_1.LoginResolver,
            Me_1.MeResolver,
            ConfirmUser_1.ConfirmUserResolver
        ],
        authChecker: ({ context: { req } }) => {
            return !!req.session.userId;
        },
    });
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema,
        formatError: type_graphql_1.formatArgumentValidationError,
        context: ({ req }) => ({ req }),
    });
    const app = express_1.default();
    const RedisStore = connect_redis_1.default(express_session_1.default);
    app.use(cors_1.default({
        credentials: true,
        origin: 'http://localhost:3000',
    }));
    app.use(express_session_1.default({
        store: new RedisStore({
            client: redis_1.redis,
        }),
        name: 'qid',
        secret: process.env.INDEX_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
        },
    }));
    console.log('before applyMiddlware');
    apolloServer.applyMiddleware({ app });
    console.log('after applyMiddlware');
    app.listen(4000, () => {
        console.log(`
        **************************************

            Server Started on http://localhost:4000/graphql
        
        **************************************
        `);
    });
});
main();
//# sourceMappingURL=index.js.map