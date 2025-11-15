import React, { useEffect, useState, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { Text } from '@component/Text';
import { CompassSensor, CompassData } from '@lib/sensors/SensorModule';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');
const COMPASS_SIZE = Math.min(width - 64, 280);
const CENTER = COMPASS_SIZE / 2;
const RADIUS = COMPASS_SIZE / 2 - 20;

const getDirection = (azimuth: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(azimuth / 45) % 8;
  return directions[index];
};

const getPositionForDirection = (angle: number, radius: number) => {
  const rad = (angle * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.sin(rad) - 10,
    y: CENTER - radius * Math.cos(rad) - 10,
  };
};

export const Compass = () => {
  const { t } = useTranslation();
  const [azimuth, setAzimuth] = useState<number | null>(null);
  const sensorRef = React.useRef<CompassSensor | null>(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const currentRotation = useRef<number>(0);

  useEffect(() => {
    sensorRef.current = new CompassSensor();
    
    const listener = (data: CompassData) => {
      setAzimuth(data.azimuth);
      
      // 최단 경로로 회전하도록 각도 계산
      // 기기가 회전하는 방향과 반대로 바늘이 회전해야 함
      const targetRotation = data.azimuth;
      let diff = targetRotation - currentRotation.current;
      
      // 360도 정규화 - 최단 경로 선택
      if (diff > 180) {
        diff -= 360;
      } else if (diff < -180) {
        diff += 360;
      }
      
      const finalRotation = currentRotation.current + diff;
      currentRotation.current = finalRotation;
      
      // 바늘 회전 애니메이션
      Animated.timing(rotateAnim, {
        toValue: finalRotation,
        duration: 100,
        useNativeDriver: true,
      }).start();
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

  const rotateStyle = {
    transform: [{
      rotate: rotateAnim.interpolate({
        inputRange: [-720, 720],
        outputRange: ['-720deg', '720deg'],
        extrapolate: 'clamp',
      })
    }],
  };

  return (
    <View className="p-4 bg-white rounded-lg mb-4 items-center">
      <Text text={t('sensors.compass.title')} type="title4" className="mb-4" />
      
      <View style={styles.compassContainer}>
        {/* 원형 배경 */}
        <View style={styles.compassCircle}>
          {/* 방향 라벨 */}
          {directions.map((dir) => {
            const pos = getPositionForDirection(dir.angle, RADIUS);
            return (
              <View
                key={dir.label}
                style={[
                  styles.directionLabel,
                  { left: pos.x, top: pos.y },
                  dir.label === 'N' && styles.northLabel,
                ]}
              >
                <Text
                  text={dir.label}
                  type={dir.label === 'N' ? 'title3' : 'body1'}
                  className={dir.label === 'N' ? 'text-red-600 font-bold' : 'text-gray-700'}
                />
              </View>
            );
          })}

          {/* 중앙 바늘 */}
          <Animated.View style={[styles.needleContainer, rotateStyle]}>
            {/* 북쪽 바늘 (빨간색) */}
            <View style={styles.needleNorth} />
            {/* 남쪽 바늘 (회색) */}
            <View style={styles.needleSouth} />
            {/* 중앙 점 */}
            <View style={styles.centerDot} />
          </Animated.View>
        </View>
      </View>

      {/* 각도 표시 */}
      {azimuth !== null && (
        <View className="mt-4 flex-row items-baseline">
          <Text 
            text={azimuth.toFixed(1)} 
            type="number" 
            className="text-primary mr-2" 
          />
          <Text text="°" type="body2" className="text-gray-600 mr-4" />
          <Text 
            text={getDirection(azimuth)} 
            type="title3" 
            className="text-primary font-bold" 
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  compassContainer: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compassCircle: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  directionLabel: {
    position: 'absolute',
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  northLabel: {
    width: 24,
    height: 24,
  },
  needleContainer: {
    position: 'absolute',
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  needleNorth: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 0,
    borderBottomWidth: RADIUS - 15,
    borderBottomColor: '#dc2626',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    top: 15,
    left: CENTER - 6,
  },
  needleSouth: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: RADIUS - 15,
    borderBottomWidth: 0,
    borderTopColor: '#6b7280',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    bottom: 15,
    left: CENTER - 6,
  },
  centerDot: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#1f2937',
    zIndex: 10,
  },
});

