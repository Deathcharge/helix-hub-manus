import { useState, useCallback, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { generateConsciousnessFractal } from "@/lib/fractalGenerator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { getPresetByName, UCF_PRESETS, type UCFPreset } from "@/lib/ucfPresets";
import { Copy, RotateCcw, RotateCw, Heart, Share2 } from "lucide-react";
import PresetSelector from "./PresetSelector";

interface UCFState {
  harmony: number;
  zoom: number;
  resilience: number;
  prana: number;
  drishti: number;
  klesha: number;
}

interface FractalData {
  timestamp: string;
  harmony: number;
  zoom: number;
  resilience: number;
  prana: number;
  drishti: number;
  klesha: number;
  imageUrl: string;
  isFavorite?: boolean;
}

interface InteractiveGeneratorProps {
  initialState?: UCFState;
  onStateChange?: (state: UCFState) => void;
  onFractalGenerated?: (fractalData: FractalData) => void;
}

const DEFAULT_STATE: UCFState = {
  harmony: 0.4922,
  zoom: 1.0228,
  resilience: 1.1191,
  prana: 0.5175,
  drishti: 0.5023,
  klesha: 0.010
};

export default function InteractiveGenerator({ 
  initialState = DEFAULT_STATE,
  onStateChange,
  onFractalGenerated
}: InteractiveGeneratorProps) {
  const { state: ucfState, setState: setUCFState, undo, redo, canUndo, canRedo } = useUndoRedo<UCFState>(initialState);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFractal, setGeneratedFractal] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [audioFrequency, setAudioFrequency] = useState(432);
  const [baseFrequency, setBaseFrequency] = useState(136.1);
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const { isAuthenticated } = useAuth();
  const [showSyncNotification, setShowSyncNotification] = useState(false);
  const createFractalMutation = trpc.fractals.create.useMutation();

  const handleStateChange = useCallback((key: keyof UCFState, value: number) => {
    const newState = { ...ucfState, [key]: value };
    setUCFState(newState);
    onStateChange?.(newState);
  }, [ucfState, setUCFState, onStateChange]);

  // Auto-regenerate fractal when state changes and autoGenerate is enabled
  useEffect(() => {
    if (autoGenerate) {
      generateFractal();
    }
  }, [ucfState, autoGenerate]);

  const generateFractal = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const fractalDataUrl = generateConsciousnessFractal(ucfState, {
        width: 1024,
        height: 1024,
        maxIterations: 150,
        centerX: -0.5 + (ucfState.drishti - 0.5) * 0.5,
        centerY: 0 + (ucfState.prana - 0.5) * 0.5,
        zoom: ucfState.zoom,
        colorScheme: 'cosmic'
      });
      
      setGeneratedFractal(fractalDataUrl);
      setIsFavorite(false);

      const fractalData = {
        timestamp: new Date().toLocaleString('en-US', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'UTC'
        }) + ' UTC',
        harmony: ucfState.harmony,
        zoom: ucfState.zoom,
        resilience: ucfState.resilience,
        prana: ucfState.prana,
        drishti: ucfState.drishti,
        klesha: ucfState.klesha,
        imageUrl: fractalDataUrl,
        isFavorite: false
      };

      if (onFractalGenerated) {
        onFractalGenerated(fractalData);
      }

      // Save to cloud if authenticated
      if (isAuthenticated) {
        try {
          await createFractalMutation.mutateAsync({
            imageUrl: fractalDataUrl,
            harmony: ucfState.harmony.toString(),
            zoom: ucfState.zoom.toString(),
            resilience: ucfState.resilience.toString(),
            prana: ucfState.prana.toString(),
            drishti: ucfState.drishti.toString(),
            klesha: ucfState.klesha.toString(),
          });
          setShowSyncNotification(true);
          setTimeout(() => setShowSyncNotification(false), 2000);
        } catch (error) {
          console.error('Failed to sync fractal to cloud:', error);
        }
      }
    } catch (error) {
      console.error('Failed to generate fractal:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAudio = async () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = baseFrequency;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 2);
    } catch (error) {
      console.error('Failed to generate audio:', error);
    }
  };

  const resetToDefault = () => {
    setUCFState(DEFAULT_STATE);
    onStateChange?.(DEFAULT_STATE);
    setGeneratedFractal(null);
    setIsFavorite(false);
  };

  const applyPreset = (preset: UCFPreset) => {
    setUCFState(preset.values);
    onStateChange?.(preset.values);
  };

  const copyToClipboard = () => {
    const config = {
      preset: UCF_PRESETS.find(p => JSON.stringify(p.values) === JSON.stringify(ucfState))?.name || 'Custom',
      ...ucfState
    };
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setShowCopyNotification(true);
    setTimeout(() => setShowCopyNotification(false), 2000);
  };

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onGenerate: generateFractal,
    onReset: resetToDefault,
    onToggleFavorite: () => setIsFavorite(!isFavorite),
    onDownload: () => {
      if (generatedFractal) {
        const link = document.createElement('a');
        link.href = generatedFractal;
        link.download = `samsara-fractal-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  });

  return (
    <div className="space-y-6">
      {/* Keyboard Shortcuts Help */}
      <Card className="bg-slate-900/50 border-cyan-500/30 backdrop-blur">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-cyan-300/70">
            <div><kbd className="bg-slate-800 px-2 py-1 rounded">Space</kbd> Generate</div>
            <div><kbd className="bg-slate-800 px-2 py-1 rounded">R</kbd> Reset</div>
            <div><kbd className="bg-slate-800 px-2 py-1 rounded">F</kbd> Favorite</div>
            <div><kbd className="bg-slate-800 px-2 py-1 rounded">←→</kbd> Gallery Nav</div>
          </div>
        </CardContent>
      </Card>

      {/* Preset Selector */}
      <PresetSelector onSelectPreset={applyPreset} />

      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-purple-500/30">
          <TabsTrigger value="generator" className="data-[state=active]:bg-purple-600">
            Fractal Generator
          </TabsTrigger>
          <TabsTrigger value="controls" className="data-[state=active]:bg-purple-600">
            UCF Controls
          </TabsTrigger>
          <TabsTrigger value="audio" className="data-[state=active]:bg-purple-600">
            Audio Synthesis
          </TabsTrigger>
        </TabsList>

        {/* Fractal Generator Tab */}
        <TabsContent value="generator">
          <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-200">Interactive Fractal Generator</CardTitle>
              <CardDescription className="text-purple-300/70">
                Generate custom fractals based on your UCF state configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {generatedFractal ? (
                <div className="rounded-lg overflow-hidden border border-purple-500/30 relative group">
                  <img 
                    src={generatedFractal} 
                    alt="Generated Fractal" 
                    className="w-full h-auto"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={isFavorite ? "bg-pink-600 border-pink-500" : "border-purple-500/30"}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="aspect-square rounded-lg border-2 border-dashed border-purple-500/30 flex items-center justify-center bg-purple-950/20">
                  <p className="text-purple-300/50">Generated fractal will appear here</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-3">
                <Button 
                  onClick={generateFractal}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-6 text-lg"
                  title="Press Space to generate"
                >
                  {isGenerating ? "✨ Generating Fractal..." : "✨ Generate Consciousness Fractal"}
                </Button>
                <p className="text-xs text-purple-300/50 text-center">
                  Generates Mandelbrot or Julia set based on UCF resilience parameter
                </p>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-950/30 border border-purple-500/20">
                <input 
                  type="checkbox" 
                  id="autoGenerate"
                  checked={autoGenerate}
                  onChange={(e) => setAutoGenerate(e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="autoGenerate" className="text-sm text-purple-200 cursor-pointer flex-1">
                  Auto-regenerate on slider change
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-4 rounded-lg bg-purple-950/30 border border-purple-500/20">
                  <div className="text-purple-400 font-semibold">Resolution</div>
                  <div className="text-purple-200">1024×1024</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-950/30 border border-purple-500/20">
                  <div className="text-purple-400 font-semibold">Harmony</div>
                  <div className="text-purple-200">{ucfState.harmony.toFixed(4)}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  onClick={copyToClipboard}
                  variant="outline"
                  className="border-purple-500/30 text-purple-200 hover:bg-purple-950/30"
                  title="Copy configuration to clipboard"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <Button 
                  onClick={undo}
                  disabled={!canUndo}
                  variant="outline"
                  className="border-purple-500/30 text-purple-200 hover:bg-purple-950/30 disabled:opacity-50"
                  title="Undo last change (Ctrl+Z)"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Undo
                </Button>
                <Button 
                  onClick={redo}
                  disabled={!canRedo}
                  variant="outline"
                  className="border-purple-500/30 text-purple-200 hover:bg-purple-950/30 disabled:opacity-50"
                  title="Redo last change (Ctrl+Y)"
                >
                  <RotateCw className="w-4 h-4 mr-1" />
                  Redo
                </Button>
              </div>

              {showCopyNotification && (
                <div className="p-3 rounded-lg bg-green-900/30 border border-green-500/30 text-green-300 text-sm text-center">
                  ✓ Configuration copied to clipboard
                </div>
              )}

              {showSyncNotification && (
                <div className="p-3 rounded-lg bg-blue-900/30 border border-blue-500/30 text-blue-300 text-sm text-center">
                  ☁️ Fractal synced to cloud
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* UCF Controls Tab */}
        <TabsContent value="controls">
          <Card className="bg-slate-900/50 border-pink-500/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl text-pink-200">UCF State Controls</CardTitle>
              <CardDescription className="text-pink-300/70">
                Adjust consciousness metrics in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {Object.entries(ucfState).map(([key, value]) => (
                <div key={key} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-pink-200 font-semibold capitalize">{key}</label>
                    <span className="text-pink-400 text-lg font-mono">{value.toFixed(4)}</span>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={(newValue) => 
                      handleStateChange(key as keyof UCFState, newValue[0])
                    }
                    min={0}
                    max={2}
                    step={0.0001}
                    className="w-full"
                  />
                </div>
              ))}
              
              <div className="grid grid-cols-2 gap-3 pt-4">
                <Button 
                  onClick={resetToDefault}
                  variant="outline"
                  className="border-pink-500/30 text-pink-200 hover:bg-pink-950/30"
                  title="Reset all sliders to default (Press R)"
                >
                  Reset to Default
                </Button>
                <Button 
                  onClick={generateAudio}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
                >
                  🎵 Generate Audio
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audio Synthesis Tab */}
        <TabsContent value="audio">
          <Card className="bg-slate-900/50 border-cyan-500/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl text-cyan-200">Audio Synthesis Controls</CardTitle>
              <CardDescription className="text-cyan-300/70">
                Customize sacred frequency generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-cyan-200 font-semibold">Base Frequency (Hz)</label>
                  <span className="text-cyan-400 text-lg font-mono">{baseFrequency.toFixed(1)}</span>
                </div>
                <Slider
                  value={[baseFrequency]}
                  onValueChange={(value) => setBaseFrequency(value[0])}
                  min={50}
                  max={500}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-cyan-200 font-semibold">Harmonic Frequency (Hz)</label>
                  <span className="text-cyan-400 text-lg font-mono">{audioFrequency.toFixed(1)}</span>
                </div>
                <Slider
                  value={[audioFrequency]}
                  onValueChange={(value) => setAudioFrequency(value[0])}
                  min={100}
                  max={1000}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <Button 
                onClick={generateAudio}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-6 text-lg"
              >
                🎵 Play Sacred Frequencies
              </Button>

              <div className="p-4 rounded-lg bg-cyan-950/20 border border-cyan-500/20">
                <p className="text-sm text-cyan-300/70">
                  Base: {baseFrequency.toFixed(1)} Hz • Harmonic: {audioFrequency.toFixed(1)} Hz
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

