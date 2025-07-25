import { StringExpressionOperatorReturningBoolean } from "mongoose";
import NextAuth from "next-auth";
import type { DefaultSession } from "next-auth";

declare module 'next-auth'{
    interface User{
        _id?:string,
        isVerified?:boolean,
        isAcceptingMessages?:boolean,
        username?:string
    }
    interface Session{
        user:{
        _id?:string,
        isVerified?:boolean,
        isAcceptingMessages?:boolean,
        username?:string
    }& DefaultSession["user"]

}
}

declare module 'next-auth/jwt'{
    interface JWT{
        _id?:string,
        isVerified?:boolean,
        isAcceptingMessages?:boolean,
        username?:string
    }

}

// types.ts
export interface GeminiRequest {
    prompt: string;
  }
  