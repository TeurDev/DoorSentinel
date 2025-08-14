import React from "react";
import Svg, { Path, Line, SvgProps } from "react-native-svg";

interface EyeProps extends SvgProps {
  color?: string;
}

const EyeClosed = ({ color, ...props }: EyeProps) => {
  // Valor por defecto si 'color' es undefined o null
  const strokeColor = color ?? "#4F6ECD";

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      {/* Líneas y contorno del ojo siempre usan strokeColor */}
      <Path
        d="M19.5 16L17.0248 12.6038"
        stroke={strokeColor}
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 17.5V14"
        stroke={strokeColor}
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4.5 16L6.96895 12.6124"
        stroke={strokeColor}
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 8C6.6 16 17.4 16 21 8"
        stroke={strokeColor}
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default EyeClosed;
