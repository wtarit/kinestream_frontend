import { useState } from "react";
import type { ResolutionPresetDTO } from "~/types/resolution";

export function ResolutionPicker({
  presets,
  onSubmit,
  isSubmitting,
}: {
  presets: ResolutionPresetDTO[];
  onSubmit: (resolutions: ResolutionPresetDTO[]) => void;
  isSubmitting: boolean;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleResolution = (label: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const handleSubmit = () => {
    const chosen = presets.filter((p) => selected.has(p.label));
    onSubmit(chosen);
  };

  if (presets.length === 0) {
    return <p className="text-sm text-base-content/60">No resolutions available for transcoding.</p>;
  }

  return (
    <div className="space-y-3">
      {presets.map((preset) => (
        <label
          key={preset.label}
          className="flex items-center gap-3 bg-base-300 rounded-lg px-3 py-2 cursor-pointer hover:bg-base-300/80"
        >
          <input
            type="checkbox"
            className="checkbox checkbox-primary checkbox-sm"
            checked={selected.has(preset.label)}
            onChange={() => toggleResolution(preset.label)}
            disabled={isSubmitting}
          />
          <div className="flex-1">
            <span className="font-medium text-sm">{preset.label}</span>
            <span className="text-xs text-base-content/50 ml-2">
              {preset.width}x{preset.height}
              {preset.description && ` - ${preset.description}`}
            </span>
          </div>
          <span className="text-xs text-base-content/40">{preset.targetBitrateKbps} kbps</span>
        </label>
      ))}
      <button
        className="btn btn-primary btn-sm"
        disabled={selected.size === 0 || isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          `Transcode ${selected.size} resolution${selected.size !== 1 ? "s" : ""}`
        )}
      </button>
    </div>
  );
}
