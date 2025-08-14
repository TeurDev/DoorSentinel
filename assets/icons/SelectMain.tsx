// icons/ChevronDownBoxIcon.tsx
import * as React from "react";
import Svg, { Path } from "react-native-svg";

export default function ChevronDownBoxIcon({
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
        d="M14.5 10.75L12 13.25L9.5 10.75"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 5H18C20.2091 5 22 6.79086 22 9V15C22 17.2091 20.2091 19 18 19H6C3.79086 19 2 17.2091 2 15V9C2 6.79086 3.79086 5 6 5Z"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
