import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from '@component/Text';
import { BarometerSensor, BarometerData } from '@lib/sensors/SensorModule';
import { useTranslation } from 'react-i18next';

export const Barometer = () => {
  const { t } = useTranslation();
  const [pressure, setPressure] = useState<number | null>(null);
  const sensorRef = React.useRef<BarometerSensor | null>(null);

  useEffect(() => {
    sensorRef.current = new BarometerSensor();
    
    const listener = (data: BarometerData) => {
      setPressure(data.pressure);
    };

    sensorRef.current.addListener(listener);
    sensorRef.current.startListening();

    return () => {
      sensorRef.current?.stopListening();
    };
  }, []);

  return (
    <View className="p-4 bg-white rounded-lg mb-4">
      <Text text={t('sensors.barometer.title')} type="title4" className="mb-2" />
      <View className="flex-row items-baseline">
        <Text 
          text={pressure !== null ? pressure.toFixed(2) : '--'} 
          type="number" 
          className="text-primary mr-2" 
        />
        <Text text={t('sensors.barometer.unit')} type="body2" className="text-gray-600" />
      </View>
    </View>
  );
};

