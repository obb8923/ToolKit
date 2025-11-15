import React, { useEffect } from 'react';
import { ScrollView, PermissionsAndroid, Platform } from 'react-native';
import { Background } from '@component/Background';
import { Barometer } from './component/Barometer';
import { Level } from './component/Level';
import { LightMeter } from './component/LightMeter';
import { Compass } from './component/Compass';
import { SoundMeter } from './component/SoundMeter';

export const AppScreen = () => {
  useEffect(() => {
    // 앱 진입 시 마이크 권한 요청
    const requestMicrophonePermission = async () => {
      if (Platform.OS !== 'android') {
        return;
      }

      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: '마이크 권한',
            message: '소음측정기를 사용하기 위해 마이크 권한이 필요합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '취소',
            buttonPositive: '허용',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('마이크 권한이 허용되었습니다.');
        } else {
          console.log('마이크 권한이 거부되었습니다.');
        }
      } catch (err) {
        console.warn('권한 요청 중 오류:', err);
      }
    };

    requestMicrophonePermission();
  }, []);

  return (
    <Background>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {/* <Barometer /ㅌ> */}
        {/* <Level /> */}
        {/* <LightMeter /> */}
        <Compass />
        {/* <SoundMeter /> */}
      </ScrollView>
    </Background>
  );
};