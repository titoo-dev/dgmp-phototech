import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserRole, type AuthUser } from '@/lib/auth-utils';
import { sendMissionReportAction } from '@/actions/mission/send-mission-report-action';

/**
 * @swagger
 * /api/missions/send:
 *   post:
 *     tags:
 *       - Missions
 *     summary: Send mission report for validation
 *     description: Send a mission report from DRAFT status to PENDING status for validation by u2 users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - missionId
 *             properties:
 *               missionId:
 *                 type: string
 *                 description: The ID of the mission to send
 *                 example: "clx1234567890abcdef"
 *     responses:
 *       200:
 *         description: Mission sent successfully for validation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Mission #M2024-001 envoyée avec succès pour validation"
 *       400:
 *         description: Bad request - validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to send mission"
 *                 errors:
 *                   type: object
 *                   properties:
 *                     _form:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Seules les missions en brouillon peuvent être envoyées"]
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
 *                   example: "Forbidden - Only u1 users can send missions"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has appropriate role (u1 or u3 can send missions)
    const user = session.user as AuthUser;
    const userRole = getUserRole(user);
    
    if (!['u1'].includes(userRole)) {
      return NextResponse.json(
        { error: 'Forbidden - Only u1 users can send missions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { missionId } = body;

    if (!missionId) {
      return NextResponse.json(
        { 
          error: 'Failed to send mission',
          errors: { _form: ['Mission ID is required'] }
        },
        { status: 400 }
      );
    }

    // Use the existing server action
    const result = await sendMissionReportAction(missionId);

    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'Failed to send mission',
          errors: result.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    console.error('API Error sending mission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
