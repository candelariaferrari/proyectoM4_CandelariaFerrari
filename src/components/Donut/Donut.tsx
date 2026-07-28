import type { ReactNode } from "react";
import "./Donut.css";

interface DonutSegment {
  value: number;
  color: string;
}

interface DonutProps {
  segments: DonutSegment[];
  emptyColor?: string;
  size?: number;
  holeSize?: number;
  centerContent?: ReactNode;
}

function Donut({ segments, emptyColor = "#E5D6C2", size = 96, holeSize = 68, centerContent }: DonutProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  let background = emptyColor;
  if (total > 0) {
    let cumulative = 0;
    const stops = segments
      .filter((s) => s.value > 0)
      .map((s) => {
        const start = (cumulative / total) * 100;
        cumulative += s.value;
        const end = (cumulative / total) * 100;
        return `${s.color} ${start}% ${end}%`;
      });
    background = `conic-gradient(${stops.join(", ")})`;
  }

  return (
    <div className="donut" style={{ width: size, height: size, background }}>
      <div className="donut__hole" style={{ width: holeSize, height: holeSize }}>
        {centerContent}
      </div>
    </div>
  );
}

export default Donut;