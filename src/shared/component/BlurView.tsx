import { BlurView as RNBlurView } from '@react-native-community/blur';
import { View, ViewStyle } from 'react-native';

interface BlurViewProps {
  children?: React.ReactNode;
  blurType?: 'light' | 'dark' | 'prominent' | 'regular';
  blurAmount?: number;
  style?: ViewStyle;
  className?: string;
  borderRadius: number;
}
export const BlurView = ({ children, blurType = 'light', blurAmount = 10, style={}, className='', borderRadius }: BlurViewProps) => {
  return (
    <View  style={{...style, borderRadius}} className={className}>
    <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,borderRadius,boxShadow:[
      {
        inset: true,
        offsetX: 0,
        offsetY: 0,
        blurRadius: 7.5,
        spreadDistance: 0,
        color: 'rgba(255, 255, 255, 0.7)',
      },
    ]}}/>
     <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,borderRadius,boxShadow:[
      {
        inset: true,
        offsetX: 0,
        offsetY: 0,
        blurRadius: 2.5,
        spreadDistance: 0,
        color: 'rgba(255, 255, 255, 0.7)',
      },
    ]}}/>
    <RNBlurView
      blurType={blurType}
      blurAmount={blurAmount}
      style={{flex: 1,position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,borderRadius}}
    />
      {children}
    </View>
  );
};