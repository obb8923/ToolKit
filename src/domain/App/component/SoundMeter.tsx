import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from '@component/Text';
import { SoundMeterSensor, SoundMeterData } from '@lib/sensors/SensorModule';
import { useTranslation } from 'react-i18next';

export const SoundMeter = () => {
  const { t } = useTranslation();
  const [decibels, setDecibels] = useState<number | null>(null);
  const sensorRef = React.useRef<SoundMeterSensor | null>(null);

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

  return (
    <View className="p-4 bg-white rounded-lg mb-4">
      <Text text={t('sensors.soundMeter.title')} type="title4" className="mb-2" />
      <View className="flex-row items-baseline">
        <Text 
          text={decibels !== null ? decibels.toFixed(1) : '--'} 
          type="number" 
          className="text-primary mr-2" 
        />
        <Text text={t('sensors.soundMeter.unit')} type="body2" className="text-gray-600" />
      </View>
    </View>
  );
};

