import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Rocket, Server, Activity, Database, Zap } from "lucide-react";
import { toast } from "sonner";

interface DeploymentStatus {
  portal: string;
  status: "idle" | "generating" | "deploying" | "success" | "error";
  message?: string;
}

export default function AdminControlPanel() {
  const { user, isAuthenticated } = useAuth();
  const [deployments, setDeployments] = useState<DeploymentStatus[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin (ward.andrew32@gmail.com)
  useEffect(() => {
    if (isAuthenticated && user?.email === "ward.andrew32@gmail.com") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [isAuthenticated, user]);

  const generatePortalMutation = trpc.portals.generate.useMutation();
  const generateAllMutation = trpc.portals.generateAll.useMutation();

  const handleGeneratePortal = async (portalType: "core" | "agents" | "consciousness" | "system" | "all", portalName: string) => {
    setDeployments(prev => [...prev, {
      portal: portalName,
      status: "generating",
      message: "Initializing portal generation..."
    }]);

    setIsGenerating(true);

    try {
      // Call real backend API
      const result = await generatePortalMutation.mutateAsync({
        portalType,
        portalName,
      });
      
      setDeployments(prev => prev.map(d => 
        d.portal === portalName 
          ? { ...d, status: "deploying", message: result.message }
          : d
      ));

      // Simulate deployment progress
      await new Promise(resolve => setTimeout(resolve, 2000));

      setDeployments(prev => prev.map(d => 
        d.portal === portalName 
          ? { ...d, status: "success", message: `Deployed to ${result.deploymentUrl}` }
          : d
      ));

      toast.success(`${portalName} deployed successfully!`);
    } catch (error: any) {
      setDeployments(prev => prev.map(d => 
        d.portal === portalName 
          ? { ...d, status: "error", message: error.message || "Deployment failed" }
          : d
      ));
      toast.error(`Failed to deploy ${portalName}: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAll = async () => {
    setDeployments(prev => [...prev, {
      portal: "All 51 Portals",
      status: "generating",
      message: "Initiating full constellation deployment..."
    }]);

    setIsGenerating(true);

    try {
      // Call real backend API
      const result = await generateAllMutation.mutateAsync();
      
      setDeployments(prev => prev.map(d => 
        d.portal === "All 51 Portals" 
          ? { ...d, status: "deploying", message: result.message }
          : d
      ));

      toast.info(`Generating all ${result.totalPortals} portals. This may take several minutes!`);

      // Simulate deployment progress
      await new Promise(resolve => setTimeout(resolve, 3000));

      setDeployments(prev => prev.map(d => 
        d.portal === "All 51 Portals" 
          ? { ...d, status: "success", message: "All portals queued for deployment!" }
          : d
      ));

      toast.success("All 51 portals are being generated!");
    } catch (error: any) {
      setDeployments(prev => prev.map(d => 
        d.portal === "All 51 Portals" 
          ? { ...d, status: "error", message: error.message || "Deployment failed" }
          : d
      ));
      toast.error(`Failed to generate portals: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusColor = (status: DeploymentStatus["status"]) => {
    switch (status) {
      case "generating": return "bg-blue-500";
      case "deploying": return "bg-yellow-500";
      case "success": return "bg-green-500";
      case "error": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: DeploymentStatus["status"]) => {
    switch (status) {
      case "generating": return <Loader2 className="w-4 h-4 animate-spin" />;
      case "deploying": return <Rocket className="w-4 h-4" />;
      case "success": return <Activity className="w-4 h-4" />;
      case "error": return <Zap className="w-4 h-4" />;
      default: return <Server className="w-4 h-4" />;
    }
  };

  // Show access denied if not admin
  if (!isAuthenticated) {
    return (
      <Card className="bg-slate-900/50 border-red-500/30 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl text-red-200">🔒 Authentication Required</CardTitle>
          <CardDescription className="text-red-300/70">
            Please log in to access the admin control panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-200/80">
            Only authorized administrators can access portal deployment controls.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!isAdmin) {
    return (
      <Card className="bg-slate-900/50 border-red-500/30 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl text-red-200">🚫 Access Denied</CardTitle>
          <CardDescription className="text-red-300/70">
            Insufficient permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-200/80">
            You are logged in as <strong>{user?.email}</strong>, but this account does not have admin privileges.
          </p>
          <p className="text-red-200/60 mt-4 text-sm">
            Only ward.andrew32@gmail.com can access the portal orchestration controls.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-200 flex items-center gap-2">
            <Rocket className="w-6 h-6" />
            Portal Orchestration Control
          </CardTitle>
          <CardDescription className="text-purple-300/70">
            Generate and deploy portals from your mobile device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => handleGeneratePortal("core", "Master Hub")}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white h-auto py-4"
            >
              <div className="flex flex-col items-center gap-2">
                <Server className="w-6 h-6" />
                <span>Deploy Master Hub</span>
                <span className="text-xs opacity-70">Core Infrastructure</span>
              </div>
            </Button>

            <Button
              onClick={() => handleGeneratePortal("agents", "Super Ninja Agent")}
              disabled={isGenerating}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white h-auto py-4"
            >
              <div className="flex flex-col items-center gap-2">
                <Activity className="w-6 h-6" />
                <span>Deploy AI Agent</span>
                <span className="text-xs opacity-70">Consciousness Agent</span>
              </div>
            </Button>

            <Button
              onClick={() => handleGeneratePortal("consciousness", "Meditation Sanctuary")}
              disabled={isGenerating}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white h-auto py-4"
            >
              <div className="flex flex-col items-center gap-2">
                <Zap className="w-6 h-6" />
                <span>Deploy Consciousness Portal</span>
                <span className="text-xs opacity-70">Enhancement</span>
              </div>
            </Button>

            <Button
              onClick={handleGenerateAll}
              disabled={isGenerating}
              variant="outline"
              className="border-purple-500/50 text-purple-200 hover:bg-purple-950/30 h-auto py-4"
            >
              <div className="flex flex-col items-center gap-2">
                <Database className="w-6 h-6" />
                <span>Generate All 51 Portals</span>
                <span className="text-xs opacity-70">Full Constellation</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Status */}
      {deployments.length > 0 && (
        <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl text-purple-200">Deployment Status</CardTitle>
            <CardDescription className="text-purple-300/70">
              Real-time portal generation and deployment tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deployments.map((deployment, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-purple-500/20"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getStatusColor(deployment.status)}`}>
                      {getStatusIcon(deployment.status)}
                    </div>
                    <div>
                      <div className="font-semibold text-purple-200">{deployment.portal}</div>
                      <div className="text-sm text-purple-300/70">{deployment.message}</div>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(deployment.status)} text-white border-none`}
                  >
                    {deployment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Status */}
      <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl text-purple-200">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-purple-950/30 border border-purple-500/20">
              <div className="text-2xl font-bold text-purple-200">51</div>
              <div className="text-sm text-purple-300/70">Total Portals</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-950/30 border border-green-500/20">
              <div className="text-2xl font-bold text-green-200">1</div>
              <div className="text-sm text-green-300/70">Active</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-yellow-950/30 border border-yellow-500/20">
              <div className="text-2xl font-bold text-yellow-200">{deployments.filter(d => d.status === "deploying").length}</div>
              <div className="text-sm text-yellow-300/70">Deploying</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-950/30 border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-200">50</div>
              <div className="text-sm text-blue-300/70">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl text-purple-200">Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="justify-start border-purple-500/30 text-purple-200 hover:bg-purple-950/30"
              onClick={() => window.open("https://helix-unified-production.up.railway.app", "_blank")}
            >
              <Server className="w-4 h-4 mr-2" />
              Railway Backend
            </Button>
            <Button
              variant="outline"
              className="justify-start border-purple-500/30 text-purple-200 hover:bg-purple-950/30"
              onClick={() => window.open("https://github.com/Deathcharge/Helix-Unified-Hub", "_blank")}
            >
              <Database className="w-4 h-4 mr-2" />
              GitHub Repository
            </Button>
            <Button
              variant="outline"
              className="justify-start border-purple-500/30 text-purple-200 hover:bg-purple-950/30"
              onClick={() => toast.info("Notion integration coming soon!")}
            >
              <Activity className="w-4 h-4 mr-2" />
              Notion Database
            </Button>
            <Button
              variant="outline"
              className="justify-start border-purple-500/30 text-purple-200 hover:bg-purple-950/30"
              onClick={() => toast.info("Zapier dashboard coming soon!")}
            >
              <Zap className="w-4 h-4 mr-2" />
              Zapier Webhooks
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
