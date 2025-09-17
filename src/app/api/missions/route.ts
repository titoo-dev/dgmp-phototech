import { NextRequest, NextResponse } from 'next/server';
import { getMissionsAction } from '@/actions/mission/get-missions-action';
import { auth } from '@/lib/auth';
import { AuthUser, getUserRole } from '@/lib/auth-utils';
import { CreateMissionSchema, type CreateMission } from '@/models/mission-schema';
import prisma from '@/lib/prisma';
import { MissionStatus } from '@/lib/generated/prisma';

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
 *       - u2 users: All missions in the system
 *       - u3 users: Only missions with COMPLETED status
 *       - u4 users: All missions in the system
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
 *     description: |
 *       Create a new mission with team members, projects, and optional image references. 
 *       Supports both JSON (API clients) and FormData (web forms) payloads.
 *       For JSON payloads, images should be uploaded separately via /api/image endpoint and referenced by URL.
 *       Requires u1 role authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMissionRequest'
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - teamLeaderId
 *               - startDate
 *               - endDate
 *               - location
 *             properties:
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
 *               memberIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of team member IDs
 *                 example: ["contact-1", "contact-2"]
 *               projectsData:
 *                 type: string
 *                 description: JSON string containing project data
 *                 example: '[{"projectId":"proj-1","notes":"Project notes","marketName":"Market A"}]'
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
 *               $ref: '#/components/schemas/CreateMissionResponse'
 *       400:
 *         description: Bad request - validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized - no valid session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Helper function to generate mission number
function generateMissionNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const stamp = now.getTime().toString().slice(-6);
  return `MIS-${year}-${stamp}`;
}

// New API payload type for missions with external image URLs
export type CreateMissionApiPayload = {
  startDate: string;
  endDate: string;
  location: string;
  memberIds: string[];
  projectsData: Array<{ 
    projectId: string; 
    notes: string; 
    marketName: string;
  }>;
  imageFiles?: { [marketName: string]: string[] };
};

// Handle JSON-based mission creation (API/mobile clients)
async function handleJsonMissionCreation(request: NextRequest, session: any) {
  // Parse JSON payload
  let payload: CreateMissionApiPayload;

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 }
    );
  }

  // Validate required fields
  if (!payload.startDate || !payload.endDate || !payload.location) {
    return NextResponse.json(
      { error: 'Missing required fields: startDate, endDate, location' },
      { status: 400 }
    );
  }

  // Generate mission number
  const missionNumber = generateMissionNumber();

  // Remove duplicates from memberIds
  const uniqueMemberIds = [...new Set(payload.memberIds.map(id => String(id)))];

  // Auto-calculate agentCount (members + 1 team leader)
  const agentCount = uniqueMemberIds.length + 1;

  // Auto-calculate marketCount from projectsData length
  const marketCount = payload.projectsData.length;

  const parsed = {
    startDate: new Date(payload.startDate),
    endDate: new Date(payload.endDate),
    location: payload.location,
    agentCount: agentCount,
    marketCount: marketCount,
    members: uniqueMemberIds,
  };

  console.log('Parsed API data:', parsed);

  const validation = CreateMissionSchema.safeParse(parsed);

  if (!validation.success) {
    console.log('Validation errors:', validation.error.flatten().fieldErrors);
    return NextResponse.json(
      { 
        error: 'Validation failed',
        details: validation.error.flatten().fieldErrors 
      },
      { status: 400 }
    );
  }

  const data = validation.data as CreateMission;

  try {
    // Create mission
    const mission = await prisma.mission.create({
      data: {
        missionNumber: missionNumber as string,
        teamLeader: { connect: { id: session?.user?.id as string } },
        members: data.members && data.members.length > 0 ? {
          connect: data.members.map(memberId => ({ id: memberId }))
        } : undefined,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        status: 'DRAFT' as MissionStatus,
        agentCount: data.agentCount,
        marketCount: data.marketCount,
      },
      include: {
        teamLeader: true,
        members: true,
      },
    });

    // Create MissionProject entries and link images
    if (payload.projectsData.length > 0) {
      const missionProjects = await Promise.all(
        payload.projectsData.map(projectData =>
          prisma.missionProject.create({
            data: {
              missionId: mission.id,
              projectId: projectData.projectId,
              notes: projectData.notes,
            },
          })
        )
      );

      // Link existing image URLs to mission projects
      if (payload.imageFiles) {
        for (const projectData of payload.projectsData) {
          const missionProject = missionProjects.find(mp => mp.projectId === projectData.projectId);
          if (!missionProject) continue;

          const marketImages = payload.imageFiles[projectData.marketName] || [];
          
          for (const imageUrl of marketImages) {
            try {
              await prisma.missionFile.create({
                data: {
                  fileUrl: imageUrl,
                  metadata: JSON.stringify({
                    success: true,
                    source: 'api',
                    marketName: projectData.marketName,
                    uploadedAt: new Date().toISOString(),
                  }),
                  missionProjectId: missionProject.id,
                },
              });
            } catch (error) {
              console.error('Failed to link image:', error);
              // Continue with other images even if one fails
            }
          }
        }
      }
    }

    return NextResponse.json(mission, { status: 201 });
  } catch (error) {
    console.error('Error creating mission via API:', error);
    return NextResponse.json(
      { error: 'Failed to create mission' },
      { status: 500 }
    );
  }
}


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
    // Authenticate user
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check user role
    const userRole = getUserRole(session.user as AuthUser);
    if (userRole !== 'u1') {
      return NextResponse.json(
        { error: 'Forbidden - Only u1 users can create missions' },
        { status: 403 }
      );
    }
    
    return await handleJsonMissionCreation(request, session);

  } catch (error) {
    console.error('Error creating mission:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('payload too large')) {
        return NextResponse.json(
          { error: 'Request payload too large' },
          { status: 413 }
        );
      }
      
      if (error.message.includes('Only image files are allowed')) {
        return NextResponse.json(
          { error: 'Only image files are allowed' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to create mission' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};