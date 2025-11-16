# Admin Signup Guide

## Overview
This document describes the admin signup feature for initial system setup.

## Purpose
The admin signup page allows creating the first administrator accounts without requiring an invitation. This is essential for bootstrapping the system.

## Access URL
```
/auth/admin-signup
```

## Configuration

### Enable Admin Signup
Add this to your `.env.local` file:
```env
ENABLE_ADMIN_SIGNUP="true"
```

### Disable Admin Signup (After Initial Setup)
Change the value to false:
```env
ENABLE_ADMIN_SIGNUP="false"
```

## Available Admin Roles

### U5 - Gestionnaire organisation
- Organization manager role
- Can manage organizations, invite members, and handle organization-related tasks
- Recommended for initial setup

### U4 - Administrateur système  
- System administrator role
- Full system access with elevated privileges
- Use sparingly for security purposes

## Setup Process

1. **Initial Configuration**
   ```bash
   # In your .env.local file
   ENABLE_ADMIN_SIGNUP="true"
   ```

2. **Create Admin Account**
   - Navigate to `http://localhost:3000/auth/admin-signup`
   - Fill in the required information:
     - Full name
     - Email address
     - Password (minimum 8 characters)
     - Phone number (optional)
     - Admin role (U4 or U5)
   - Submit the form

3. **Verify Email**
   - Check your email for verification link
   - Click the verification link to activate your account

4. **Disable Admin Signup**
   ```bash
   # In your .env.local file
   ENABLE_ADMIN_SIGNUP="false"
   ```

5. **Login and Start Using**
   - Go to `/auth/signin`
   - Login with your admin credentials
   - Start inviting users and managing the system

## Security Considerations

⚠️ **IMPORTANT**: Always disable the admin signup page after creating your initial admin accounts.

- The admin signup page bypasses invitation requirements
- Leaving it enabled poses a security risk
- Only enable it temporarily for initial setup or adding new admins
- Regularly audit admin accounts and remove unused ones

## Troubleshooting

### Page Redirects to Sign In
- Check that `ENABLE_ADMIN_SIGNUP="true"` in your `.env.local`
- Restart your development server after changing environment variables

### Already Logged In
- The page will redirect to dashboard if you're already authenticated
- Logout first if you need to create another admin account

### Role Not Applied
- Verify the role was saved by checking the user record in the database
- The role should be either "u4" or "u5" in the User table

## Files Modified/Created

- `src/actions/admin-sign-up.ts` - Server action for admin signup
- `src/app/auth/admin-signup/page.tsx` - Admin signup page (server component)
- `src/app/auth/admin-signup/admin-signup-client.tsx` - Admin signup form (client component)

## Environment Variables

```env
# Enable/Disable admin signup page
ENABLE_ADMIN_SIGNUP="true"  # Set to "false" after initial setup
```

## Next Steps After Admin Creation

1. Create organizations for your teams
2. Invite users to organizations with appropriate roles:
   - U1: Agent de terrain
   - U2: Responsable missions
   - U3: Rédacteur magazine
   - U4: Administrateur système
   - U5: Gestionnaire organisation
3. Set up projects and missions
4. Configure system settings

---

**Last Updated**: November 2025
**Version**: 1.0

