import React, { useMemo } from "react";
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@component/Text";
import { useGetBakerExperience, useGetBakerLevel } from "@store/bakerStore";
import { Portal } from "@gorhom/portal";
import LinearGradient from "react-native-linear-gradient";
import { getExperienceToNextLevel } from "@constant/levels";
export type LevelStatusModalProps = {
  visible: boolean;
  onRequestClose: () => void;
};

export const LevelStatusModal = ({
  visible,
  onRequestClose,
}: LevelStatusModalProps) => {
  const { t } = useTranslation();
  const level = useGetBakerLevel();
  const experience = useGetBakerExperience();
  
  const experienceToNextLevel = useMemo(() => {
    return getExperienceToNextLevel(experience, level);
  }, [experience, level]);
  
  const formatExperienceToNextLevel = useMemo(() => {
    if (experienceToNextLevel === null) {
      return t('modals.levelStatus.maxLevel');
    }
    if (experienceToNextLevel === 0) {
      return t('modals.levelStatus.readyToLevelUp');
    }
    return t('modals.levelStatus.experienceToNextLevelValue', { value: experienceToNextLevel });
  }, [experienceToNextLevel, t]);
  return (
    <Portal>
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <TouchableWithoutFeedback onPress={(event) => event.stopPropagation()}>
          
            <LinearGradient 
                          style={{
                            width: '100%',
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
              </View>
            <View className="bg-white w-full overflow-hidden" style={{ borderRadius: 24 }}>

            <View className="bg-white rounded-xl w-full max-w-sm gap-y-5 py-6 items-center">
              <View className="w-full flex-row items-center justify-between px-6">
                <Text text={t('modals.levelStatus.levelLabel')} type="title4" className="text-gray-900" />
                <Text text={t('common.levelShort', { level })} type="title4" className="text-blue-ribbon-900" />
              </View>
              <View className="w-full flex-row items-center justify-between px-6">
              <Text text={t('modals.levelStatus.totalExperienceLabel')} className="text-gray-700" />
              <Text text={t('modals.levelStatus.totalExperienceValue', { value: experience })} className="text-gray-700" />
              </View>
              
              <View className="w-full flex-row items-center justify-between px-6">
                <Text text={t('modals.levelStatus.experienceToNextLevelLabel')} className="text-gray-700" />
                <Text text={formatExperienceToNextLevel} className="text-blue-ribbon-900 font-semibold" />
              </View>

              <View className="w-full border-t border-gray-200"/>
                <TouchableOpacity
                  onPress={onRequestClose}
                  className="items-center bg-white w-full"
                >
                  <Text text={t('common.confirm')} className="text-blue-ribbon-900 font-semibold" />
                </TouchableOpacity>
            </View>

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


