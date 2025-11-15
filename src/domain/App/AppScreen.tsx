import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Background } from '@component/Background';
import { Text } from '@component/Text';
import { useTranslation } from 'react-i18next';

export const AppScreen = () => {
  const { t } = useTranslation();
  return (
    <Background>
     <View>
      <Text text="Hello" />
     </View>
    </Background>
  );
};