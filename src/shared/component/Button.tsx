import { TouchableOpacity, View } from 'react-native';
import { Text } from '@component/Text';

export type ButtonProps = {
  text: string;
  onPress: () => void;
  backgroundColor?: string;
};

export const Button = ({ text, onPress, backgroundColor }: ButtonProps) => {
  return (
    <TouchableOpacity
    onPress={onPress}
    className={`px-4 h-[37] items-center justify-center rounded-full relative ${backgroundColor ? '' : 'bg-primary'}`}
    style={backgroundColor ? { backgroundColor } : undefined}
  >
    <View
      className="absolute top-0 left-0 right-0 bottom-0 rounded-full"
      style={{
        boxShadow: [
          {
            inset: true,
            offsetX: 0,
            offsetY: 0,
            blurRadius: 7.5,
            spreadDistance: 0,
            color: 'rgba(255, 255, 255, 0.7)',
          },
        ],
      }}
    />
    <View
      className="absolute top-0 left-0 right-0 bottom-0 rounded-full"
      style={{
        boxShadow: [
          {
            inset: true,
            offsetX: 0,
            offsetY: 0,
            blurRadius: 2.5,
            spreadDistance: 0,
            color: 'rgba(255, 255, 255, 0.7)',
          },
        ],
      }}
    />
    <Text text={text} className="text-white" type="body1" numberOfLines={1} />
  </TouchableOpacity>
  );
};