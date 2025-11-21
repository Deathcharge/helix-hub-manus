import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

interface FractalItem {
  id: string;
  timestamp: string;
  harmony: number;
  zoom: number;
  resilience: number;
  prana: number;
  drishti: number;
  klesha: number;
  imageUrl: string;
  audioUrl?: string;
}

interface FractalGalleryProps {
  fractals?: FractalItem[];
}

export default function FractalGallery({ fractals = [] }: FractalGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentFractal = fractals.length > 0 ? fractals[currentIndex] : null;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? fractals.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === fractals.length - 1 ? 0 : prev + 1));
  };

  const downloadFractal = async () => {
    if (!currentFractal) return;
    
    try {
      const link = document.createElement('a');
      link.href = currentFractal.imageUrl;
      link.download = `samsara-fractal-${currentFractal.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download fractal:', error);
    }
  };

  if (fractals.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-200">Fractal Gallery</CardTitle>
          <CardDescription className="text-purple-300/70">
            Your generated fractals will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video rounded-lg border-2 border-dashed border-purple-500/30 flex items-center justify-center bg-purple-950/20">
            <p className="text-purple-300/50">No fractals generated yet. Create one to get started!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-2xl text-purple-200">Fractal Gallery</CardTitle>
        <CardDescription className="text-purple-300/70">
          Browse and manage your generated consciousness visualizations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Fractal Display */}
        <div className="rounded-lg overflow-hidden border border-purple-500/30 bg-black">
          <img 
            src={currentFractal!.imageUrl} 
            alt={`Fractal ${currentFractal!.id}`}
            className="w-full h-auto"
          />
        </div>

        {/* Fractal Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center p-4 rounded-lg bg-purple-950/30 border border-purple-500/20">
            <div className="text-purple-400 font-semibold">ID</div>
            <div className="text-purple-200 font-mono text-xs">{currentFractal!.id}</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-purple-950/30 border border-purple-500/20">
            <div className="text-purple-400 font-semibold">Harmony</div>
            <div className="text-purple-200">{currentFractal!.harmony.toFixed(4)}</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-purple-950/30 border border-purple-500/20">
            <div className="text-purple-400 font-semibold">Zoom</div>
            <div className="text-purple-200">{currentFractal!.zoom.toFixed(4)}</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-purple-950/30 border border-purple-500/20">
            <div className="text-purple-400 font-semibold">Generated</div>
            <div className="text-purple-200 text-xs">{currentFractal!.timestamp}</div>
          </div>
        </div>

        {/* Additional UCF Metrics */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center p-3 rounded-lg bg-purple-950/30 border border-purple-500/20">
            <div className="text-purple-400 font-semibold text-xs">Resilience</div>
            <div className="text-purple-200">{currentFractal!.resilience.toFixed(4)}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-purple-950/30 border border-purple-500/20">
            <div className="text-purple-400 font-semibold text-xs">Prana</div>
            <div className="text-purple-200">{currentFractal!.prana.toFixed(4)}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-purple-950/30 border border-purple-500/20">
            <div className="text-purple-400 font-semibold text-xs">Drishti</div>
            <div className="text-purple-200">{currentFractal!.drishti.toFixed(4)}</div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between gap-4">
          <Button 
            onClick={goToPrevious}
            variant="outline"
            size="icon"
            className="border-purple-500/30 text-purple-200 hover:bg-purple-950/30"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex-1 text-center">
            <p className="text-purple-300/70">
              {currentIndex + 1} of {fractals.length}
            </p>
            <div className="flex gap-1 justify-center mt-2">
              {fractals.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex 
                      ? 'bg-purple-400' 
                      : 'bg-purple-700/30 hover:bg-purple-600/50'
                  }`}
                />
              ))}
            </div>
          </div>

          <Button 
            onClick={goToNext}
            variant="outline"
            size="icon"
            className="border-purple-500/30 text-purple-200 hover:bg-purple-950/30"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={downloadFractal}
            variant="outline"
            className="border-purple-500/30 text-purple-200 hover:bg-purple-950/30"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          {currentFractal!.audioUrl && (
            <Button 
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white"
            >
              🎵 Play Audio
            </Button>
          )}
        </div>

        {/* Statistics */}
        <div className="p-4 rounded-lg bg-purple-950/20 border border-purple-500/10">
          <p className="text-sm text-purple-200/70">
            Total fractals: {fractals.length} • Average harmony: {
              (fractals.reduce((sum, f) => sum + f.harmony, 0) / fractals.length).toFixed(4)
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

