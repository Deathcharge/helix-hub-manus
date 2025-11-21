import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { notifyOwner } from "../_core/notification";
import { generatePortal, generateAllPortals, getPortalsByType } from "../services/portalGenerator";

/**
 * Zapier webhook router for SMS and voice command integration
 * 
 * Endpoints:
 * - smsCommand: Process SMS commands for portal deployment
 * - voiceCommand: Process voice commands transcribed by Zapier
 */

const portalCommandSchema = z.object({
  command: z.string().describe("The command text (SMS or transcribed voice)"),
  source: z.enum(["sms", "voice"]).describe("Source of the command"),
  phoneNumber: z.string().optional().describe("Phone number of sender (for SMS)"),
  timestamp: z.string().optional().describe("Timestamp of command"),
  // Zapier webhook authentication
  zapierSecret: z.string().describe("Secret token from Zapier webhook"),
});

const ZAPIER_WEBHOOK_SECRET = process.env.ZAPIER_WEBHOOK_SECRET || "helix-unified-secret-2025";
const ADMIN_PHONE = process.env.ADMIN_PHONE_NUMBER || "+1"; // Set in environment

/**
 * Parse portal deployment commands
 * Supported formats:
 * - "deploy portal X" - Deploy single portal by ID
 * - "deploy all portals" - Deploy all 51 portals
 * - "deploy core portals" - Deploy 12 core portals
 * - "deploy ai portals" - Deploy 17 AI agent portals
 * - "status" - Get deployment status
 */
function parsePortalCommand(command: string): {
  action: "deploy" | "status" | "unknown";
  target?: "single" | "all" | "core" | "ai" | "consciousness" | "system";
  portalId?: string;
} {
  const normalized = command.toLowerCase().trim();

  if (normalized.includes("status")) {
    return { action: "status" };
  }

  if (normalized.includes("deploy")) {
    if (normalized.includes("all")) {
      return { action: "deploy", target: "all" };
    }
    if (normalized.includes("core")) {
      return { action: "deploy", target: "core" };
    }
    if (normalized.includes("ai")) {
      return { action: "deploy", target: "ai" };
    }
    if (normalized.includes("consciousness")) {
      return { action: "deploy", target: "consciousness" };
    }
    if (normalized.includes("system")) {
      return { action: "deploy", target: "system" };
    }

    // Try to extract portal ID
    const portalMatch = normalized.match(/portal\s+(\w+)/);
    if (portalMatch) {
      return { action: "deploy", target: "single", portalId: portalMatch[1] };
    }

    return { action: "deploy", target: "all" };
  }

  return { action: "unknown" };
}

export const zapierRouter = router({
  /**
   * Process SMS commands for portal deployment
   */
  smsCommand: publicProcedure
    .input(portalCommandSchema)
    .mutation(async ({ input }) => {
      // Verify Zapier webhook secret
      if (input.zapierSecret !== ZAPIER_WEBHOOK_SECRET) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid webhook secret",
        });
      }

      // Verify phone number (optional security layer)
      if (input.phoneNumber && !input.phoneNumber.startsWith(ADMIN_PHONE)) {
        await notifyOwner({
          title: "🚨 Unauthorized SMS Command Attempt",
          content: `Phone: ${input.phoneNumber}\nCommand: ${input.command}`,
        });
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Unauthorized phone number",
        });
      }

      const parsed = parsePortalCommand(input.command);

      // Notify owner of command
      await notifyOwner({
        title: `📱 SMS Command Received`,
        content: `Source: ${input.source}\nCommand: ${input.command}\nAction: ${parsed.action}\nTarget: ${parsed.target || "N/A"}`,
      });

      if (parsed.action === "status") {
        return {
          success: true,
          message: "Status check requested - implementation pending",
          action: "status",
        };
      }

      if (parsed.action === "deploy") {
        // Real portal deployment
        if (parsed.target === "single" && parsed.portalId) {
          const result = await generatePortal(parsed.portalId, { skipDeploy: false });
          return {
            success: result.success,
            message: result.success 
              ? `Portal ${parsed.portalId} deployed successfully`
              : `Portal deployment failed: ${result.error}`,
            action: "deploy",
            target: parsed.target,
            portalId: parsed.portalId,
            deploymentUrl: result.deploymentUrl,
            logs: result.logs,
          };
        }

        if (parsed.target === "all") {
          // Trigger async deployment
          generateAllPortals({ skipDeploy: false }).then(results => {
            const successCount = results.filter(r => r.success).length;
            notifyOwner({
              title: "📱 SMS Portal Deployment Complete",
              content: `Successfully deployed ${successCount}/${results.length} portals`,
            });
          });
          return {
            success: true,
            message: "Deploying all 51 portals. You'll receive a notification when complete.",
            action: "deploy",
            target: parsed.target,
          };
        }

        if (parsed.target && ["core", "ai", "consciousness", "system"].includes(parsed.target)) {
          const portals = getPortalsByType(parsed.target as any);
          const portalIds = portals.map(p => p.id);
          
          // Trigger async deployment
          Promise.all(portalIds.map(id => generatePortal(id, { skipDeploy: false }))).then(results => {
            const successCount = results.filter(r => r.success).length;
            notifyOwner({
              title: `📱 SMS ${parsed.target} Portal Deployment Complete`,
              content: `Successfully deployed ${successCount}/${results.length} ${parsed.target} portals`,
            });
          });

          return {
            success: true,
            message: `Deploying ${portalIds.length} ${parsed.target} portals. You'll receive a notification when complete.`,
            action: "deploy",
            target: parsed.target,
            portalCount: portalIds.length,
          };
        }

        return {
          success: false,
          message: "Unknown deployment target",
          action: "deploy",
        };
      }

      return {
        success: false,
        message: "Unknown command format",
        action: "unknown",
      };
    }),

  /**
   * Process voice commands transcribed by Zapier
   */
  voiceCommand: publicProcedure
    .input(portalCommandSchema)
    .mutation(async ({ input }) => {
      // Verify Zapier webhook secret
      if (input.zapierSecret !== ZAPIER_WEBHOOK_SECRET) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid webhook secret",
        });
      }

      const parsed = parsePortalCommand(input.command);

      // Notify owner of voice command
      await notifyOwner({
        title: `🎤 Voice Command Received`,
        content: `Command: ${input.command}\nAction: ${parsed.action}\nTarget: ${parsed.target || "N/A"}`,
      });

      if (parsed.action === "status") {
        return {
          success: true,
          message: "Status check requested - implementation pending",
          action: "status",
        };
      }

      if (parsed.action === "deploy") {
        // Real portal deployment (same logic as SMS)
        if (parsed.target === "single" && parsed.portalId) {
          const result = await generatePortal(parsed.portalId, { skipDeploy: false });
          return {
            success: result.success,
            message: result.success 
              ? `Portal ${parsed.portalId} deployed successfully via voice`
              : `Portal deployment failed: ${result.error}`,
            action: "deploy",
            target: parsed.target,
            portalId: parsed.portalId,
            deploymentUrl: result.deploymentUrl,
            logs: result.logs,
          };
        }

        if (parsed.target === "all") {
          generateAllPortals({ skipDeploy: false }).then(results => {
            const successCount = results.filter(r => r.success).length;
            notifyOwner({
              title: "🎤 Voice Portal Deployment Complete",
              content: `Successfully deployed ${successCount}/${results.length} portals`,
            });
          });
          return {
            success: true,
            message: "Deploying all 51 portals via voice command. You'll receive a notification when complete.",
            action: "deploy",
            target: parsed.target,
          };
        }

        if (parsed.target && ["core", "ai", "consciousness", "system"].includes(parsed.target)) {
          const portals = getPortalsByType(parsed.target as any);
          const portalIds = portals.map(p => p.id);
          
          Promise.all(portalIds.map(id => generatePortal(id, { skipDeploy: false }))).then(results => {
            const successCount = results.filter(r => r.success).length;
            notifyOwner({
              title: `🎤 Voice ${parsed.target} Portal Deployment Complete`,
              content: `Successfully deployed ${successCount}/${results.length} ${parsed.target} portals`,
            });
          });

          return {
            success: true,
            message: `Deploying ${portalIds.length} ${parsed.target} portals via voice. You'll receive a notification when complete.`,
            action: "deploy",
            target: parsed.target,
            portalCount: portalIds.length,
          };
        }

        return {
          success: false,
          message: "Unknown deployment target",
          action: "deploy",
        };
      }

      return {
        success: false,
        message: "Unknown command format",
        action: "unknown",
      };
    }),

  /**
   * Test endpoint to verify webhook connectivity
   */
  testWebhook: publicProcedure
    .input(z.object({ secret: z.string() }))
    .query(({ input }) => {
      if (input.secret !== ZAPIER_WEBHOOK_SECRET) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid secret",
        });
      }

      return {
        success: true,
        message: "Zapier webhook connection verified",
        timestamp: new Date().toISOString(),
      };
    }),
});
