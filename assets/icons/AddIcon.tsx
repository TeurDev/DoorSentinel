// icons/PlusCircleIcon.tsx
import * as React from "react";
import Svg, { Path } from "react-native-svg";

export default function PlusCircleIcon({
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
        d="M8 12H12M16 12H12M12 12V8M12 12V16"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
