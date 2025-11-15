import { useEffect, useMemo, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Svg, { Path, Line } from 'react-native-svg';
import Animated, { Easing, useAnimatedProps, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { TimerButton } from "@/domain/AppMain/component/Timer/TimerButton";
import { TimeInputModal } from "@/domain/AppMain/component/Timer/TimeInputModal";
import {
  useGetTimerLastSessionSeconds,
  useGetTimerSecondsLeft,
  useGetTimerStatus,
  useGetTimerMode,
  useSetTimerInitialSeconds,
  useSetRestInitialSeconds,
  useSetTimerReset,
  useSetTimerStart,
  useSetTimerComplete,
  useSetTransitionToRest,
  useSetSkipRest,
} from "@store/timerStore";
import { Text } from "@component/Text";
import { useTranslation } from "react-i18next";

const AnimatedPath = Animated.createAnimatedComponent(Path);

// 개발 모드에서 버튼 기능 제어
// true: 완료 기능 (completeTimer) 실행
// false: 포기 기능 (handleCancelOrGiveUp) 실행
const DEV_USE_COMPLETE = true;

export type TimerProps = {
  onFinished?: (durationSeconds: number) => void;
  onCancelOrGiveUp?: () => void;
  enableTimeInput?: boolean;
  onRequestTimeInput?: () => void;
  startDisabled?: boolean;
  showActionButton?: boolean;
  disableAutoTransitionToRest?: boolean;
};

export const Timer = ({
  onFinished,
  onCancelOrGiveUp,
  enableTimeInput = true,
  onRequestTimeInput,
  startDisabled = false,
  showActionButton = true,
  disableAutoTransitionToRest = false,
}: TimerProps) => {
    const dashOffset = useSharedValue(0);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [minutesInput, setMinutesInput] = useState<string>('25');
    const [secondsInput, setSecondsInput] = useState<string>('00');

    const secondsLeft = useGetTimerSecondsLeft();
    const status = useGetTimerStatus();
    const mode = useGetTimerMode();
    const setInitialSeconds = useSetTimerInitialSeconds();
    const setRestInitialSeconds = useSetRestInitialSeconds();
    const startTimer = useSetTimerStart();
    const lastSessionSeconds = useGetTimerLastSessionSeconds();
    const resetTimer = useSetTimerReset();
    const completeTimer = useSetTimerComplete();
    const transitionToRest = useSetTransitionToRest();
    const skipRest = useSetSkipRest();
    const { t } = useTranslation();
    const [cancelSecondsLeft, setCancelSecondsLeft] = useState<number | null>(null);
    const prevStatusRef = useRef(status);
    useEffect(() => {
      if (status === 'running' || status === 'resting') {
        dashOffset.value = withRepeat(
          withTiming(19, { duration: 1000, easing: Easing.linear }),
          -1,
          false
        );
      } else {
        dashOffset.value = withTiming(0, { duration: 150, easing: Easing.linear });
      }
    }, [dashOffset, status]);

    const animatedProps = useAnimatedProps(() => ({
      strokeDashoffset: dashOffset.value,
    }));

    const minutesLeft = Math.floor(secondsLeft / 60);
    const secondsLeftRemainder = secondsLeft % 60;
    const timeLabel = `${String(minutesLeft).padStart(2, '0')}:${String(secondsLeftRemainder).padStart(2, '0')}`;

    const handleConfirmTime = (m: string, s: string) => {
      setMinutesInput(m);
      setSecondsInput(s);
      const mm = Math.max(0, Math.floor(Number(m.replace(/[^0-9]/g, '')) || 0));
      let ss = Math.max(0, Math.floor(Number(s.replace(/[^0-9]/g, '')) || 0));
      if (ss > 59) ss = 59;
      if (mode === "focus") {
        setInitialSeconds(mm * 60 + ss);
      } else {
        setRestInitialSeconds(mm * 60 + ss);
      }
    };

    // 컨테이너 크기에 맞춘 호 경로 계산 (더 평평하게)
    const w = containerSize.width;
    const h = containerSize.height;
    const effectiveH = Math.max(h, 0);
    const margin = 0 ;
    const y = effectiveH * 0.8; // 아래로 조금 내림 → 더 평평해 보임
    const rx = (w - margin * 2) * 0.6; // 가로 반지름 크게
    const ry = effectiveH * 0.8; // 세로 반지름 작게 → 평평
    const arcPath = w > 0 && effectiveH > 0 ? `M ${margin} ${y} A ${rx} ${ry} 0 0 1 ${w - margin} ${y}` : 'M 0 0';
  
    const handleStart = () => {
      if (startDisabled) return;
      if (status === 'running' || status === 'resting') return;
      startTimer();
      setCancelSecondsLeft(5);
    };

    useEffect(() => {
      if (status !== 'running' && status !== 'resting') {
        setCancelSecondsLeft(null);
      }
    }, [status]);

    useEffect(() => {
      if (status !== 'running' && status !== 'resting') return;
      if (cancelSecondsLeft == null) return;
      if (cancelSecondsLeft <= 0) {
        setCancelSecondsLeft(null);
        return;
      }
      const timeoutId = setTimeout(() => {
        setCancelSecondsLeft((prev) => (prev == null ? prev : prev - 1));
      }, 1000);
      return () => clearTimeout(timeoutId);
    }, [status, cancelSecondsLeft]);

    useEffect(() => {
      if (prevStatusRef.current !== 'finished' && status === 'finished') {
        if (mode === 'focus') {
          onFinished?.(lastSessionSeconds);
          if (!disableAutoTransitionToRest) {
            transitionToRest();
          }
        } else {
          // 휴식 완료 시 집중 모드로 복귀
          skipRest();
        }
      }
      prevStatusRef.current = status;
    }, [status, mode, onFinished, lastSessionSeconds, transitionToRest, skipRest, disableAutoTransitionToRest]);

    const handleCancelOrGiveUp = () => {
      resetTimer();
      setCancelSecondsLeft(null);
      onCancelOrGiveUp?.();
    };

    const handleButtonPress = () => {
      if (status === 'running' || status === 'resting') {
        if (__DEV__ && cancelSecondsLeft == null && DEV_USE_COMPLETE) {
          completeTimer();
          return;
        }
        // 5초 안에 취소하면 기록 저장이나 모달 없이 바로 취소
        if (cancelSecondsLeft != null && cancelSecondsLeft > 0) {
          resetTimer();
          setCancelSecondsLeft(null);
          return;
        }
        handleCancelOrGiveUp();
        return;
      }
      handleStart();
    };

    const handleTimeLabelPress = () => {
      if (!enableTimeInput) return;
      if (status === 'running' || status === 'resting') return;
      if (onRequestTimeInput) {
        onRequestTimeInput();
        return;
      }
      setIsModalVisible(true);
    };

    useEffect(() => {
      if (!enableTimeInput && isModalVisible) {
        setIsModalVisible(false);
      }
    }, [enableTimeInput, isModalVisible]);

    const buttonLabelConfig = useMemo(() => {
      if (status === 'running' || status === 'resting') {
        if (cancelSecondsLeft != null && cancelSecondsLeft > 0) {
          return {
            labelKey: 'timer.cancelCountdown',
            labelParams: { seconds: cancelSecondsLeft },
          };
        }
        if (status === 'resting') {
          return {
            labelKey: 'timer.stopRest',
            devOverrideKey: 'timer.devComplete',
          };
        }
        return {
          labelKey: 'timer.giveUp',
          devOverrideKey: 'timer.devComplete',
        };
      }
      if (mode === 'rest') {
        return {
          labelKey: 'timer.startRest',
        };
      }
      return {
        labelKey: 'timer.start',
      };
    }, [status, mode, cancelSecondsLeft]);

    return (
      <View className="w-full items-center justify-center my-4">
        <View
          className="w-full"
          style={{ aspectRatio: 7 }}
          onLayout={({ nativeEvent }) => setContainerSize(nativeEvent.layout)}
        >
          {w > 0 && h > 0 && (
            <Svg width={w} height={h}>
              <AnimatedPath
                animatedProps={animatedProps}
                d={arcPath}
                stroke="black"
                strokeWidth={20}
                strokeDasharray={[1, 18]}
                strokeLinecap="butt"
                fill="none"
              />
              <Line
                x1={w / 2}
                y1={h * 0.15}
                x2={w / 2}
                y2={h * 0.75}
                stroke={mode === 'rest' ? '#38BDF8' : '#0763F6'}
                strokeWidth={2}
                strokeLinecap="round"
              />
            </Svg>
          )}
        </View>
        <TouchableOpacity 
        className="w-full items-center justify-center mb-16 mt-10" 
        activeOpacity={0.85} 
        onPress={handleTimeLabelPress}
        disabled={status === 'running' || status === 'resting' || !enableTimeInput}
        >
          <Text text={timeLabel} type="number" className="text-gray-800" />
        </TouchableOpacity>

        <View 
          className="w-full items-center justify-center gap-2"
          style={{ opacity: showActionButton ? 1 : 0 }}
          pointerEvents={showActionButton ? 'auto' : 'none'}
        >
          <TimerButton
            labelKey={buttonLabelConfig.labelKey}
            labelParams={buttonLabelConfig.labelParams}
            devOverrideKey={buttonLabelConfig.devOverrideKey}
            onPress={handleButtonPress}
            mode={mode}
          />
          <TouchableOpacity
            onPress={() => skipRest()}
            className="px-4 py-2"
            style={{ opacity: mode === 'rest' && status === 'idle' ? 1 : 0 }}
            disabled={mode !== 'rest' || status !== 'idle'}
          >
            <Text text={t('timer.skipRest')} type="body2" className="text-gray-500" />
          </TouchableOpacity>
        </View>
        {enableTimeInput ? (
          <TimeInputModal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            initialMinutes={minutesInput}
            initialSeconds={secondsInput}
            onConfirm={handleConfirmTime}
            mode={mode}
          />
        ) : null}
      </View>
    );
  };