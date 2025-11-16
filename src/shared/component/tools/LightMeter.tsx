import React, { useEffect, useState, useRef } from 'react';
import { View ,Text} from 'react-native';
import { LightMeterSensor, LightMeterData } from '@lib/sensors/SensorModule';
import { DEVICE_WIDTH,DEVICE_HEIGHT } from '@constant/NORMAL';
import { RadialGradient,BlurView } from '@component/index';

export const LightMeter = () => {
  const [lux, setLux] = useState<number | null>(null);
  const [smoothedLux, setSmoothedLux] = useState<number | null>(null);
  const sensorRef = useRef<LightMeterSensor | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const targetLuxRef = useRef<number | null>(null);
  const currentLuxRef = useRef<number | null>(null);

  useEffect(() => {
    sensorRef.current = new LightMeterSensor();
    
    const listener = (data: LightMeterData) => {
      setLux(data.lux);
      targetLuxRef.current = data.lux;
    };

    sensorRef.current.addListener(listener);
    sensorRef.current.startListening();

    return () => {
      sensorRef.current?.stopListening();
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Smoothing 애니메이션
  useEffect(() => {
    if (lux === null) {
      setSmoothedLux(null);
      currentLuxRef.current = null;
      return;
    }

    // 초기값 설정
    if (currentLuxRef.current === null) {
      currentLuxRef.current = lux;
      setSmoothedLux(lux);
      return;
    }

    // 애니메이션 루프
    const animate = () => {
      if (currentLuxRef.current === null || targetLuxRef.current === null) {
        return;
      }

      const current = currentLuxRef.current;
      const target = targetLuxRef.current;
      
      // 선형 보간 (lerp) - 부드러운 전환
      // 0.1은 smoothing factor (0에 가까울수록 더 부드럽지만 느림)
      const smoothingFactor = 0.15;
      const diff = target - current;
      
      if (Math.abs(diff) < 0.1) {
        // 거의 도달했으면 바로 설정
        currentLuxRef.current = target;
        setSmoothedLux(target);
      } else {
        // 부드럽게 전환
        currentLuxRef.current = current + diff * smoothingFactor;
        setSmoothedLux(currentLuxRef.current);
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [lux]);

  // Lux 값에 따라 반지름 계산 (5% ~ 100%)
  // 100 Lux 이하 -> 5%
  // 30000 Lux 이상 -> 100%
  // 100 ~ 30000 사이는 선형 보간
  const calculateRadius = (luxValue: number | null): string => {
    if (luxValue === null) {
      return '5%';
    }
    
    if (luxValue <= 100) {
      return '5%';
    }
    
    if (luxValue >= 30000) {
      return '100%';
    }
    
    // 100 ~ 30000 사이 선형 보간 (5% ~ 100%)
    const normalized = (luxValue - 100) / (30000 - 100);
    const radiusPercent = 5 + (normalized * 95);
    return `${radiusPercent}%`;
  };

  const gradientRadius = calculateRadius(smoothedLux);
  const CIRCLE_PADDING = 8;

  return (
    <View className="overflow-hidden bg-black flex flex-row items-center justify-between"
    style={{width:DEVICE_WIDTH /2 ,height:DEVICE_WIDTH /4,borderRadius:DEVICE_WIDTH /4}}>
    <View className="p-4 h-full aspect-square bg-black rounded-lg bg-neutral-800 justify-center items-center overflow-hidden" 
    style={{borderRadius:DEVICE_WIDTH /4,
      boxShadow:[
        {
          inset: true,
          offsetX: 0,
          offsetY: 0,
          blurRadius: 10,
          spreadDistance: 0,
          color: 'rgba(0, 0, 0, 0.7)',
        },
        {
          inset: true,
          offsetX: 0,
          offsetY: 0,
          blurRadius: 5,
          spreadDistance: 0,
          color: 'rgba(0, 0, 0, 0.7)',
        },
      ],
    }}>
      <View style={{width:DEVICE_WIDTH /4 ,height:DEVICE_WIDTH /4,borderRadius:DEVICE_WIDTH /4,overflow:'hidden'}}>
      <RadialGradient 
        colorList={[
        {offset: '0%', color: 'rgba(255, 255, 255)', opacity: '1'}, 
        {offset: '100%', color: 'rgba(255, 255, 255)', opacity: '0'}]} 
        x="50%" y="50%" rx={gradientRadius} ry={gradientRadius} 
        />
        </View>
      {/* <View className="flex-row items-baseline">
        <Text 
          text={lux !== null ? lux.toFixed(0) : '--'} 
          type="number" 
          className="text-primary mr-2" 
        />
        <Text text={t('sensors.lightMeter.unit')} type="body2" className="text-gray-600" />
      </View> */}
    </View>
    <BlurView
          style={{
            position: 'absolute',
            right: CIRCLE_PADDING,
            top: CIRCLE_PADDING,
            width: DEVICE_WIDTH /4 - CIRCLE_PADDING * 2,
            height: DEVICE_WIDTH /4 - CIRCLE_PADDING * 2,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          borderRadius={(DEVICE_WIDTH /4 - CIRCLE_PADDING * 2) / 2}
          blurType="dark"
          blurAmount={8}
        >
          <View className="items-center justify-center">
          <Text className="text-gray-200" style={{fontSize: DEVICE_WIDTH /4 / 4}}>{smoothedLux !== null ? smoothedLux.toFixed(1) : '--'}</Text>
          <Text className="text-gray-500" style={{fontSize: DEVICE_WIDTH /4 / 10}}>Lux</Text>
          </View>
        </BlurView>
    </View>
  );
};

