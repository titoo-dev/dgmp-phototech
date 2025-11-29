import { User, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "./generated/prisma";
import { admin as adminPlugin, openAPI } from "better-auth/plugins";
import { ac, u1, u2, u3, u4, u5 } from "./permissions/permissions";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import { sendVerificationEmail as sendBrevoVerificationEmail, sendInvitationEmail as sendBrevoInvitationEmail } from "./email/send-email";

const prisma = new PrismaClient();

const sendVerificationEmail = async ({ user, url }: { user: User, url: string }) => {
    try {
        const result = await sendBrevoVerificationEmail(
            user.email,
            url,
            user.name
        );
        console.log("Verification email sent:", result);
    } catch (error) {
        console.error("Error sending verification email:", error);
    }
};

const sendInvitationEmail = async (data: any) => {
    const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/signup/${data.invitation.id}?email=${encodeURIComponent(data.email)}`;

    const inviterUser = data.inviter.user || data.inviter;

    try {
        const result = await sendBrevoInvitationEmail(
            data.email,
            invitationUrl,
            inviterUser.name,
            data.organization.name,
            data.role,
            data.organization.logo || null
        );
        console.log("Invitation email sent:", result);
    } catch (error) {
        console.error("Error sending invitation email:", error);
    }
};

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        disableSignUp: false,
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
                u4,
                u5
            },
            adminRoles: ['u4', 'u5'],
            adminUserIds: [],
            defaultRole: 'u5',
            defaultBanExpiresIn: 30,
            bannedUserMessage: 'Votre compte a été banni. Veuillez contacter l\'administrateur.',
            defaultBanReason: 'Banni par l\'administrateur.',
        }),
        openAPI(),
        organization({
            sendInvitationEmail,
            ac, 
            roles: {                
                u1,
                u2,
                u3,
                u4,
                u5,
            },
        }),
    ],
});
