# Simplified Invitation Flow

## Overview
Users invited to organizations are redirected directly to signup, with automatic invitation acceptance and organization membership creation.

## Flow Diagram

```
User clicks invitation link
          ↓
Check invitation status (expired, accepted, rejected)
          ↓
Check if user already exists with that email
          ↓
     [User exists?]
          ↓
    Yes → Show error (contact admin)
          ↓
    No → Redirect to /auth/signup?invitationId=xxx&email=xxx
          ↓
User fills signup form (email locked to invitation email)
          ↓
Auto sign-in enabled (betterAuth config)
          ↓
After signup:
  1. Assign role from invitation to user
  2. Accept invitation (status = 'accepted')
  3. Create member record in organization
  4. Redirect to /dashboard
```

## Key Features

### 1. Direct Signup Redirect
- No intermediate invitation acceptance page
- User clicks invitation link → Goes straight to signup
- Email is pre-filled and locked (disabled field)

### 2. Email Validation
- Email in signup form must match invitation email
- Cannot signup with different email
- Enforced both client-side (disabled field) and server-side

### 3. Auto Sign-In
- After successful signup, user is automatically signed in
- No need to verify email then sign in manually
- Seamless onboarding experience

### 4. Automatic Invitation Processing
After signup completion:
- User role is set to invitation role (u1, u2, u3, u4, or u5)
- Invitation status updated to "accepted"
- Member record created in organization
- User immediately has access to organization

### 5. Existing User Handling
If user already exists with invitation email:
- Show informative error message
- Suggest contacting administrator
- Prevents duplicate accounts

## Files Modified

### 1. `src/lib/auth.ts`
```typescript
emailAndPassword: {
  enabled: true,
  autoSignIn: true,  // Changed from false
  disableSignUp: false,
}
```

### 2. `src/app/invitation/[id]/page.tsx`
- Removed all session/auth logic
- Removed invitation acceptance UI
- Simply validates invitation and redirects to signup
- Handles edge cases (expired, accepted, rejected, existing user)

### 3. `src/actions/sign-up.ts`
- Added automatic invitation acceptance logic
- Creates member record after signup
- Updates invitation status to "accepted"
- Always redirects to /dashboard after successful signup with invitation

### 4. `src/app/auth/signup/signup-client.tsx`
- Email field is disabled when invitationId present
- Shows helper text explaining locked email
- Better visual feedback for invitation signups

## Edge Cases Handled

### ✅ Invitation Already Accepted
Shows: "Invitation déjà acceptée - Vous êtes déjà membre de cette organisation"

### ✅ Invitation Rejected
Shows: "Invitation refusée - Cette invitation a été refusée"

### ✅ Invitation Expired
Shows: "Invitation expirée - Cette invitation a expiré le [date]"

### ✅ Invitation Not Found
Shows: "Invitation introuvable - Cette invitation n'existe pas ou a été supprimée"

### ✅ User Already Exists
Shows: "Compte déjà existant - Veuillez contacter l'administrateur"

### ✅ Invalid Invitation Data
Server-side validation in sign-up action handles all validation errors

## User Experience

### For New Users:
1. Receive invitation email
2. Click invitation link
3. Fill out signup form (email pre-filled)
4. Submit
5. **Automatically signed in and redirected to dashboard**
6. Ready to use the organization immediately

### Time Saved:
- Before: Click link → Accept → Verify email → Sign in → Use app (4 steps)
- After: Click link → Sign up → Use app (2 steps)

## Security Considerations

✅ Email validation ensures only invited email can signup
✅ Invitation expiration prevents old links from working
✅ Status checks prevent duplicate accepts
✅ Server-side validation on all inputs
✅ Role assignment is controlled by inviter

## Database Changes

After successful invitation signup, the following records are created/updated:

1. **User Record**
   - New user created with invited email
   - Role set to invitation role

2. **Invitation Record**
   - Status updated from "pending" to "accepted"

3. **Member Record**
   - New member created linking user to organization
   - Role copied from invitation

## Testing Checklist

- [ ] Send invitation to new email
- [ ] Click invitation link → Should redirect to signup
- [ ] Email field should be locked/disabled
- [ ] Submit signup form
- [ ] Should automatically sign in
- [ ] Should redirect to dashboard
- [ ] Check user has correct role
- [ ] Check invitation status is "accepted"
- [ ] Check member record exists
- [ ] Try clicking invitation link again → Should show "already accepted"
- [ ] Try inviting existing user → Should show error message
- [ ] Try using expired invitation → Should show expired message

---

**Last Updated**: November 2025
**Version**: 2.0 (Simplified Flow)

