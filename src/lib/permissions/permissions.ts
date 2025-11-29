import { createAccessControl,  } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";
import { defaultStatements as defaultOrganizationStatements, adminAc as adminOrganizationAc, memberAc as memberOrganizationAc, ownerAc as ownerOrganizationAc } from "better-auth/plugins/organization/access";

export const statements = {
    ...defaultStatements,
    mission: ["create", "update", "delete"],
    report: ["create", "update", "delete"],
    magazine: ["create", "update", "delete"],
    user: ["create", "update", "delete", "list", "set-role", "ban", "impersonate", "delete", "set-password", "update"],
    role: ["create", "update", "delete"],
    permission: ["create", "update", "delete"],
    settings: ["create", "update", "delete"],
    ...defaultOrganizationStatements,
    noAccess: [],
} as const;


export const ac = createAccessControl(statements);
 
export const u1 = ac.newRole({ 
    mission: ["create"],
    ...memberOrganizationAc.statements,
}); 

export const u2 = ac.newRole({ 
    mission: ["create", "update"],
    ...memberOrganizationAc.statements,
}); 

export const u3 = ac.newRole({
    mission: ["create", "update"],
    ...memberOrganizationAc.statements,
}); 
 
export const u4 = ac.newRole({
    ...adminAc.statements,
    mission: ["create", "update"],
    ...adminOrganizationAc.statements,
});

export const u5 = ac.newRole({
    ...adminAc.statements,
    ...ownerOrganizationAc.statements,
});
 