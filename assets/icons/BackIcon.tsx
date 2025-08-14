// icons/ArrowBackIcon.tsx
import * as React from "react";
import Svg, { Path } from "react-native-svg";

export default function ArrowBackIcon({
  color = "#464646",
  stroke = 1.5,
  width = 24,
  height = 24,
}: any) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M21 12L3 12M3 12L11.5 3.5M3 12L11.5 20.5"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
