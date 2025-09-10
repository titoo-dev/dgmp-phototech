import { NextRequest, NextResponse } from 'next/server';
import { getMissionsAction } from '@/actions/mission/get-missions-action';
import { createMissionAction } from '@/actions/mission/create-mission-action';
import { auth } from '@/lib/auth';
import { AuthUser, getUserRole } from '@/lib/auth-utils';

/**
 * @swagger
 * components:
 *   schemas:
 *     TeamLeader:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Team leader unique identifier
 *         name:
 *           type: string
 *           description: Team leader full name
 *         email:
 *           type: string
 *           format: email
 *           description: Team leader email address
 *         emailVerified:
 *           type: boolean
 *           description: Whether email is verified
 *         image:
 *           type: string
 *           nullable: true
 *           description: Profile image URL
 *         role:
 *           type: string
 *           nullable: true
 *           description: User role
 *     Member:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Member unique identifier
 *         firstName:
 *           type: string
 *           description: Member first name
 *         lastName:
 *           type: string
 *           description: Member last name
 *         email:
 *           type: string
 *           format: email
 *           description: Member email address
 *     Company:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Company unique identifier
 *         name:
 *           type: string
 *           description: Company name
 *         email:
 *           type: string
 *           format: email
 *           description: Company email
 *         phoneNumber:
 *           type: string
 *           description: Company phone number
 *         nif:
 *           type: string
 *           description: Company NIF number
 *         employeeCount:
 *           type: integer
 *           description: Number of employees
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Project unique identifier
 *         title:
 *           type: string
 *           description: Project title
 *         description:
 *           type: string
 *           description: Project description
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Project start date
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Project end date
 *         status:
 *           type: string
 *           enum: [UNCONTROLLED, CONTROLLED_IN_PROGRESS, CONTROLLED_DELIVERED, CONTROLLED_OTHER, DISPUTED]
 *           description: Project status
 *         nature:
 *           type: string
 *           enum: [SUPPLY, SERVICES, INTELLECTUAL, PROGRAM, MIXED, CONTROLLED_EXPENSES]
 *           description: Project nature
 *         company:
 *           $ref: '#/components/schemas/Company'
 *     MissionProject:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Mission project unique identifier
 *         projectId:
 *           type: string
 *           description: Related project ID
 *         notes:
 *           type: string
 *           description: Mission project notes
 *         missionId:
 *           type: string
 *           description: Related mission ID
 *         project:
 *           $ref: '#/components/schemas/Project'
 *     Mission:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Mission unique identifier
 *         missionNumber:
 *           type: string
 *           description: Mission number
 *           example: "MIS-2024-001"
 *         teamLeaderId:
 *           type: string
 *           description: ID of the team leader
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Mission start date
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Mission end date
 *         location:
 *           type: string
 *           description: Mission location
 *         agentCount:
 *           type: integer
 *           description: Number of agents in mission
 *         marketCount:
 *           type: integer
 *           description: Number of markets in mission
 *         status:
 *           type: string
 *           enum: [DRAFT, PENDING, COMPLETED, REJECTED]
 *           description: Mission status
 *         teamLeader:
 *           $ref: '#/components/schemas/TeamLeader'
 *         members:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Member'
 *           description: Mission team members
 *         missionProjects:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MissionProject'
 *           description: Projects associated with mission
 * /api/missions:
 *   get:
 *     tags:
 *       - Missions
 *     summary: Get missions based on user role
 *     description: |
 *       Retrieve missions based on user role:
 *       - u1 users: Only missions where they are the team leader
 *       - u2, u3, u4 users: All missions in the system
 *       Returns missions with their associated team leader, members, and project information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token with user role (u1, u2, u3, or u4)
 *         schema:
 *           type: string
 *           example: "Bearer your-jwt-token"
 *     responses:
 *       200:
 *         description: List of missions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 missions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Mission'
 *       401:
 *         description: Unauthorized - user not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not authenticated"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch missions"
 *   post:
 *     tags:
 *       - Missions
 *     summary: Create a new mission
 *     description: Create a new mission with team members, projects, and optional file uploads. Requires u1 role authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - teamLeaderId
 *               - startDate
 *               - endDate
 *               - location
 *             properties:
 *               missionNumber:
 *                 type: string
 *                 description: Mission number (auto-generated if not provided)
 *                 example: "MIS-2024-001"
 *               teamLeaderId:
 *                 type: string
 *                 description: ID of the team leader responsible for this mission
 *                 example: "user-123"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Mission start date
 *                 example: "2024-01-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Mission end date
 *                 example: "2024-01-15"
 *               location:
 *                 type: string
 *                 description: Mission location
 *                 example: "Paris, France"
 *               status:
 *                 type: string
 *                 description: Mission status (defaults to DRAFT)
 *                 enum: [DRAFT, PENDING, COMPLETED, REJECTED]
 *                 example: "DRAFT"
 *               agentCount:
 *                 type: integer
 *                 description: Number of agents participating
 *                 example: 5
 *               marketCount:
 *                 type: integer
 *                 description: Number of markets to visit
 *                 example: 3
 *               memberIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of team member IDs
 *                 example: ["member-1", "member-2"]
 *               projectsData:
 *                 type: string
 *                 description: JSON string containing project data
 *                 example: '[{"projectId":"proj-1","notes":"Project notes","marketName":"Market A"}]'
 *               marketData:
 *                 type: string
 *                 description: JSON string containing market data
 *                 example: '[{"name":"Market A","remarks":"Market remarks","photoCount":2,"projectId":"proj-1"}]'
 *               photos_marketName:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Photo files for specific market (replace marketName with actual market name)
 *     responses:
 *       201:
 *         description: Mission created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mission'
 *       400:
 *         description: Bad request - validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to create mission"
 *       401:
 *         description: Unauthorized - no valid session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden - Only u1 users can create missions"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to create mission"
 */
export async function GET() {
  try {
    const result = await getMissionsAction();
    
    if (!result.success) {
      // Check if it's an authentication error
      if (result.error === 'User not authenticated') {
        return NextResponse.json(
          { error: result.error },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: result.error || 'Failed to fetch missions' },
        { status: 500 }
      );
    }

    return NextResponse.json({ missions: result.data });
  } catch (error) {
    console.error('API Error fetching missions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userRole = getUserRole(session.user as AuthUser);
    if (userRole !== 'u1') {
      return NextResponse.json(
        { error: 'Forbidden - Only u1 users can create missions' },
        { status: 403 }
      );
    }

    const formData = await request.formData();

    const result = await createMissionAction({}, formData);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.errors?._form?.[0] || 'Failed to create mission' },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data, { status: 201 }); 
  } catch (error) {
    console.error('Error creating mission:', error);
    return NextResponse.json(
      { error: 'Failed to create mission' },
      { status: 500 }
    );
  }
}
