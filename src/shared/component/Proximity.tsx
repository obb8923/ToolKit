import React, { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import { Text } from '@component/Text';
import { ProximitySensor, ProximityData } from '@lib/sensors/SensorModule';

export const Proximity = () => {
  const [distance, setDistance] = useState<number | null>(null);
  const sensorRef = useRef<ProximitySensor | null>(null);

  useEffect(() => {
    sensorRef.current = new ProximitySensor();
    
    const listener = (data: ProximityData) => {
      setDistance(data.distance);
    };

    sensorRef.current.addListener(listener);
    sensorRef.current.startListening();

    return () => {
      sensorRef.current?.stopListening();
    };
  }, []);

  return (
    <View className="p-4 bg-white rounded-lg mb-4">
      <Text text="Proximity Sensor" type="title4" className="mb-2" />
      <View className="flex-row items-baseline">
        <Text 
          text={distance !== null ? distance.toFixed(2) : '--'} 
          type="number" 
          className="text-primary mr-2" 
        />
        <Text text="cm" type="body2" className="text-gray-600" />
      </View>
    </View>
  );
};

