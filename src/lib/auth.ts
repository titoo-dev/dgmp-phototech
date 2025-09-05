import { User, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "./generated/prisma";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, u1, u2, u3, u4 } from "./permissions/permissions";
import { Resend } from "resend";
import { VerificationTemplate } from "@/components/template/verification-template";
import { nextCookies } from "better-auth/next-js";
 
const resend = new Resend(process.env.RESEND_API_KEY);

const prisma = new PrismaClient();

const sendVerificationEmail = async ({ user, url }: { user: User, url: string }) => {
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
};

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
        `${process.env.NEXT_PUBLIC_APP_URL}`,
    ],
    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail,
    },
    plugins: [
        nextCookies(),
        adminPlugin({
            ac,
            roles: {
                u1,
                u2,
                u3,
                u4
            },
            adminRoles: ['u4'],
            adminUserIds: ['vtSUjR6YWn3ov2sDMkyzwe36LDes8X7b'],
            defaultRole: 'u1',
            defaultBanExpiresIn: 30,
            bannedUserMessage: 'Votre compte a été banni. Veuillez contacter l\'administrateur.',
            defaultBanReason: 'Banni par l\'administrateur.',
        })
    ],
});
