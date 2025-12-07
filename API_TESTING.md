# API Testing Guide

This guide contains curl commands to test all API endpoints. Replace the placeholders before running:

- `{{BASE_URL}}` - Your app URL (e.g., `http://localhost:3000`)
- `{{TOKEN}}` - Your session token (get from browser cookies: `better-auth.session_token`)
- `{{ID}}` - Resource IDs (company, contact, project, mission, user)

## Prerequisites

### Get your session token
1. Login to the app in your browser
2. Open DevTools > Application > Cookies
3. Copy the value of `better-auth.session_token`

### Set environment variables (optional)
```bash
export BASE_URL="http://localhost:3000"
export TOKEN="your-session-token-here"
```

---

## Companies API

### List all companies
```bash
curl -X GET "${BASE_URL}/api/companies" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

### List companies with search
```bash
curl -X GET "${BASE_URL}/api/companies?search=entreprise" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

### Create a company
```bash
curl -X POST "${BASE_URL}/api/companies" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  -d '{
    "name": "Entreprise Test",
    "email": "contact@entreprise-test.ga",
    "phoneNumber": "+241 01 23 45 67",
    "nif": "NIF123456789",
    "employeeCount": 50
  }' \
  | jq '.'
```

### Get a single company
```bash
curl -X GET "${BASE_URL}/api/companies/{{COMPANY_ID}}" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

### Update a company
```bash
curl -X PUT "${BASE_URL}/api/companies/{{COMPANY_ID}}" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  -d '{
    "name": "Entreprise Test Modifiee",
    "employeeCount": 75
  }' \
  | jq '.'
```

### Delete a company
```bash
curl -X DELETE "${BASE_URL}/api/companies/{{COMPANY_ID}}" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

---

## Contacts API

### List all contacts
```bash
curl -X GET "${BASE_URL}/api/contacts" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

### Create a contact
```bash
curl -X POST "${BASE_URL}/api/contacts" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.ga"
  }' \
  | jq '.'
```

### Get a single contact
```bash
curl -X GET "${BASE_URL}/api/contacts/{{CONTACT_ID}}" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

### Update a contact
```bash
curl -X PUT "${BASE_URL}/api/contacts/{{CONTACT_ID}}" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  -d '{
    "firstName": "Jean-Pierre",
    "lastName": "Dupont"
  }' \
  | jq '.'
```

### Delete a contact
```bash
curl -X DELETE "${BASE_URL}/api/contacts/{{CONTACT_ID}}" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

---

## Projects API

### List all projects
```bash
curl -X GET "${BASE_URL}/api/projects" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

### Create a project
```bash
curl -X POST "${BASE_URL}/api/projects" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  -d '{
    "title": "Construction Route Nationale",
    "description": "Construction de la route nationale N1",
    "startDate": "2025-01-01T00:00:00.000Z",
    "endDate": "2025-12-31T00:00:00.000Z",
    "status": "UNCONTROLLED",
    "nature": "SERVICES",
    "companyId": "{{COMPANY_ID}}"
  }' \
  | jq '.'
```

### Get a single project
```bash
curl -X GET "${BASE_URL}/api/projects/{{PROJECT_ID}}" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

### Update a project
```bash
curl -X PUT "${BASE_URL}/api/projects/{{PROJECT_ID}}" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  -d '{
    "title": "Construction Route Nationale - Phase 2",
    "description": "Extension du projet initial"
  }' \
  | jq '.'
```

### Update project status only
```bash
curl -X PUT "${BASE_URL}/api/projects/{{PROJECT_ID}}/status" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  -d '{
    "status": "CONTROLLED_IN_PROGRESS"
  }' \
  | jq '.'
```

### Delete a project
```bash
curl -X DELETE "${BASE_URL}/api/projects/{{PROJECT_ID}}" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

### Get projects by company
```bash
curl -X GET "${BASE_URL}/api/projects/by-company/{{COMPANY_ID}}" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

---

## Missions API

### List all missions
```bash
curl -X GET "${BASE_URL}/api/missions" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

### Create a mission (with JSON)
```bash
curl -X POST "${BASE_URL}/api/missions" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  -d '{
    "missionNumber": "MIS-2025-001",
    "teamLeaderId": "{{USER_ID}}",
    "startDate": "2025-01-15",
    "endDate": "2025-01-20",
    "location": "Libreville, Gabon",
    "agentCount": 3,
    "marketCount": 2,
    "members": ["{{CONTACT_ID_1}}", "{{CONTACT_ID_2}}"],
    "projects": [
      {
        "projectId": "{{PROJECT_ID}}",
        "notes": "Inspection initiale du chantier"
      }
    ]
  }' \
  | jq '.'
```

### Get a single mission
```bash
curl -X GET "${BASE_URL}/api/missions/{{MISSION_ID}}" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

### Update a mission
```bash
curl -X PUT "${BASE_URL}/api/missions/{{MISSION_ID}}" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  -d '{
    "missionNumber": "MIS-2025-001-REV",
    "location": "Port-Gentil, Gabon",
    "agentCount": 4
  }' \
  | jq '.'
```

### Update mission status
```bash
curl -X PUT "${BASE_URL}/api/missions/{{MISSION_ID}}/status" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  -d '{
    "status": "PENDING"
  }' \
  | jq '.'
```

### Validate a mission (PENDING -> COMPLETED)
```bash
curl -X POST "${BASE_URL}/api/missions/{{MISSION_ID}}/validate" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

### Review/Reject a mission (PENDING -> REJECTED)
```bash
curl -X POST "${BASE_URL}/api/missions/{{MISSION_ID}}/review" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  -d '{
    "comment": "Photos manquantes pour le marche X. Veuillez ajouter les photos du chantier."
  }' \
  | jq '.'
```

### Send mission for validation (DRAFT -> PENDING)
```bash
curl -X POST "${BASE_URL}/api/missions/send" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  -d '{
    "missionId": "{{MISSION_ID}}"
  }' \
  | jq '.'
```

### Delete a mission
```bash
curl -X DELETE "${BASE_URL}/api/missions/{{MISSION_ID}}" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

### Get missions by team leader
```bash
curl -X GET "${BASE_URL}/api/missions/by-team-leader/{{USER_ID}}" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

---

## Gallery API

### Get all photos (with pagination)
```bash
curl -X GET "${BASE_URL}/api/gallery?page=1&limit=20" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

### Get photos with filters
```bash
curl -X GET "${BASE_URL}/api/gallery?projectId={{PROJECT_ID}}&page=1&limit=10" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

### Get photos by mission
```bash
curl -X GET "${BASE_URL}/api/gallery?missionId={{MISSION_ID}}" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

### Get photos by company
```bash
curl -X GET "${BASE_URL}/api/gallery?companyId={{COMPANY_ID}}" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

### Get photos by date range
```bash
curl -X GET "${BASE_URL}/api/gallery?startDate=2025-01-01&endDate=2025-12-31" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

---

## Users API

### List all users
```bash
curl -X GET "${BASE_URL}/api/users" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

### List users with filters
```bash
curl -X GET "${BASE_URL}/api/users?role=u1&status=active&page=1&limit=10" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

### Search users
```bash
curl -X GET "${BASE_URL}/api/users?search=jean" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

### Invite a new user
```bash
curl -X POST "${BASE_URL}/api/users" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  -d '{
    "email": "nouveau.utilisateur@dgmp.ga",
    "role": "u1"
  }' \
  | jq '.'
```

### Get a single user
```bash
curl -X GET "${BASE_URL}/api/users/{{USER_ID}}" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

### Update a user
```bash
curl -X PUT "${BASE_URL}/api/users/{{USER_ID}}" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  -d '{
    "name": "Nouveau Nom",
    "role": "u2"
  }' \
  | jq '.'
```

### Update user role only
```bash
curl -X PUT "${BASE_URL}/api/users/{{USER_ID}}/role" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  -d '{
    "role": "u2"
  }' \
  | jq '.'
```

### Ban a user
```bash
curl -X POST "${BASE_URL}/api/users/{{USER_ID}}/ban" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  -d '{
    "reason": "Violation des regles d utilisation",
    "expiresIn": 30
  }' \
  | jq '.'
```

### Unban a user
```bash
curl -X DELETE "${BASE_URL}/api/users/{{USER_ID}}/ban" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

### Remove user from organization
```bash
curl -X DELETE "${BASE_URL}/api/users/{{USER_ID}}" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

---

## Images API

### Upload an image
```bash
curl -X POST "${BASE_URL}/api/image" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  -F "file=@/path/to/your/image.jpg" \
  | jq '.'
```

### Get image metadata
```bash
curl -X GET "${BASE_URL}/api/image?url={{IMAGE_URL}}" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

### List all images
```bash
curl -X GET "${BASE_URL}/api/image/list?page=1&limit=20" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

### Delete an image
```bash
curl -X DELETE "${BASE_URL}/api/image?url={{IMAGE_URL}}" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=${TOKEN}" \
  | jq '.'
```

---

## Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Success with Pagination
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalCount": 100,
    "totalPages": 5,
    "hasMore": true
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

### Validation Error Response
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": {
    "fieldName": ["Error message"]
  }
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate, has dependencies) |
| 500 | Internal Server Error |

---

## Role Permissions

| Role | Description | Permissions |
|------|-------------|-------------|
| u1 | Agent | Create missions, manage contacts/companies |
| u2 | Responsable | Validate missions, manage projects/users |
| u3 | Redacteur | View completed missions and gallery |
| u4 | Administrateur | Full access, user management |
| u5 | Super Admin | Organization management |

---

## Enums

### ProjectStatus
- `UNCONTROLLED`
- `CONTROLLED_IN_PROGRESS`
- `CONTROLLED_DELIVERED`
- `CONTROLLED_OTHER`
- `DISPUTED`

### ProjectNature
- `SUPPLY`
- `SERVICES`
- `INTELLECTUAL`
- `PROGRAM`
- `MIXED`
- `CONTROLLED_EXPENSES`

### MissionStatus
- `DRAFT`
- `PENDING`
- `COMPLETED`
- `REJECTED`

### User Status (filter)
- `active` - Not banned, email verified
- `inactive` - Banned
- `pending` - Not banned, email not verified

---

## Tips

### Pretty print without jq
If you don't have `jq` installed, use Python:
```bash
curl ... | python -m json.tool
```

### Windows PowerShell
Replace `\` with backtick `` ` `` for line continuation:
```powershell
curl -X GET "${BASE_URL}/api/companies" `
  -H "Content-Type: application/json" `
  -H "Cookie: better-auth.session_token=${TOKEN}"
```

### Save response to file
```bash
curl ... | jq '.' > response.json
```

### Verbose output (debug)
```bash
curl -v -X GET "${BASE_URL}/api/companies" ...
```
