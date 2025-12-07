import { betterAuth, User } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "./generated/prisma";
import { admin as adminPlugin, openAPI } from "better-auth/plugins";
import { ac, u1, u2, u3, u4, u5 } from "./permissions/permissions";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import {
  sendVerificationEmail as sendBrevoVerificationEmail,
  sendInvitationEmail as sendBrevoInvitationEmail,
} from "./email/send-email";

const prisma = new PrismaClient();

const sendVerificationEmail = async ({
  user,
  url,
}: {
  user: User;
  url: string;
}) => {
  try {
    const result = await sendBrevoVerificationEmail(user.email, url, user.name);
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
      data.organization.logo || null,
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
  trustedOrigins: [`${process.env.NEXT_PUBLIC_APP_URL}`],
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail,
  },
  plugins: [
    nextCookies(),
    adminPlugin({
      ac: ac,
      roles: {
        u1,
        u2,
        u3,
        u4,
        u5,
      },
      adminRoles: ["u4", "u5"],
      adminUserIds: [],
      defaultRole: "u5",
      defaultBanExpiresIn: 30,
      bannedUserMessage:
        "Votre compte a été banni. Veuillez contacter l'administrateur.",
      defaultBanReason: "Banni par l'administrateur.",
    }),
    openAPI(),
    organization({
      sendInvitationEmail,
      organizationHooks: {
        beforeCreateOrganization: async (data: any) => {
          console.log("beforeCreateOrganization", data);
          return {
            ...organization,
          };
        },
        afterCreateOrganization: async (organization: any) => {
          console.log("afterCreateOrganization", organization);
        },
        beforeUpdateOrganization: async (data: any) => {
          console.log("beforeUpdateOrganization", data);
          return {
            ...data,
          };
        },
        afterUpdateOrganization: async (organization: any) => {
          console.log("afterUpdateOrganization", organization);
        },
        beforeAddMember: async ({ member, user, organization }: any) => {
          console.log(`Adding ${user.email} to ${organization.name}`);
          return {
            data: {
              ...member,
            },
          };
        },
        afterAddMember: async ({ member, user, organization }: any) => {
          console.log("afterAddMember", member, user, organization);
        },
        beforeRemoveMember: async ({ member, user, organization }: any) => {
          console.log("beforeRemoveMember", member, user, organization);
        },
        afterRemoveMember: async ({ member, user, organization }: any) => {
          console.log("afterRemoveMember", member, user, organization);
        },
        beforeUpdateMemberRole: async ({
          member,
          newRole,
          user,
          organization,
        }: any) => {
          console.log(
            "beforeUpdateMemberRole",
            member,
            newRole,
            user,
            organization,
          );
          return {
            data: {
              role: newRole,
            },
          };
        },
        afterUpdateMemberRole: async ({
          member,
          previousRole,
          user,
          organization,
        }: any) => {
          console.log(
            "afterUpdateMemberRole",
            member,
            previousRole,
            user,
            organization,
          );
        },
        afterCreateInvitation: async ({
          invitation,
          inviter,
          organization,
        }: any) => {
          console.log(
            "afterCreateInvitation",
            invitation,
            inviter,
            organization,
          );
        },
        afterAcceptInvitation: async ({
          invitation,
          member,
          user,
          organization,
        }: any) => {
          // Setup user account, assign default resources
          console.log(
            "afterAcceptInvitation",
            invitation,
            member,
            user,
            organization,
          );
        },
        afterRejectInvitation: async ({
          invitation,
          user,
          organization,
        }: any) => {
          console.log("afterRejectInvitation", invitation, user, organization);
        },
        afterCancelInvitation: async ({
          invitation,
          cancelledBy,
          organization,
        }: any) => {
          console.log(
            "afterCancelInvitation",
            invitation,
            cancelledBy,
            organization,
          );
        },
      },
      ac,
      roles: {
        u1,
        u2,
        u3,
        u4,
        u5,
      },
      creatorRole: "u5",
    }),
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        enum: ["u1", "u2", "u3", "u4", "u5"],
        default: "u5",
      },
    },
  },
});
