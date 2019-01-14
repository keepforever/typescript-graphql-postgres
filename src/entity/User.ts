import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType() // turns User entity into a graphql object type
@Entity()
export class User extends BaseEntity {
    @Field(() => ID) // @Field() tells graphql which fields to expose to be query-able
    @PrimaryGeneratedColumn()
    id: number; // we pass ID into field so that it can determine what type of number "number" is. 

    @Field()
    @Column()
    firstName: string;

    @Field()
    @Column()
    lastName: string;

    @Field()
    @Column('text', { unique: true })
    email: string;
    
    @Column()
    password: string;

    // this property is missing it's column flag, so, while it will be exposed to the schema, it will not be a database column, rather, it may be used to calulate another value that does get saved, i.e. name = firstName + lastName
    @Field()
    name: string;
}