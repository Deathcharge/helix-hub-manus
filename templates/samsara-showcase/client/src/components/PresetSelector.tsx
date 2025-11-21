import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UCF_PRESETS, type UCFPreset } from "@/lib/ucfPresets";
import { Sparkles } from "lucide-react";

interface PresetSelectorProps {
  onSelectPreset: (preset: UCFPreset) => void;
}

export default function PresetSelector({ onSelectPreset }: PresetSelectorProps) {
  return (
    <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg text-purple-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          UCF Presets
        </CardTitle>
        <CardDescription className="text-purple-300/70">
          Quick-load consciousness configurations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {UCF_PRESETS.map((preset) => (
            <Button
              key={preset.name}
              onClick={() => onSelectPreset(preset)}
              variant="outline"
              className="h-auto py-3 px-2 flex flex-col items-center justify-center gap-1 border-purple-500/30 text-purple-200 hover:bg-purple-950/30 text-xs text-center"
              title={preset.description}
            >
              <span className="font-semibold">{preset.name}</span>
              <span className="text-purple-400/60 text-xs">{preset.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

