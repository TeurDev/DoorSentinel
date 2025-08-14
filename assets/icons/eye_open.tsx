import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface EyeProps extends SvgProps {
  color?: string;
}

const EyeOpen = ({ color, ...props }: EyeProps) => {
  // Si no se recibe ningún 'color' válido, usar '#0B3D91' por defecto
  const fillColor = color ?? "#A0B4FF";

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      {/* Contorno del ojo: siempre stroke={fillColor} */}
      <Path
        d="M3 13C6.6 5 17.4 5 21 13"
        stroke={fillColor}
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Iris interior: fill={fillColor} y stroke={fillColor} */}
      <Path
        d="M12 17C10.3431 17 9 15.6569 9 14C9 12.3431 10.3431 11 12 11C13.6569 11 15 12.3431 15 14C15 15.6569 13.6569 17 12 17Z"
        fill={fillColor}
        stroke={fillColor}
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default EyeOpen;
