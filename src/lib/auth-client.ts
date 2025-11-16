import { createAuthClient } from "better-auth/react"
import { admin as adminPlugin } from "better-auth/plugins";
import { organizationClient } from "better-auth/client/plugins";
import { ac, u1, u2, u3, u4, u5 } from "./permissions/permissions";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        adminPlugin({
            ac,
            roles: {
                u1,
                u2,
                u3,
                u4
            },
            adminRoles: ['u4']
        }),
        organizationClient({
            ac,
            roles: {
                u1,
                u2,
                u3,
                u4,
                u5
            }
        })
    ]
})