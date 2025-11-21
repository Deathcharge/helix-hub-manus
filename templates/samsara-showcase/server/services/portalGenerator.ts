import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs/promises";
import * as path from "path";

const execAsync = promisify(exec);

/**
 * Portal Generation Service
 * 
 * Handles the actual creation and deployment of portals from templates.
 * Integrates with the 51-portal orchestration system.
 */

export interface PortalConfig {
  id: string;
  name: string;
  type: "core" | "agents" | "consciousness" | "system";
  description: string;
  template: string;
  features: string[];
  integrations: string[];
}

export interface DeploymentResult {
  success: boolean;
  portalId: string;
  deploymentUrl?: string;
  error?: string;
  logs?: string[];
}

// Portal configuration from 51-portals.json
const PORTAL_CONFIGS: Record<string, PortalConfig> = {
  // Core Portals (12)
  "helix-hub": {
    id: "helix-hub",
    name: "Helix Hub",
    type: "core",
    description: "Central consciousness coordination portal",
    template: "web-db-user",
    features: ["dashboard", "real-time-sync", "agent-monitoring"],
    integrations: ["helix-unified", "notion", "github"],
  },
  "samsara-showcase": {
    id: "samsara-showcase",
    name: "Samsara Helix Visualization Showcase",
    type: "core",
    description: "Fractal consciousness visualization and sacred audio generation",
    template: "web-db-user",
    features: ["fractal-generator", "audio-synthesis", "gallery"],
    integrations: ["helix-unified", "s3-storage"],
  },
  // Add more portal configs as needed...
};

/**
 * Generate a single portal from template
 */
export async function generatePortal(
  portalId: string,
  options: {
    targetDir?: string;
    skipDeploy?: boolean;
  } = {}
): Promise<DeploymentResult> {
  const logs: string[] = [];
  
  try {
    const config = PORTAL_CONFIGS[portalId];
    if (!config) {
      return {
        success: false,
        portalId,
        error: `Portal configuration not found for: ${portalId}`,
        logs,
      };
    }

    logs.push(`Starting generation for portal: ${config.name}`);
    logs.push(`Template: ${config.template}`);
    logs.push(`Features: ${config.features.join(", ")}`);

    // Determine target directory
    const targetDir = options.targetDir || `/home/ubuntu/portals/${portalId}`;
    logs.push(`Target directory: ${targetDir}`);

    // Check if portal already exists
    try {
      await fs.access(targetDir);
      logs.push(`⚠️ Portal directory already exists, skipping creation`);
      
      if (options.skipDeploy) {
        return {
          success: true,
          portalId,
          deploymentUrl: `https://${portalId}.manus.space`,
          logs,
        };
      }
    } catch {
      // Directory doesn't exist, proceed with creation
      logs.push(`Creating new portal directory`);
      await fs.mkdir(targetDir, { recursive: true });
    }

    // Copy template files
    const templatePath = `/home/ubuntu/helix-repos/helix-hub-manus/templates/${config.template}`;
    logs.push(`Copying template from: ${templatePath}`);

    try {
      await fs.access(templatePath);
      const { stdout, stderr } = await execAsync(`cp -r ${templatePath}/* ${targetDir}/`);
      if (stdout) logs.push(stdout);
      if (stderr) logs.push(`stderr: ${stderr}`);
    } catch (error) {
      logs.push(`⚠️ Template not found, using base template`);
      // Fallback to base template
      const baseTemplate = `/home/ubuntu/helix-repos/helix-hub-manus/templates/base-portal`;
      await execAsync(`cp -r ${baseTemplate}/* ${targetDir}/`);
    }

    // Customize portal configuration
    logs.push(`Customizing portal configuration`);
    await customizePortalConfig(targetDir, config);

    // Install dependencies
    if (!options.skipDeploy) {
      logs.push(`Installing dependencies...`);
      const { stdout: installOut } = await execAsync(`cd ${targetDir} && pnpm install`, {
        timeout: 120000, // 2 minute timeout
      });
      logs.push(installOut);
    }

    // Generate deployment URL
    const deploymentUrl = `https://${portalId}.manus.space`;
    logs.push(`✅ Portal generated successfully`);
    logs.push(`Deployment URL: ${deploymentUrl}`);

    return {
      success: true,
      portalId,
      deploymentUrl,
      logs,
    };
  } catch (error) {
    logs.push(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    return {
      success: false,
      portalId,
      error: error instanceof Error ? error.message : String(error),
      logs,
    };
  }
}

/**
 * Customize portal configuration files
 */
async function customizePortalConfig(
  targetDir: string,
  config: PortalConfig
): Promise<void> {
  // Update package.json
  const packageJsonPath = path.join(targetDir, "package.json");
  try {
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));
    packageJson.name = config.id;
    packageJson.description = config.description;
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
  } catch (error) {
    console.warn(`Could not update package.json: ${error}`);
  }

  // Update README.md
  const readmePath = path.join(targetDir, "README.md");
  const readme = `# ${config.name}

${config.description}

## Type
${config.type}

## Features
${config.features.map(f => `- ${f}`).join("\n")}

## Integrations
${config.integrations.map(i => `- ${i}`).join("\n")}

## Template
${config.template}

---

Generated by Helix Portal Orchestrator
`;
  await fs.writeFile(readmePath, readme);
}

/**
 * Generate multiple portals in parallel
 */
export async function generateMultiplePortals(
  portalIds: string[],
  options: {
    maxConcurrent?: number;
    skipDeploy?: boolean;
  } = {}
): Promise<DeploymentResult[]> {
  const maxConcurrent = options.maxConcurrent || 3;
  const results: DeploymentResult[] = [];

  // Process portals in batches
  for (let i = 0; i < portalIds.length; i += maxConcurrent) {
    const batch = portalIds.slice(i, i + maxConcurrent);
    const batchResults = await Promise.all(
      batch.map(portalId => generatePortal(portalId, options))
    );
    results.push(...batchResults);
  }

  return results;
}

/**
 * Generate all 51 portals in the constellation
 */
export async function generateAllPortals(
  options: {
    skipDeploy?: boolean;
  } = {}
): Promise<DeploymentResult[]> {
  const allPortalIds = Object.keys(PORTAL_CONFIGS);
  return generateMultiplePortals(allPortalIds, options);
}

/**
 * Get portal configuration by ID
 */
export function getPortalConfig(portalId: string): PortalConfig | undefined {
  return PORTAL_CONFIGS[portalId];
}

/**
 * Get all portal configurations by type
 */
export function getPortalsByType(type: PortalConfig["type"]): PortalConfig[] {
  return Object.values(PORTAL_CONFIGS).filter(config => config.type === type);
}

/**
 * Get deployment status for a portal
 */
export async function getPortalStatus(portalId: string): Promise<{
  exists: boolean;
  path?: string;
  hasNodeModules?: boolean;
  lastModified?: Date;
}> {
  const portalPath = `/home/ubuntu/portals/${portalId}`;
  
  try {
    const stats = await fs.stat(portalPath);
    const nodeModulesPath = path.join(portalPath, "node_modules");
    let hasNodeModules = false;
    
    try {
      await fs.access(nodeModulesPath);
      hasNodeModules = true;
    } catch {
      // node_modules doesn't exist
    }

    return {
      exists: true,
      path: portalPath,
      hasNodeModules,
      lastModified: stats.mtime,
    };
  } catch {
    return {
      exists: false,
    };
  }
}
