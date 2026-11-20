import Slider from "@react-native-community/slider";

import { ControlCard } from "@/src/components/configurator/ControlCard";
import type { SliderRange } from "@/src/engine/config";
import { useTheme } from "@/src/theme/useTheme";

type SliderControlProps = {
  title: string;
  range: SliderRange;
  value: number;
  decimals: number;
  unit?: string;
  hint?: string;
  onChange: (value: number) => void;
};

export function SliderControl({
  title,
  range,
  value,
  decimals,
  unit,
  hint,
  onChange,
}: SliderControlProps) {
  const theme = useTheme();
  const shown = `${value.toFixed(decimals)}${unit ? ` ${unit}` : ""}`;

  return (
    <ControlCard title={title} value={shown} hint={hint}>
      <Slider
        value={value}
        minimumValue={range.min}
        maximumValue={range.max}
        step={range.step}
        minimumTrackTintColor={theme.accent}
        maximumTrackTintColor={theme.track}
        thumbTintColor={theme.accent}
        onValueChange={(next) => onChange(Number(next.toFixed(decimals)))}
        accessibilityLabel={title}
      />
    </ControlCard>
  );
}
