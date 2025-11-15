import React from "react";
import { Modal, TouchableWithoutFeedback, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@component/Text";
import { Bread } from "@shared/constant/breads";
import { BreadImage } from "@shared/component/BreadImage";
import { Button } from "@shared/component/Button";
export type FocusCompleteModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  selectedBread: Bread | null;
  gainedExperience?: number | null;
};

export const FocusCompleteModal = ({
  visible,
  onRequestClose,
  selectedBread,
  gainedExperience = null,
}: FocusCompleteModalProps) => {
  const { t } = useTranslation();
  const breadName = selectedBread ? t(`bread.${selectedBread.key}.name`) : null;
  const bakedMessage = breadName ? t("focusComplete.baked", { breadName }) : null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View className="bg-white rounded-xl w-full max-w-sm gap-y-6 p-6 items-center">
            {selectedBread ? (
                <>
              <Text text={bakedMessage ?? ""} type="title3" className="text-center text-gray-900" />
                <View className="w-2/3 aspect-square">
                  <BreadImage source={selectedBread.source} selected={false} />
                </View>
                {typeof gainedExperience === "number" ? (
                  <View className="px-4 py-2 rounded-full bg-primary/10">
                    <Text text={`+${gainedExperience} XP`} type="title4" className="text-primary font-semibold" />
                  </View>
                ) : null}
                </>
              ) : (
                <View className="items-center">
                  <Text text={t("focusComplete.noSelectedBread")} className="text-gray-600" />
                </View>
              )}
              <Button text={t("common.confirm")} onPress={onRequestClose} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

