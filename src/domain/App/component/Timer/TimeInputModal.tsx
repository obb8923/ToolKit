import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { View, TouchableOpacity, Modal, TouchableWithoutFeedback, LayoutChangeEvent, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Portal } from '@gorhom/portal';
import { Text } from '@component/Text';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import LinearGradient from 'react-native-linear-gradient';
import { TimerMode } from '@store/timerStore';

export type TimeInputModalProps = {
  visible: boolean;
  onClose: () => void;
  initialMinutes: string;
  initialSeconds: string;
  onConfirm: (minutes: string, seconds: string) => void;
  isOnboarding?: boolean;
  mode?: TimerMode;
};

export const TimeInputModal = ({
  visible,
  onClose,
  initialMinutes,
  initialSeconds: _initialSeconds,
  onConfirm,
  isOnboarding = false,
  mode = 'focus',
}: TimeInputModalProps) => {
  const { t } = useTranslation();
  const MIN_MINUTE_FOCUS = 20;
  const MAX_MINUTE_FOCUS = 120;
  const MIN_MINUTE_REST = 5;
  const MAX_MINUTE_REST = 60;

  const MIN_MINUTE = mode === 'rest' ? MIN_MINUTE_REST : MIN_MINUTE_FOCUS;
  const MAX_MINUTE = mode === 'rest' ? MAX_MINUTE_REST : MAX_MINUTE_FOCUS;
  const STEP = 5; // 분 단위 간격
  const DEVICE_HEIGHT = Dimensions.get('window').height;
  const ITEM_HEIGHT = 60; // 리스트 아이템 높이
  const minuteOptions = useMemo(
    () =>
      Array.from({ length: Math.floor((MAX_MINUTE - MIN_MINUTE) / STEP) + 1 }).map(
        (_, index) => MIN_MINUTE + index * STEP
      ),
    [MIN_MINUTE, MAX_MINUTE, STEP]
  );

  // 초기 분 값으로부터 인덱스를 찾는 함수
  const getInitialIndex = useCallback(
    (minutes: string) => {
      const parsedMinute = Math.max(MIN_MINUTE, Math.min(Number(minutes) || MIN_MINUTE, MAX_MINUTE));
      const adjustedMinute =
        Math.round((parsedMinute - MIN_MINUTE) / STEP) * STEP + MIN_MINUTE;
      const foundIndex = minuteOptions.findIndex((value) => value === adjustedMinute);
      return foundIndex >= 0 ? foundIndex : 0;
    },
    [minuteOptions, MIN_MINUTE, MAX_MINUTE, STEP]
  );

  const [selectedIndex, setSelectedIndex] = useState<number>(() => getInitialIndex(initialMinutes));

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
  };

  const handleConfirm = useCallback(() => {
    if (isOnboarding) {
      // 온보딩 모드에서는 항상 3초로 설정
      onConfirm('0', '03');
    } else {
      const selectedMinutes = minuteOptions[selectedIndex] ?? MIN_MINUTE;
      onConfirm(selectedMinutes.toString(), '00');
    }
    onClose();
  }, [isOnboarding, minuteOptions, selectedIndex, MIN_MINUTE, onConfirm, onClose]);

  const renderList = () => (
      <View
        className="w-full relative items-center justify-center"
        style={{ height: DEVICE_HEIGHT * 0.4, width: '100%' }}
      >
        <FlashList
          data={minuteOptions}
          style={{ width: '100%', height: '100%' }}
          getItemType={() => 'minute'}
          renderItem={({ item, index }) => {
            const isSelected = index === selectedIndex;
            return (
              <TouchableOpacity 
              className="my-2 w-full" 
              onPress={() => handleSelect(index)} 
              activeOpacity={0.85}>
                <View
                    className={`flex-1 justify-center items-center p-2 ${
                    isSelected
                      ? 'bg-gray-200'
                      : 'transparent'
                  }`}
                  >
                    <Text
                      text={t('modals.timeInput.minuteOption', { value: item })}
                      className={`font-semibold ${
                        isSelected ? 'text-gray-800' : 'text-gray-400'
                      }`}
                    />
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
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={onClose}>
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
                <Text 
                  text={mode === 'rest' ? t('modals.timeInput.restTitle') : t('modals.timeInput.title')} 
                  type="title4" 
                  className="text-center text-blue-ribbon-50" 
                />
                </View>
              <View className="bg-white w-full overflow-hidden" style={{ borderRadius: 24 }}>
                {isOnboarding ? (
                  <View className="py-8 items-center gap-y-4">
                    <TouchableOpacity className="py-1 w-full" onPress={() => {}} activeOpacity={0.85}>
                      <View style={{ height: ITEM_HEIGHT }}>
                        <View className="flex-1 justify-center items-center bg-gray-200">
                          <Text
                            text={t('modals.timeInput.onboarding.secondsLabel')}
                            className="font-semibold text-gray-800"
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  renderList()
                )}
                  <View className="border-t border-gray-200"/>
                  <TouchableOpacity
                    onPress={handleConfirm}
                    className="px-4 py-3 items-center bg-white"
                  >
                    <Text 
                      text={t('common.confirm')} 
                      className="text-blue-ribbon-900 font-semibold" 
                    />
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

