import React, { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import { Text } from '@component/Text';
import { GravitySensor, GravityData } from '@lib/sensors/SensorModule';

export const Gravity = () => {
  const [gravityData, setGravityData] = useState<GravityData | null>(null);
  const sensorRef = useRef<GravitySensor | null>(null);

  useEffect(() => {
    sensorRef.current = new GravitySensor();
    
    const listener = (data: GravityData) => {
      setGravityData(data);
    };

    sensorRef.current.addListener(listener);
    sensorRef.current.startListening();

    return () => {
      sensorRef.current?.stopListening();
    };
  }, []);

  return (
    <View className="p-4 bg-white rounded-lg mb-4">
      <Text text="Gravity Sensor" type="title4" className="mb-2" />
      <View className="space-y-1">
        <View className="flex-row justify-between items-baseline">
          <Text text="크기 (Magnitude)" type="body3" className="text-gray-600" />
          <View className="flex-row items-baseline">
            <Text 
              text={gravityData ? gravityData.magnitude.toFixed(2) : '--'} 
              type="number" 
              className="text-primary mr-2" 
            />
            <Text text="m/s²" type="body2" className="text-gray-600" />
          </View>
        </View>
        <View className="flex-row justify-between">
          <Text text="X" type="body3" className="text-gray-600" />
          <Text 
            text={gravityData ? `${gravityData.x.toFixed(2)} m/s²` : '--'} 
            type="body2" 
            className="font-semibold" 
          />
        </View>
        <View className="flex-row justify-between">
          <Text text="Y" type="body3" className="text-gray-600" />
          <Text 
            text={gravityData ? `${gravityData.y.toFixed(2)} m/s²` : '--'} 
            type="body2" 
            className="font-semibold" 
          />
        </View>
        <View className="flex-row justify-between">
          <Text text="Z" type="body3" className="text-gray-600" />
          <Text 
            text={gravityData ? `${gravityData.z.toFixed(2)} m/s²` : '--'} 
            type="body2" 
            className="font-semibold" 
          />
        </View>
      </View>
    </View>
  );
};

