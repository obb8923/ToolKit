import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from '@component/Text';
import { CompassSensor, CompassData } from '@lib/sensors/SensorModule';
import { useTranslation } from 'react-i18next';

const getDirection = (azimuth: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(azimuth / 45) % 8;
  return directions[index];
};

export const Compass = () => {
  const { t } = useTranslation();
  const [azimuth, setAzimuth] = useState<number | null>(null);
  const sensorRef = React.useRef<CompassSensor | null>(null);

  useEffect(() => {
    sensorRef.current = new CompassSensor();
    
    const listener = (data: CompassData) => {
      setAzimuth(data.azimuth);
    };

    sensorRef.current.addListener(listener);
    sensorRef.current.startListening();

    return () => {
      sensorRef.current?.stopListening();
    };
  }, []);

  return (
    <View className="p-4 bg-white rounded-lg mb-4">
      <Text text={t('sensors.compass.title')} type="title4" className="mb-2" />
      <View className="flex-row items-baseline justify-between">
        <View className="flex-row items-baseline">
          <Text 
            text={azimuth !== null ? azimuth.toFixed(1) : '--'} 
            type="number" 
            className="text-primary mr-2" 
          />
          <Text text="°" type="body2" className="text-gray-600" />
        </View>
        {azimuth !== null && (
          <Text 
            text={getDirection(azimuth)} 
            type="title3" 
            className="text-primary font-bold" 
          />
        )}
      </View>
    </View>
  );
};

