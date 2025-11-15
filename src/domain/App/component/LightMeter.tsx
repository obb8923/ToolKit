import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from '@component/Text';
import { LightMeterSensor, LightMeterData } from '@lib/sensors/SensorModule';
import { useTranslation } from 'react-i18next';

export const LightMeter = () => {
  const { t } = useTranslation();
  const [lux, setLux] = useState<number | null>(null);
  const sensorRef = React.useRef<LightMeterSensor | null>(null);

  useEffect(() => {
    sensorRef.current = new LightMeterSensor();
    
    const listener = (data: LightMeterData) => {
      setLux(data.lux);
    };

    sensorRef.current.addListener(listener);
    sensorRef.current.startListening();

    return () => {
      sensorRef.current?.stopListening();
    };
  }, []);

  return (
    <View className="p-4 bg-white rounded-lg mb-4">
      <Text text={t('sensors.lightMeter.title')} type="title4" className="mb-2" />
      <View className="flex-row items-baseline">
        <Text 
          text={lux !== null ? lux.toFixed(0) : '--'} 
          type="number" 
          className="text-primary mr-2" 
        />
        <Text text={t('sensors.lightMeter.unit')} type="body2" className="text-gray-600" />
      </View>
    </View>
  );
};

