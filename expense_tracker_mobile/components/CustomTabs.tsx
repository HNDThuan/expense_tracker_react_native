import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors } from "@/constants/theme";
import {
  HouseIcon,
  ChartBarIcon,
  WalletIcon,
  UserIcon,
} from "phosphor-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomTabs = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const inset = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(inset.bottom, 10),
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;

        const isFocused = state.index === index;

        const color = isFocused ? colors.primary : colors.text;
        const size = 20;
        const renderIcon = () => {
          switch (route.name) {
            case "index":
              return <HouseIcon size={size} color={color} weight="fill" />;
            case "statistics":
              return <ChartBarIcon size={size} color={color} weight="fill" />;
            case "wallet":
              return <WalletIcon size={size} color={color} weight="fill" />;
            case "profile":
              return <UserIcon size={size} color={color} weight="fill" />;
            default:
              return null;
          }
        };

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tab}
          >
            {renderIcon()}
            <Text style={{ color: isFocused ? colors.primary : colors.text }}>
              {String(label)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabs;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.neutral800,
  },
  tab: {
    flex: 1,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
});
