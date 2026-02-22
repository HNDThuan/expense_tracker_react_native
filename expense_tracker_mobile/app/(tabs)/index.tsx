import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Button from "@/components/Button";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import ScreenWrapper from "@/components/ScreenWrapper";
import { verticalScale } from "@/utils/styling";
import { useAuth } from "@/contexts/authContext";
import * as Icon from "phosphor-react-native"
import HomeCard from "@/components/HomeCard";
import TransactionList from "@/components/TransactionList";

const Home = () => {
  const { user } = useAuth()
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <Typo size={16} color={colors.neutral300}>Hello,</Typo>
            <Typo size={18} color={colors.primary} fontWeight={500}>{user?.name}</Typo>
          </View>
          <TouchableOpacity style={styles.searchIcon}>
            <Icon.MagnifyingGlassIcon size={verticalScale(22)} color={colors.neutral200} weight="bold" />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View>
            <HomeCard />
          </View>
          <TransactionList />
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchIcon: {
    padding: spacingX._10,
    backgroundColor: colors.neutral800,
    borderRadius: 50
  },
  scrollContainer: {
    gap: spacingY._20,
  }
});
