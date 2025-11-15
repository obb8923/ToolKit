import { View } from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type OvenProps = {
  isOn?: boolean;
};

export const Oven = ({ isOn = false }: OvenProps) => {
  const offOpacity = useSharedValue(isOn ? 0 : 1);
  const onOpacity = useSharedValue(isOn ? 1 : 0);

  useEffect(() => {
    offOpacity.value = withTiming(isOn ? 0 : 1, { duration: 250 });
    onOpacity.value = withTiming(isOn ? 1 : 0, { duration: 250 });
  }, [isOn, offOpacity, onOpacity]);

  const offAnimatedStyle = useAnimatedStyle(() => ({
    opacity: offOpacity.value,
  }));

  const onAnimatedStyle = useAnimatedStyle(() => ({
    opacity: onOpacity.value,
  }));

  return (
    <View className="w-full items-center justify-center ">
      <View
        className="w-1/2 items-center justify-center"
        style={{
          aspectRatio: 1,
          boxShadow: isOn
            ? [
                {
                  offsetX: 0,
                  offsetY: 0,
                  blurRadius: 100,
                  spreadDistance: 7,
                  color: '#FFA6214d',
                },
              ]
            : undefined,
        }}>
        <Animated.Image
          source={require('@assets/pngs/oven_on.png')}
          className="absolute inset-0 w-full h-full"
          resizeMode="contain"
          style={onAnimatedStyle}
        />
        <Animated.Image
          source={require('@assets/pngs/oven_off.png')}
          className="absolute inset-0 w-full h-full"
          resizeMode="contain"
          style={offAnimatedStyle}
        />
      </View>
    </View>
  );
};