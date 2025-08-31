import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

export const statement = {
    ...defaultStatements,
    mission: ["create", "update", "delete"],
    report: ["create", "update", "delete"],
    magazine: ["create", "update", "delete"],
    user: ["create", "update", "delete"],
    role: ["create", "update", "delete"],
    permission: ["create", "update", "delete"],
    settings: ["create", "update", "delete"],
    noAccess: [],
} as const;
 
export const ac = createAccessControl(statement);
 
export const u1 = ac.newRole({ 
    mission: ["create"], 
}); 

export const u2 = ac.newRole({ 
    mission: ["create", "update"],
}); 

export const u3 = ac.newRole({
    mission: ["create", "update"],
}); 
 
// @ts-ignore
export const u4 = ac.newRole({ 
    mission: ["create", "update"],
    ...adminAc.statements,
}); 
 