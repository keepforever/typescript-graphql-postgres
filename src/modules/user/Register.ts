import { Resolver, Query, Mutation, Arg, FieldResolver, Root } from 'type-graphql';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entity/User';

@Resolver(User) // using @FieldResolver to 'do stuff' with the name property necessitates User being passed into this resolver. 
export default class RegisterResolver {
    @Query(() => User /* graphql schema type */)
    async hello() {
        return 'Hello World!';
    }

    // because User was passed into this function, this resolver can 'do stuff' to, and return a value for, a property name, (here, "name"), that can be passed into @Resolver(), in this case "User0"
    @FieldResolver()
    async name(@Root() parent: User) { // root decorates parent argument
        // in this case, User is going to be the value 'user' that is returned from register() below. 
        return `${parent.firstName} ${parent.lastName}`;
    }

    @Mutation(() => User /* we cannot just pass a "User" type here.  We need to annotate the User entity so that it's suitable to be passed in.  */)
    async register(
        @Arg('firstName' /* name of argument in graphql schema */)
        firstName: /* name the variable in this function */ string /* type for typescript */,
        @Arg('lastName') lastName: string,
        @Arg('email') email: string,
        @Arg('password') password: string,
    /* tell typescript what an appropriate return value for this resolver is */
    ): Promise<User> {
        // in general, do stuff here...

        // hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        // store hashed password in database
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        }).save();

        // because we set register(...): Promise <User>, typescript would yell if we attempted to return anything other than a User here.
        return user;
    }
}


// // @Resolver imported from type
// @Resolver()
// class HelloResolver {
//     @Query(() => String, {
//         // the "name" option passed in overrides the "hello" name we give the query below.  Could also
//         // just replace "hello" after async below.
//         name: 'helloWorld',
//         // allow for null to be returned
//         nullable: true,
//         description:
//             "A resolver that returns 'Hello World!'. This will show up in the schema documentation visible in GraphQL Playground.",
//         // there are more options but the ones shown
//         // are the most commonly used.
//     })
//     // hello will be overridden by "helloWorld" due to name option.
//     async hello() {
//         return 'Hello World!';
//     }
// }
