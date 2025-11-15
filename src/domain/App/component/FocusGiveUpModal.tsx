import React from "react";
import { Modal, TouchableWithoutFeedback, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@component/Text";
import { Bread } from "@shared/constant/breads";
import { BreadImage } from "@shared/component/BreadImage";
import { Button } from "@shared/component/Button";

const BURNT_BREAD_SOURCE = require('@assets/webps/BurntBread.webp');

export type FocusGiveUpModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  selectedBread: Bread | null;
};

export const FocusGiveUpModal = ({
  visible,
  onRequestClose,
  selectedBread,
}: FocusGiveUpModalProps) => {
  const { t } = useTranslation();
  const breadName = selectedBread ? t(`bread.${selectedBread.key}.name`) : null;
  const burnedMessage = breadName ? t("focusGiveUp.burned", { breadName }) : null;

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
                  <Text text={burnedMessage ?? ""} type="title3" className="text-center text-gray-900" />
                  <View className="w-2/3 aspect-square">
                    <BreadImage source={BURNT_BREAD_SOURCE} selected={false} />
                  </View>
                </>
              ) : (
                <View className="items-center">
                  <Text text={t("focusGiveUp.noSelectedBread")} className="text-gray-600" />
                </View>
              )}
              <Button text={t("common.close")} onPress={onRequestClose} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};


