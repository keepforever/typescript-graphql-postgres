import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "../../entity/User";
import { redis } from "../../redis";
import { forgotPasswordPrefix } from "../constants/redisPrefixes";
import { ChangePasswordInput } from "./changePassword/ChangePasswordInput";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class ChangePasswordResolver {
    @Mutation(() => User, { nullable: true })
    async changePassword(
        @Arg("data") // 'data' is bein destructured to { token, password }, just like any other variable you might destructure because you want to use it's properties in the function block. 
        { token, password }: ChangePasswordInput,
        @Ctx() ctx: MyContext
    ): Promise<User | null> {
        // check redis to see if token that shold have been created in 
        // ForgotPasswordResolver exists, and retreive the key (userId)
        const userId = await redis.get(forgotPasswordPrefix + token);

        // if no user, return null
        if (!userId) {
            return null;
        }
        // retreive user by id
        const user = await User.findOne(userId);
        // if this retreival fails, return null.
        if (!user) {
            return null;
        }
        // remove token from redis
        await redis.del(forgotPasswordPrefix + token);
        // set new user password after hashing
        user.password = await bcrypt.hash(password, 12);
        // save updates to user object to database
        await user.save();
        
        // send back cookie to use for auth
        // basically, same thing we do when we log in the user.
        ctx.req.session!.userId = user.id;

        // return user, now updated with a new password, 
        // but that will not be evident in what is returned. 
        return user;
    }
}