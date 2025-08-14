// icons/LockWideIcon.tsx
import * as React from "react";
import Svg, { Path } from "react-native-svg";

export default function LockWideIcon({
  color = "#464646",
  stroke = 6,
  width = 75,
  height = 75,
}: any) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 75 75"
      fill="none"
    >
      <Path
        d="M52.6667 38.04H57.8C59.0151 38.04 60 39.015 60 40.218V64.902C60 66.105 59.0151 67.08 57.8 67.08H18.2C16.985 67.08 16 66.105 16 64.902V40.218C16 39.015 16.985 38.04 18.2 38.04H23.3333H52.6667ZM52.6667 38.04V27.1499V23.52C52.6667 18.68 50 8.5 38 8.5C30 8.5 25.5 14 24.5 18.5"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
