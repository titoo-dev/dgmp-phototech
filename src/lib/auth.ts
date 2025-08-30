import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "./generated/prisma";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, u1, u2, u3, u4, user } from "./permissions/permissions";
import { Resend } from "resend";
import { VerificationTemplate } from "@/components/template/verification-template";
 
const resend = new Resend(process.env.RESEND_API_KEY);

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        disableSignUp: process.env.DISABLE_SIGN_UP === "true",
    },
    trustedOrigins: [
        "http://localhost:3000",
    ],
    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ( { user, url }, request) => {
            const { data, error } = await resend.batch.send([
                {
                    from: 'PhotoTech <noreply@titosy.dev>',
                    to: [user.email],
                    subject: 'PhotoTech Email Verification',
                    react: VerificationTemplate({ firstName: user.name, url }),
                }
            ]);

            if (error) {
                console.error(error);
            }

            console.log(data);
        },
    },
    plugins: [
        adminPlugin({
            ac,
            roles: {
                user,
                u1,
                u2,
                u3,
                u4
            },
            adminRoles: ['u4'],
            adminUserIds: ['cOZUyOxSlC4KjS5nxbEH5ZqttgBRTVqQ', 't3KtxdCKQGi6L8Vpr275XFWnxgIMpeqP'],
        })
    ]
});
