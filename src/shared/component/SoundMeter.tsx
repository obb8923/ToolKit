import React, { useEffect, useState, useRef } from 'react';
import { View, Text} from 'react-native';
import Svg, { Rect, Circle } from 'react-native-svg';
import { SoundMeterSensor, SoundMeterData } from '@lib/sensors/SensorModule';
import { useTranslation } from 'react-i18next';
import { DEVICE_HEIGHT } from '@constant/NORMAL';
import { COLOR } from '@constant/COLOR';
import { BlurView } from '@component/index';

const WAVE_HEIGHT = DEVICE_HEIGHT * 0.1;
const WAVE_POINTS = 150; // 막대 개수
const MAX_DB = 120; // 최대 decibel 값
const MIN_DB = 0; // 최소 decibel 값
const BAR_SPACING = 2; // 막대 사이 간격
const CIRCLE_PADDING = 8;
const LEFT_OFFSET = WAVE_HEIGHT; // 왼쪽으로 이동할 오프셋
const VERTICAL_PADDING = WAVE_HEIGHT / 8;

export const SoundMeter = () => {
  const { t } = useTranslation();
  const [decibels, setDecibels] = useState<number | null>(null);
  const [waveData, setWaveData] = useState<number[]>([]);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const sensorRef = React.useRef<SoundMeterSensor | null>(null);
  const waveDataRef = useRef<number[]>([]);

  useEffect(() => {
    const initSensor = async () => {
      // 권한 확인
      const sensor = new SoundMeterSensor();
      const hasPermission = await sensor.checkPermission();
      
      if (__DEV__) {
        console.log('SoundMeter permission check:', hasPermission);
      }
      
      if (!hasPermission) {
        if (__DEV__) {
          console.warn('SoundMeter: No microphone permission');
        }
        return;
      }
      
      sensorRef.current = sensor;
      
      const listener = (data: SoundMeterData) => {
        if (__DEV__) {
          console.log('SoundMeter data received:', data);
        }
        setDecibels(data.decibels);
        
        // Wave 데이터 업데이트
        // decibel 값을 0-1 범위로 정규화하고, amplitude도 함께 사용
        const normalizedDb = Math.max(0, Math.min(1, (data.decibels - MIN_DB) / (MAX_DB - MIN_DB)));
        const normalizedAmplitude = Math.max(0, Math.min(1, data.amplitude || 0));
        
        // decibel과 amplitude를 결합하여 막대 높이 결정
        const barHeight = (normalizedDb * 0.8 + normalizedAmplitude * 0.2);
        
        // 새로운 데이터를 배열 끝(오른쪽)에 추가하고 최대 개수 유지
        // 기존 데이터는 왼쪽으로 이동
        waveDataRef.current = [...waveDataRef.current, barHeight].slice(-WAVE_POINTS);
        setWaveData([...waveDataRef.current]);
      };

      sensorRef.current.addListener(listener);
      
      if (__DEV__) {
        console.log('Starting SoundMeter sensor...');
      }
      sensorRef.current.startListening();
    };

    initSensor();

    return () => {
      if (__DEV__) {
        console.log('Stopping SoundMeter sensor...');
      }
      sensorRef.current?.stopListening();
    };
  }, []);

  // 막대 너비 계산
  const barWidth = containerWidth > 0 ? (containerWidth - (WAVE_POINTS - 1) * BAR_SPACING) / WAVE_POINTS : 0;
  const centerY = WAVE_HEIGHT / 2;

  const handleLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };
  return (
    <View className="w-full bg-black overflow-hidden" style={{height: WAVE_HEIGHT,borderRadius: WAVE_HEIGHT / 2,borderWidth: 1,borderColor: COLOR['gray']}} onLayout={handleLayout}>
        {/* <Text 
          text={decibels !== null ? decibels.toFixed(1) : '--'} 
          type="number" 
          className="text-primary mr-2" 
        /> */}
        {/* <Text text={t('sensors.soundMeter.unit')} type="body2" className="text-gray-600" /> */}
      
      {/* Decibel Wave 시각화 - 수직 막대 */}
        {containerWidth > 0 && (
          <Svg width={containerWidth} height={WAVE_HEIGHT} style={{ alignSelf: 'center' }}>
            {/* 중심선 */}
            <Rect
              x={0}
              y={centerY}
              width={containerWidth}
              height={1}
              fill={COLOR['gray']}
            />
            <Rect
              x={0}
              y={centerY+centerY/2+centerY/8}
              width={containerWidth}
              height={1}
              fill={COLOR['gray-900']}
            />
            <Rect
              x={0}
              y={centerY-centerY/2-centerY/8}
              width={containerWidth}
              height={1}
              fill={COLOR['gray-900']}
            />
            
            {/* 수직 막대들 - 오른쪽에서 왼쪽으로 (오른쪽이 최신, 기준선에서 생성) */}
            {waveData.map((height, index) => {
              const barHeight = height * (WAVE_HEIGHT * 0.9); // 최대 높이의 90%
              // 오른쪽 끝(기준선)에서 왼쪽으로 계산
              // 가장 최신 데이터(배열의 마지막)가 기준선 바로 왼쪽에 위치
              // 기준선 위치: waveWidth - barWidth - LEFT_OFFSET
              // 가장 최신 막대(index = waveData.length - 1)의 오른쪽 가장자리가 기준선 위치에 오도록
              // x = 기준선 위치 - barWidth - (오래된 막대 개수) * (barWidth + BAR_SPACING)
              const distanceFromEnd = waveData.length - index - 1; // 기준선에서 떨어진 거리
              const x = containerWidth - barWidth - LEFT_OFFSET - distanceFromEnd * (barWidth + BAR_SPACING) - barWidth;
              const y = centerY - barHeight / 2;
              
              // 데시벨 값에 따라 색상 변경 (높을수록 밝게)
              const intensity = Math.min(255, 100 + height * 155);
              const barColor = `rgb(${intensity}, ${intensity}, ${intensity})`;
              
              return (
                <Rect
                  key={index}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={barColor}
                  rx={barWidth / 4}
                />
              );
            })}
            
            {/* 기준선 (Playhead) - 오른쪽 끝에 고정, 막대의 오른쪽 가장자리에 위치 */}
            <Rect
              x={containerWidth - barWidth - LEFT_OFFSET - 1}
              y={VERTICAL_PADDING}
              width={2}
              height={WAVE_HEIGHT-VERTICAL_PADDING*2}
              fill={COLOR['red']}
            />
            {/* 기준선 상단 원형 마커 */}
            <Circle
              cx={containerWidth - barWidth - LEFT_OFFSET}
              cy={VERTICAL_PADDING}
              r={6}
              fill={COLOR['red']}
            />
            
          </Svg>
        )}
        
        {/* 좌측 원 */}
        <BlurView
          style={{
            position: 'absolute',
            left: CIRCLE_PADDING,
            top: CIRCLE_PADDING,
            width: WAVE_HEIGHT - CIRCLE_PADDING * 2,
            height: WAVE_HEIGHT - CIRCLE_PADDING * 2,
            overflow: 'hidden',            
          }}
          borderRadius={(WAVE_HEIGHT - CIRCLE_PADDING * 2) / 2}
          blurType="dark"
          blurAmount={8}
        />
        
        {/* 우측 원 */}
        <BlurView
          style={{
            position: 'absolute',
            right: CIRCLE_PADDING,
            top: CIRCLE_PADDING,
            width: WAVE_HEIGHT - CIRCLE_PADDING * 2,
            height: WAVE_HEIGHT - CIRCLE_PADDING * 2,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          borderRadius={(WAVE_HEIGHT - CIRCLE_PADDING * 2) / 2}
          blurType="dark"
          blurAmount={8}
        >
          <View className="items-center justify-center">
          <Text className="text-gray-200" style={{fontSize: WAVE_HEIGHT / 4}}>{decibels !== null ? decibels.toFixed(1) : '--'}</Text>
          <Text className="text-gray-500" style={{fontSize: WAVE_HEIGHT / 10}}>{t('sensors.soundMeter.unit')}</Text>
          </View>
        </BlurView>
    </View>
  );
};

