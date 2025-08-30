import { createAuthClient } from "better-auth/react"
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, u1, u2, u3, u4 } from "./permissions/permissions";

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000",
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
        })
    ]
})