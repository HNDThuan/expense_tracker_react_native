import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import Typo from "./Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { WalletType } from "@/types";
import { verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import { Router } from "expo-router";
import { Image } from "expo-image";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  item: WalletType;
  index: number;
  router: Router;
};

const WalletListItem = ({ item, index, router }: Props) => {
  const openWallet = () => {
    router.push({
      pathname: "/(modals)/walletModal",
      params: {
        id: item?.id,
        name: item?.name,
        image: item?.image,
      },
    });
  };
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50)
        .springify()
        .damping(13)}
    >
      <TouchableOpacity style={styles.container} onPress={openWallet}>
        {/* Left Icon */}
        <View style={styles.iconBox}>
          <Image
            source={item?.image}
            style={{ flex: 1 }}
            contentFit="cover"
            transition={100}
          />
        </View>

        {/* Wallet Info */}
        <View style={styles.info}>
          <Typo size={16} fontWeight={500}>
            {item.name}
          </Typo>
        </View>

        {/* Balance */}
        <View>
          <Typo size={16} fontWeight={600}>
            {item.amount?.toFixed(2)} $
          </Typo>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default WalletListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    // backgroundColor: colors.neutral800,

    marginBottom: verticalScale(17),
  },
  iconBox: {
    width: verticalScale(60),
    height: verticalScale(60),
    borderRadius: radius._12,
    borderWidth: 1,
    borderColor: colors.neutral600,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  info: {
    marginLeft: spacingX._10,
    flex: 1,
  },
});
