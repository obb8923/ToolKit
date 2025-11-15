import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View, LayoutChangeEvent, Image, ImageSourcePropType, Dimensions } from 'react-native';
import { useTranslation } from "react-i18next";
import { Text } from '@component/Text';
import { BREADS } from '@constant/breads';
import { TimerStatus } from '@store/timerStore';
import { useGetBakerLevel, useGetSelectedBreadKey, useSetSelectedBread } from '@store/bakerStore';
import { Portal } from '@gorhom/portal';
import LinearGradient from 'react-native-linear-gradient';
import { FlashList, FlashListRef } from '@shopify/flash-list';

type OvenSettingsModalProps = {
  visible: boolean;
  status: TimerStatus;
  onStartPress: () => void;
  onRequestClose: () => void;
};

export const OvenSettingsModal = ({ visible, status: _status, onStartPress: _onStartPress, onRequestClose }: OvenSettingsModalProps) => {
  const level = useGetBakerLevel();
  const selectedBreadKey = useGetSelectedBreadKey();
  const setSelectedBread = useSetSelectedBread();
  const { t } = useTranslation();

  const DEVICE_HEIGHT = Dimensions.get('window').height;
  const getInitialIndex = useCallback(() => {
    const foundIndex = BREADS.findIndex((bread) => bread.key === selectedBreadKey);
    return foundIndex >= 0 ? foundIndex : 0;
  }, [selectedBreadKey]);

  const [selectedIndex, setSelectedIndex] = useState<number>(() => getInitialIndex());

  const handleSelect = (index: number) => {
    const bread = BREADS[index];
    if (bread && bread.level <= level) {
      setSelectedIndex(index);
    }
  };



  const renderList = () => (
    <View
      className="w-full relative items-center justify-center"
      style={{ height: DEVICE_HEIGHT * 0.4, width: '100%' }}
    >
      <FlashList
        data={BREADS}
        getItemType={() => 'bread'}
        style={{ width: '100%', height: '100%' }}
        renderItem={({ item, index }) => {
          const isSelected = index === selectedIndex;
          const isLocked = item.level > level;
          return (
            <TouchableOpacity
              className="my-2 w-full"
              onPress={() => handleSelect(index)}
              activeOpacity={0.85}
              disabled={isLocked}
            >
                <View
                  className={`flex-1 flex-row items-center p-2 ${
                    isSelected
                      ? 'bg-gray-200'
                      : 'transparent'
                  }`}
                >
                  {/* 왼쪽: 빵 이미지 */}
                  <View className="items-center justify-center" style={{ width: 48, height: 48 }}>
                    <Image
                      source={item.source as ImageSourcePropType}
                      style={{
                        width: 48,
                        height: 48,
                        opacity: isLocked ? 0.3 : 1,
                      }}
                      resizeMode="contain"
                    />
                    {isLocked && (
                      <View className="absolute inset-0 items-center justify-center bg-white/50 rounded">
                        <Text text={t("common.levelShort", { level: item.level })} type="caption1" className="text-center text-gray-800" />
                      </View>
                    )}
                  </View>
                  
                  {/* 오른쪽: 빵 이름 */}
                  <View className="flex-1 ml-3">
                    <Text
                      text={t(`bread.${item.key}.name`)}
                      className={`font-semibold ${
                        isSelected ? 'text-gray-800' : 'text-gray-400'
                      }`}
                    />
                  </View>
                </View>
            </TouchableOpacity>
          );
        }}
        showsVerticalScrollIndicator={false}
        
      />
    </View>
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onRequestClose}
      >
        <TouchableWithoutFeedback onPress={onRequestClose}>
          <View className="flex-1 bg-black/50 justify-center items-center px-8">
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              {/* 전체 컨테이너 */}
              <LinearGradient 
                style={{
                  width: '90%',
                  height: 'auto',
                  borderRadius: 28,
                  borderWidth: 1,
                  borderColor: '#0763f6',
                }}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                colors={['#0763f6', '#527dfe']}
              >
                <View className="p-2">
                  {/* 헤더 */}
                  <View className="w-full items-center justify-center mb-2 py-2 px-4 flex-row justify-between">
                    <Text text={t("oven.selectBreadTitle")} type="title4" className="text-center text-blue-ribbon-50" />
                  </View>
                  
                  <View className="bg-white w-full overflow-hidden" style={{ borderRadius: 24 }}>
                    {renderList()}
                    <View className="border-t border-gray-200"/>
                    <TouchableOpacity
                      onPress={onRequestClose}
                      className="px-4 py-3 items-center bg-white"
                    >
                      <Text text={t("common.confirm")} className="text-blue-ribbon-900 font-semibold" />
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Portal>
  );
};

