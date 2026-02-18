import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors } from "@/constants/theme";
import {
  HouseIcon,
  ChartBarIcon,
  WalletIcon,
  UserIcon,
} from "phosphor-react-native";

const CustomTabs = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.container}>
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
    height: 70,
    backgroundColor: colors.neutral800,

    paddingBottom: 10,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
});
