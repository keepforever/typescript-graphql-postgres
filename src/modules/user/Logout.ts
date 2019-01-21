import { Resolver, Mutation, Ctx } from "type-graphql";
import { MyContext } from "../../types/MyContext";
import { cookieName } from '../constants/cookieName';

@Resolver()
export class LogoutResolver {
    @Mutation(() => Boolean)
    async logout(@Ctx() ctx: MyContext): Promise<Boolean> {
        return new Promise((res, rej) =>
            ctx.req.session!.destroy(err => {
                if (err) {
                    console.log(err);
                    return rej(false);
                }

                ctx.res.clearCookie(cookieName);
                return res(true);
            })
        );
    }
}