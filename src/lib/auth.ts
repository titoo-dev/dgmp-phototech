import { User, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "./generated/prisma";
import { admin as adminPlugin, openAPI } from "better-auth/plugins";
import { ac, u1, u2, u3, u4, u5 } from "./permissions/permissions";
import { Resend } from "resend";
import { InvitationTemplate } from "@/components/template/invitation-template";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins"

const resend = new Resend(process.env.RESEND_API_KEY);

const prisma = new PrismaClient();


const sendInvitationEmail = async (data: any) => {
    const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/signup/${data.invitation.id}?email=${encodeURIComponent(data.email)}`;

    const inviterUser = data.inviter.user || data.inviter;

    const { data: emailData, error } = await resend.batch.send([
        {
            from: 'MarketScan <noreply@titosy.dev>',
            to: [data.email],
            subject: `Invitation à rejoindre ${data.organization.name}`,
            react: InvitationTemplate({
                inviterName: inviterUser.name,
                organizationName: data.organization.name,
                organizationLogo: data.organization.logo || null,
                role: data.role,
                invitationUrl,
            }),
        }
    ]);

    if (error) {
        console.error("Error sending invitation email:", error);
    }

    console.log("Invitation email sent:", emailData);
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
