import { Resolver, Mutation, Arg } from "type-graphql";
import { v4 } from "uuid";

import { sendEmail } from "../utils/sendEmail";
import { User } from "../../entity/User";
import { redis } from "../../redis";
import { forgotPasswordPrefix } from "../constants/redisPrefixes";

@Resolver()
export class ForgotPasswordResolver {
    @Mutation(() => Boolean)
    async forgotPassword(@Arg("email") email: string): Promise<boolean> {
        // check for user in postgres by email. 
        const user = await User.findOne({ where: { email } });

        // if NO user, return true. 
        // email NOT sent. 
        if (!user) {
            return true;
        }

        // generate token
        const token = v4();

        // set key/value pair in redis, { token: user.Id }
        // it will expire in 60 * 60 * 24 (1 day)
        await redis.set(forgotPasswordPrefix + token, user.id, "ex", 60 * 60 * 24); // 1 day expiration

        // send email. 
        await sendEmail(
            email,
            `http://localhost:3000/user/change-password/${token}`
        );

        // still return true to throw of potential password-fishermen.
        return true;
    }
}