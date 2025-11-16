import React from 'react';
import Svg, {
  Defs,
  RadialGradient as SVGRadialGradient,
  Circle,
  Stop,
} from 'react-native-svg';
export interface Color {
    offset: string;
    color: string;
    opacity: string;
  }
export const RadialGradient = ({ colorList, x, y, rx, ry }: {  colorList: Color[]; x: string; y: string; rx: string; ry: string}) => {
  return (
    <Svg height="100%" width="100%">
      <Defs>
        <SVGRadialGradient
          id="grad"
          cx={x}
          cy={y}
          rx={rx}
          ry={ry}
          gradientUnits="userSpaceOnUse"
        >
          {colorList.map((value, index) => (
            <Stop
              key={`RadialGradientItem_${index}`}
              offset={value.offset}
              stopColor={value.color}
              stopOpacity={value.opacity}
            />
          ))}
        </SVGRadialGradient>
      </Defs>
      <Circle cx={x} cy={y} r={rx} fill="url(#grad)" />
    </Svg>
  );
};