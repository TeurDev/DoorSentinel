// icons/PlusIcon.tsx
import * as React from "react";
import Svg, { Path } from "react-native-svg";

export default function PlusIcon({
  color = "#464646",
  stroke = 1.4,
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
        d="M6 12H12M18 12H12M12 12V6M12 12V18"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
