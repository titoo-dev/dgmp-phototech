/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the company
 *           example: "clx123abc"
 *         name:
 *           type: string
 *           description: Company name
 *           example: "Tech Solutions Inc"
 *         email:
 *           type: string
 *           format: email
 *           description: Company email address
 *           example: "contact@techsolutions.com"
 *         phoneNumber:
 *           type: string
 *           description: Company phone number
 *           example: "+1234567890"
 *         nif:
 *           type: string
 *           description: Company NIF (tax number)
 *           example: "123456789"
 *         employeeCount:
 *           type: integer
 *           description: Number of employees
 *           example: 50
 *         projects:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Project'
 *           description: Associated projects
 *       required:
 *         - id
 *         - name
 *         - email
 *         - phoneNumber
 *         - nif
 *         - employeeCount
 *
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the project
 *           example: "clx123abc"
 *         title:
 *           type: string
 *           description: Project title
 *           example: "Website Redesign"
 *         description:
 *           type: string
 *           description: Project description
 *           example: "Complete redesign of company website"
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Project start date
 *           example: "2024-01-01T00:00:00Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Project end date
 *           example: "2024-06-30T00:00:00Z"
 *         status:
 *           type: string
 *           description: Project status
 *           enum: [UNCONTROLLED, CONTROLLED_IN_PROGRESS, CONTROLLED_DELIVERED, CONTROLLED_OTHER, DISPUTED]
 *           example: "CONTROLLED_IN_PROGRESS"
 *         companyId:
 *           type: string
 *           description: ID of the company this project belongs to
 *           example: "clx123abc"
 *         nature:
 *           type: string
 *           description: Nature of the project
 *           enum: [SUPPLY, SERVICES, INTELLECTUAL, PROGRAM, MIXED, CONTROLLED_EXPENSES]
 *           example: "SERVICES"
 *         company:
 *           $ref: '#/components/schemas/Company'
 *           description: Associated company
 *         missionProjects:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MissionProject'
 *           description: Associated mission projects
 *       required:
 *         - id
 *         - title
 *         - description
 *         - startDate
 *         - endDate
 *         - status
 *         - companyId
 *         - nature
 *
 *     Mission:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the mission
 *           example: "clx123abc"
 *         missionNumber:
 *           type: string
 *           description: Mission number
 *           example: "MIS-2024-001"
 *         teamLeaderId:
 *           type: string
 *           description: ID of the team leader (User) responsible for this mission
 *           example: "clx123abc"
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Mission start date
 *           example: "2024-01-01T00:00:00Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Mission end date
 *           example: "2024-01-15T00:00:00Z"
 *         location:
 *           type: string
 *           description: Mission location
 *           example: "Paris, France"
 *         agentCount:
 *           type: integer
 *           description: Number of agents in mission
 *           example: 5
 *         marketCount:
 *           type: integer
 *           description: Number of markets in mission
 *           example: 3
 *         status:
 *           type: string
 *           description: Mission status
 *           enum: [DRAFT, PENDING, COMPLETED, REJECTED]
 *           example: "PENDING"
 *         teamLeader:
 *           $ref: '#/components/schemas/User'
 *           description: Associated team leader (User)
 *         members:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Contact'
 *           description: Mission members
 *         missionProjects:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MissionProject'
 *           description: Associated mission projects
 *       required:
 *         - id
 *         - missionNumber
 *         - teamLeaderId
 *         - startDate
 *         - endDate
 *         - location
 *         - agentCount
 *         - marketCount
 *         - status
 *
 *     MissionProject:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the mission project
 *           example: "clx123abc"
 *         projectId:
 *           type: string
 *           description: ID of the associated project
 *           example: "clx123abc"
 *         missionId:
 *           type: string
 *           description: ID of the associated mission
 *           example: "clx123abc"
 *         notes:
 *           type: string
 *           description: Notes for this mission project
 *           example: "Special requirements for this project"
 *         project:
 *           $ref: '#/components/schemas/Project'
 *           description: Associated project
 *         mission:
 *           $ref: '#/components/schemas/Mission'
 *           description: Associated mission
 *         files:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MissionFile'
 *           description: Associated files
 *       required:
 *         - id
 *         - projectId
 *         - missionId
 *         - notes
 *
 *     MissionFile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the mission file
 *           example: "clx123abc"
 *         fileUrl:
 *           type: string
 *           description: URL of the uploaded file
 *           example: "https://example.com/files/document.pdf"
 *         metadata:
 *           type: string
 *           description: File metadata
 *           example: "{\"filename\": \"document.pdf\", \"size\": 1024}"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: File creation date
 *           example: "2024-01-01T00:00:00Z"
 *         missionProjectId:
 *           type: string
 *           description: ID of the associated mission project
 *           example: "clx123abc"
 *         missionProject:
 *           $ref: '#/components/schemas/MissionProject'
 *           description: Associated mission project
 *       required:
 *         - id
 *         - fileUrl
 *         - metadata
 *         - createdAt
 *         - missionProjectId
 *
 *     Contact:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the contact
 *           example: "clx123abc"
 *         firstName:
 *           type: string
 *           description: Contact's first name
 *           example: "John"
 *         lastName:
 *           type: string
 *           description: Contact's last name
 *           example: "Doe"
 *         email:
 *           type: string
 *           format: email
 *           description: Contact's email address
 *           example: "john.doe@company.com"
 *         missionsMember:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Mission'
 *           description: Missions where this contact is a member
 *       required:
 *         - id
 *         - firstName
 *         - lastName
 *         - email
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the user
 *           example: "clx123abc"
 *         name:
 *           type: string
 *           description: User's full name
 *           example: "Alice Johnson"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "alice.johnson@company.com"
 *         emailVerified:
 *           type: boolean
 *           description: Whether the user's email is verified
 *           example: true
 *         image:
 *           type: string
 *           nullable: true
 *           description: User's profile image URL
 *           example: "https://example.com/avatar.jpg"
 *         role:
 *           type: string
 *           nullable: true
 *           description: User's role in the system
 *           example: "admin"
 *         banned:
 *           type: boolean
 *           nullable: true
 *           description: Whether the user is banned
 *           example: false
 *         banReason:
 *           type: string
 *           nullable: true
 *           description: Reason for ban if applicable
 *           example: null
 *         banExpires:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Ban expiration date if applicable
 *           example: null
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: User creation date
 *           example: "2024-01-01T00:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: User last update date
 *           example: "2024-01-01T00:00:00Z"
 *         missionsTeamLeader:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Mission'
 *           description: Missions where this user is team leader
 *       required:
 *         - id
 *         - name
 *         - email
 *         - emailVerified
 *         - createdAt
 *         - updatedAt
 *
 *     FileUploadResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Upload success status
 *           example: true
 *         url:
 *           type: string
 *           description: URL of the uploaded file
 *           example: "https://blob.vercel-storage.com/report-abc123.jpg"
 *         filename:
 *           type: string
 *           description: Generated filename
 *           example: "report-abc123.jpg"
 *         size:
 *           type: integer
 *           description: File size in bytes
 *           example: 1024000
 *         type:
 *           type: string
 *           description: MIME type of the uploaded file
 *           example: "image/jpeg"
 *         pathname:
 *           type: string
 *           description: File pathname
 *           example: "report-abc123.jpg"
 *         contentType:
 *           type: string
 *           description: Content type of the file
 *           example: "image/jpeg"
 *         contentDisposition:
 *           type: string
 *           description: Content disposition header
 *           example: "attachment; filename=\"report-abc123.jpg\""
 *       required:
 *         - success
 *         - url
 *         - filename
 *         - size
 *         - type
 *
 *     ImageListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Request success status
 *           example: true
 *         blobs:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: URL of the blob
 *                 example: "https://blob.vercel-storage.com/image-abc123.jpg"
 *               pathname:
 *                 type: string
 *                 description: Pathname of the blob
 *                 example: "image-abc123.jpg"
 *               size:
 *                 type: integer
 *                 description: Size of the blob in bytes
 *                 example: 1024000
 *               uploadedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Upload timestamp
 *                 example: "2024-01-01T00:00:00Z"
 *           description: List of uploaded blobs
 *         hasMore:
 *           type: boolean
 *           description: Whether there are more results
 *           example: false
 *         cursor:
 *           type: string
 *           nullable: true
 *           description: Cursor for pagination
 *           example: null
 *       required:
 *         - success
 *         - blobs
 *         - hasMore
 *
 *     CreateMissionRequest:
 *       type: object
 *       properties:
 *         teamLeaderId:
 *           type: string
 *           description: ID of the team leader responsible for this mission
 *           example: "user-123"
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Mission start date
 *           example: "2024-01-01T00:00:00Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Mission end date
 *           example: "2024-01-15T00:00:00Z"
 *         location:
 *           type: string
 *           description: Mission location
 *           example: "Paris, France"
 *         status:
 *           type: string
 *           description: Mission status (defaults to DRAFT)
 *           enum: [DRAFT, PENDING, COMPLETED, REJECTED]
 *           example: "DRAFT"
 *         memberIds:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of team member (Contact) IDs
 *           example: ["contact-1", "contact-2"]
 *         projectsData:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MissionProjectData'
 *           description: Array of project data objects
 *         imageFiles:
 *           type: object
 *           additionalProperties:
 *             type: array
 *             items:
 *               type: string
 *               format: uri
 *           description: |
 *             Object mapping market names to arrays of image URLs.
 *             Images should be uploaded first via /api/image endpoint.
 *           example: 
 *             "Market A": ["https://blob.url/image1.jpg", "https://blob.url/image2.jpg"]
 *       required:
 *         - teamLeaderId
 *         - startDate
 *         - endDate
 *         - location
 *         - memberIds
 *         - projectsData
 *
 *     MissionProjectData:
 *       type: object
 *       properties:
 *         projectId:
 *           type: string
 *           description: ID of the project
 *           example: "proj-1"
 *         notes:
 *           type: string
 *           description: Project notes
 *           example: "Project specific notes"
 *         marketName:
 *           type: string
 *           description: Name of the market
 *           example: "Market A"
 *       required:
 *         - projectId
 *         - notes
 *         - marketName
 *
 *     CreateMissionResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the created mission
 *           example: "mission-123"
 *         missionNumber:
 *           type: string
 *           description: Auto-generated mission number
 *           example: "MIS-2024-123456"
 *         teamLeaderId:
 *           type: string
 *           description: ID of the team leader
 *           example: "user-123"
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Mission start date
 *           example: "2024-01-01T00:00:00.000Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Mission end date
 *           example: "2024-01-15T00:00:00.000Z"
 *         location:
 *           type: string
 *           description: Mission location
 *           example: "Paris, France"
 *         agentCount:
 *           type: integer
 *           description: Auto-calculated number of agents (members + 1 team leader)
 *           example: 3
 *         marketCount:
 *           type: integer
 *           description: Auto-calculated number of markets from projects
 *           example: 1
 *         status:
 *           type: string
 *           description: Mission status
 *           enum: [DRAFT, PENDING, COMPLETED, REJECTED]
 *           example: "DRAFT"
 *         teamLeader:
 *           $ref: '#/components/schemas/User'
 *           description: Team leader details
 *         members:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Contact'
 *           description: Mission members
 *       required:
 *         - id
 *         - missionNumber
 *         - teamLeaderId
 *         - startDate
 *         - endDate
 *         - location
 *         - agentCount
 *         - marketCount
 *         - status
 *
 *     ValidationError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: General error message
 *           example: "Validation failed"
 *         details:
 *           type: object
 *           additionalProperties:
 *             type: array
 *             items:
 *               type: string
 *           description: Field-specific validation errors
 *           example:
 *             startDate: ["Invalid date format"]
 *             location: ["Location is required"]
 *       required:
 *         - error
 *
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *           example: "Resource not found"
 *
 *     SuccessMessage:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *           example: "Resource deleted successfully"
 */
