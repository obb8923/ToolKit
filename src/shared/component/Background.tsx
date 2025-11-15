import { View, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type BackgroundProps = {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle | ViewStyle[];
  isStatusBarGap?: boolean;
  isNavigationBarGap?: boolean;
}
export const Background = ({children,isStatusBarGap=true,isNavigationBarGap=true,...props}: BackgroundProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View className={`flex-1 bg-background ${props.className}`} style={{paddingTop: isStatusBarGap ? insets.top : 0, paddingBottom: isNavigationBarGap ? insets.bottom : 0, ...props.style}}>
      {children}
    </View>    
  )
}
