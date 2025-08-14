// icons/LockOffWideIcon.tsx
import * as React from "react";
import Svg, { Path } from "react-native-svg";

export default function LockOffWideIcon({
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
        d="M36.1667 38H18.2C16.985 38 16 38.9849 16 40.2V65.1333C16 66.3485 16.985 67.3333 18.2 67.3333H57.8C59.0151 67.3333 60 66.3485 60 65.1333V61.8333"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M52.6668 38V23.3333C52.6668 18.4444 49.7334 8.66663 38.0001 8.66663C35.2618 8.66663 33.0028 9.19921 31.1482 10.078"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M52.6667 38H57.8001C59.0152 38 60.0001 38.9849 60.0001 40.2V41.6667"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M23.3333 23.3334V25.1667V38"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 5L71 71"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
