import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from '@component/Text';
import { BarometerSensor, BarometerData } from '@lib/sensors/SensorModule';
import { COLOR } from '@constant/COLOR';
import { DEVICE_WIDTH,DEVICE_HEIGHT } from '@constant/NORMAL';
export const Barometer = () => {
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
    <View className="w-full bg-black rounded-lg mb-4"
    style={{height:DEVICE_HEIGHT /5,borderRadius:DEVICE_HEIGHT /4}}>
      <View className="flex-row items-baseline">
        <Text 
          text={pressure !== null ? pressure.toFixed(2) : '--'} 
          type="number" 
          className="text-primary mr-2"
         numberOfLines={1}
        />
        <Text text="hPa" type="body2" className="text-gray-600" />
      </View>
    </View>
  );
};

