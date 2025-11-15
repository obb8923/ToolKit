import React, { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Svg, { Line } from 'react-native-svg';
import { Text } from '@component/Text';
import { CompassSensor, CompassData } from '@lib/sensors/SensorModule';
import { useTranslation } from 'react-i18next';
import { DEVICE_WIDTH } from '@constant/NORMAL';
import { COLOR } from '@constant/COLOR';
const COMPASS_SIZE = DEVICE_WIDTH * 0.4;
const CENTER = COMPASS_SIZE / 2;
const RADIUS = COMPASS_SIZE / 2 - 20;
const TICK_RADIUS = COMPASS_SIZE / 2 - 5; // 각도 표시선 반지름 (더 바깥쪽)
const LABEL_RADIUS = RADIUS - 10; // 방향 라벨을 바깥쪽에 배치

const getPositionForDirection = (angle: number, radius: number) => {
  const rad = (angle * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.sin(rad) - 10,
    y: CENTER - radius * Math.cos(rad) - 10,
  };
};

const getTickPosition = (angle: number, length: number) => {
  const rad = (angle * Math.PI) / 180;
  const startX = CENTER + TICK_RADIUS * Math.sin(rad);
  const startY = CENTER - TICK_RADIUS * Math.cos(rad);
  const endX = CENTER + (TICK_RADIUS - length) * Math.sin(rad);
  const endY = CENTER - (TICK_RADIUS - length) * Math.cos(rad);
  return { startX, startY, endX, endY };
};

export const Compass = () => {
  const { t } = useTranslation();
  const [azimuth, setAzimuth] = useState<number | null>(null);
  const sensorRef = useRef<CompassSensor | null>(null);

  // 방향 표시 회전 스타일 (실제 지리적 방향을 가리키도록 반대 방향으로 회전)
  const labelRotateAnim = useSharedValue(0);
  const currentLabelRotation = useRef<number>(0);

  useEffect(() => {
    sensorRef.current = new CompassSensor();
    
    const listener = (data: CompassData) => {
      setAzimuth(data.azimuth);
      
      // 방향 표시 회전 애니메이션 (실제 지리적 방향을 가리키도록 반대 방향)
      // 최단 경로로 회전하도록 각도 계산
      const targetRotation = data.azimuth;
      let diff = targetRotation - currentLabelRotation.current;
      
      // 360도 정규화 - 최단 경로 선택
      if (diff > 180) {
        diff -= 360;
      } else if (diff < -180) {
        diff += 360;
      }
      
      const finalRotation = currentLabelRotation.current + diff;
      currentLabelRotation.current = finalRotation;
      
      labelRotateAnim.value = withTiming(finalRotation, {
        duration: 100,
      });
    };

    sensorRef.current.addListener(listener);
    sensorRef.current.startListening();

    return () => {
      sensorRef.current?.stopListening();
    };
  }, []);

  const directions = [
    { label: 'N', angle: 0 },
    { label: 'E', angle: 90 },
    { label: 'S', angle: 180 },
    { label: 'W', angle: 270 },
  ];

  // 각도 표시선 생성 (5도 간격)
  const tickMarks = [];
  for (let angle = 0; angle < 360; angle += 5) {
    const isCardinal = angle === 0 || angle === 90 || angle === 180 || angle === 270;
    tickMarks.push({
      angle,
      isCardinal,
      width: isCardinal ? 2 : 1,
      length: isCardinal ? 12 : 8,
    });
  }

  // 방향 표시 회전 스타일 (실제 지리적 방향을 가리키도록 반대 방향으로 회전)
  const labelRotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        rotate: `${-labelRotateAnim.value}deg`,
      }],
    };
  });

  return (
      <View 
        className="justify-center items-center p-8 bg-black"
        style={{ width: COMPASS_SIZE + 16, height: COMPASS_SIZE + 16 ,borderRadius: (COMPASS_SIZE + 16) / 2}}
      >
        {/* 원형 배경 */}
        <View 
          className="justify-center items-center relative bg-neutral-800"
          style={{ 
            width: COMPASS_SIZE, 
            height: COMPASS_SIZE, 
            borderRadius: COMPASS_SIZE / 2 
          }}
        >
          {/* 각도 표시선과 방향 라벨 컨테이너 (실제 지리적 방향을 가리키도록 회전) */}
          <Animated.View 
            className="absolute justify-center items-center"
            style={[
              { 
                width: COMPASS_SIZE, 
                height: COMPASS_SIZE 
              },
              labelRotateStyle
            ]}
          >
            {/* 각도 표시선 SVG */}
            <Svg 
              width={COMPASS_SIZE} 
              height={COMPASS_SIZE}
              style={{ position: 'absolute' }}
            >
              {/* 각도 표시선 */}
              {tickMarks.map((tick, index) => {
                const pos = getTickPosition(tick.angle, tick.length);
                return (
                  <Line
                    key={index}
                    x1={pos.startX}
                    y1={pos.startY}
                    x2={pos.endX}
                    y2={pos.endY}
                    stroke={COLOR['white']}
                    strokeWidth={tick.width}
                    strokeLinecap="round"
                  />
                );
              })}
            </Svg>

            {/* 방향 라벨 */}
            <View className="absolute top-0 left-0 right-0 bottom-0 p-8">
              {directions.map((dir) => {
                const pos = getPositionForDirection(dir.angle, LABEL_RADIUS);
                // 각 방향 라벨의 회전 각도
                const labelRotation = 
                  dir.label === 'W' ? 270 :
                  dir.label === 'E' ? 90 :
                  dir.label === 'S' ? 180 : 0;
                
                return (
                  <View
                    key={dir.label}
                    className="absolute justify-center items-center"
                    style={[
                      { 
                        left: pos.x, 
                        top: pos.y,
                        width: dir.label === 'N' ? 24 : 20,
                        height: dir.label === 'N' ? 24 : 20,
                        transform: [{ rotate: `${labelRotation}deg` }],
                      }
                    ]}
                  >
                    <Text
                      text={dir.label}
                      type={dir.label === 'N' ? 'title3' : 'body1'}
                      className={dir.label === 'N' ? 'text-red-600 font-bold' : 'text-white'}
                    />
                  </View>
                );
              })}
            </View>
          </Animated.View>
        </View>
      </View>
  );
};
