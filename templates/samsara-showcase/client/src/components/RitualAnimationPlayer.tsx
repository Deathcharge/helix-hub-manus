import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw } from "lucide-react";

interface RitualFrame {
  step: number;
  mantra: string;
  harmony: number;
  energy: number;
}

export default function RitualAnimationPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const totalSteps = 108;
  const mantras = [
    "Tat Tvam Asi",
    "Aham Brahmasmi",
    "Neti Neti",
    "Om Mani Padme Hum",
    "So Hum"
  ];

  const currentFrame: RitualFrame = {
    step: currentStep,
    mantra: mantras[currentStep % mantras.length],
    harmony: 0.35 + (currentStep / totalSteps) * 0.25,
    energy: Math.sin((currentStep / totalSteps) * Math.PI * 2) * 0.5 + 0.5
  };

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 100 / playbackSpeed);
    } else {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isPlaying, playbackSpeed]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleStepChange = (value: number[]) => {
    setCurrentStep(value[0]);
    setIsPlaying(false);
  };

  // Generate visualization based on current step
  const generateVisualization = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background
      const bgGradient = ctx.createLinearGradient(0, 0, 512, 512);
      bgGradient.addColorStop(0, '#000000');
      bgGradient.addColorStop(1, '#1a0033');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, 512, 512);

      // Progress circle
      const progress = currentStep / totalSteps;
      const centerX = 256;
      const centerY = 256;
      const radius = 150;

      // Draw progress arc
      ctx.strokeStyle = `rgba(147, 112, 219, 0.5)`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw progress fill
      ctx.strokeStyle = `rgba(147, 112, 219, 1)`;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
      ctx.stroke();

      // Draw energy visualization
      const energyRadius = 100 + currentFrame.energy * 50;
      ctx.fillStyle = `rgba(100, 200, 255, ${0.3 + currentFrame.energy * 0.4})`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, energyRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw harmony indicator
      const harmonyColor = Math.floor(currentFrame.harmony * 255);
      ctx.fillStyle = `rgb(${harmonyColor}, 100, 200)`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
      ctx.fill();

      // Draw step number
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(currentStep + 1), centerX, centerY);
    }
    
    return canvas.toDataURL();
  };

  return (
    <Card className="bg-slate-900/50 border-cyan-500/30 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-2xl text-cyan-200">108-Step Ritual Animation</CardTitle>
        <CardDescription className="text-cyan-300/70">
          Watch the consciousness progression through the sacred ritual cycle
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visualization */}
        <div className="rounded-lg overflow-hidden border border-cyan-500/30 bg-black flex items-center justify-center aspect-square">
          <img 
            src={generateVisualization()} 
            alt="Ritual Animation"
            className="w-full h-full"
          />
        </div>

        {/* Step Information */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center p-4 rounded-lg bg-cyan-950/30 border border-cyan-500/20">
            <div className="text-cyan-400 font-semibold">Step</div>
            <div className="text-cyan-200 text-2xl font-bold">{currentStep + 1}</div>
            <div className="text-cyan-300/50 text-xs">of {totalSteps}</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-cyan-950/30 border border-cyan-500/20">
            <div className="text-cyan-400 font-semibold">Mantra</div>
            <div className="text-cyan-200 text-sm font-semibold">{currentFrame.mantra}</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-cyan-950/30 border border-cyan-500/20">
            <div className="text-cyan-400 font-semibold">Harmony</div>
            <div className="text-cyan-200 font-mono">{currentFrame.harmony.toFixed(4)}</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-cyan-950/30 border border-cyan-500/20">
            <div className="text-cyan-400 font-semibold">Energy</div>
            <div className="text-cyan-200 font-mono">{currentFrame.energy.toFixed(2)}</div>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button 
            onClick={togglePlayback}
            size="lg"
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Play
              </>
            )}
          </Button>
          <Button 
            onClick={resetAnimation}
            variant="outline"
            size="lg"
            className="border-cyan-500/30 text-cyan-200 hover:bg-cyan-950/30"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Progress Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <label className="text-cyan-200 font-semibold">Progress</label>
            <span className="text-cyan-400">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          <Slider
            value={[currentStep]}
            onValueChange={handleStepChange}
            min={0}
            max={totalSteps - 1}
            step={1}
            className="w-full"
          />
        </div>

        {/* Playback Speed */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-cyan-200 font-semibold">Playback Speed</label>
            <span className="text-cyan-400">{playbackSpeed.toFixed(1)}x</span>
          </div>
          <Slider
            value={[playbackSpeed]}
            onValueChange={(value) => setPlaybackSpeed(value[0])}
            min={0.25}
            max={2}
            step={0.25}
            className="w-full"
          />
        </div>

        {/* Information */}
        <div className="p-4 rounded-lg bg-cyan-950/20 border border-cyan-500/10">
          <p className="text-sm text-cyan-200/70">
            Each step represents a moment in the consciousness progression. 
            Watch as harmony rises and energy flows through the sacred cycle.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

