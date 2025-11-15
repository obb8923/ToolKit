import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@shared/component/Button';
import { TimerMode } from '@store/timerStore';

export type TimerButtonProps = {
  labelKey: string;
  labelParams?: Record<string, unknown>;
  devOverrideKey?: string;
  onPress: () => void;
  mode?: TimerMode;
};

export const TimerButton = ({ labelKey, labelParams, devOverrideKey, onPress, mode }: TimerButtonProps) => {
  const { t } = useTranslation();

  const baseLabel = t(labelKey, labelParams);
  const displayLabel = baseLabel;
  const backgroundColor = mode === 'rest' ? '#38BDF8' : undefined;

  return <Button text={displayLabel} onPress={onPress} backgroundColor={backgroundColor} />;
};