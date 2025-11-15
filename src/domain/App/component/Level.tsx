import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from '@component/Text';
import { LevelSensor, LevelData } from '@lib/sensors/SensorModule';
import { useTranslation } from 'react-i18next';

export const Level = () => {
  const { t } = useTranslation();
  const [levelData, setLevelData] = useState<LevelData | null>(null);
  const sensorRef = React.useRef<LevelSensor | null>(null);

  useEffect(() => {
    sensorRef.current = new LevelSensor();
    
    const listener = (data: LevelData) => {
      setLevelData(data);
    };

    sensorRef.current.addListener(listener);
    sensorRef.current.startListening();

    return () => {
      sensorRef.current?.stopListening();
    };
  }, []);

  return (
    <View className="p-4 bg-white rounded-lg mb-4">
      <Text text={t('sensors.level.title')} type="title4" className="mb-2" />
      <View className="space-y-1">
        <View className="flex-row justify-between">
          <Text text={t('sensors.level.pitch')} type="body3" className="text-gray-600" />
          <Text 
            text={levelData ? `${levelData.pitch.toFixed(1)}°` : '--'} 
            type="body2" 
            className="font-semibold" 
          />
        </View>
        <View className="flex-row justify-between">
          <Text text={t('sensors.level.roll')} type="body3" className="text-gray-600" />
          <Text 
            text={levelData ? `${levelData.roll.toFixed(1)}°` : '--'} 
            type="body2" 
            className="font-semibold" 
          />
        </View>
        <View className="flex-row justify-between">
          <Text text="X" type="body3" className="text-gray-600" />
          <Text 
            text={levelData ? levelData.x.toFixed(2) : '--'} 
            type="body2" 
            className="font-semibold" 
          />
        </View>
        <View className="flex-row justify-between">
          <Text text="Y" type="body3" className="text-gray-600" />
          <Text 
            text={levelData ? levelData.y.toFixed(2) : '--'} 
            type="body2" 
            className="font-semibold" 
          />
        </View>
        <View className="flex-row justify-between">
          <Text text="Z" type="body3" className="text-gray-600" />
          <Text 
            text={levelData ? levelData.z.toFixed(2) : '--'} 
            type="body2" 
            className="font-semibold" 
          />
        </View>
      </View>
    </View>
  );
};

