import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "./generated/prisma";
 
const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    pages: {
        signIn: "/auth/signin",
        signUp: "/auth/signup",
    },
    trustedOrigins: [
        "http://localhost:3000",
    ],
});