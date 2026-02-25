import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Button from "@/components/Button";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import ScreenWrapper from "@/components/ScreenWrapper";
import { verticalScale } from "@/utils/styling";
import { useAuth } from "@/contexts/authContext";
import * as Icon from "phosphor-react-native";
import HomeCard from "@/components/HomeCard";
import TransactionList from "@/components/TransactionList";
import { useRouter } from "expo-router";
import { limit, orderBy, where } from "firebase/firestore";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType } from "@/types";

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();

  const constraints = [
    where("uid", "==", user?.uid),
    orderBy("date", "desc"),
    limit(30),
  ];

  const {
    data: recentTransactions,
    loading: transactionLoading,
    error,
  } = useFetchData<TransactionType>("transactions", constraints);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ gap: 4, paddingTop: 10 }}>
            <Typo size={16} color={colors.neutral300}>
              Hello,{" "}
              <Typo size={18} color={colors.primary} fontWeight={500}>
                {user?.name}
              </Typo>
            </Typo>
          </View>
          <TouchableOpacity
            style={styles.searchIcon}
            onPress={() => router.push("/(modals)/searchModal")}
          >
            <Icon.MagnifyingGlassIcon
              size={verticalScale(22)}
              color={colors.neutral200}
              weight="bold"
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <HomeCard />
          </View>
          <TransactionList
            data={recentTransactions}
            loading={transactionLoading}
            emptyListMessage="no transaction to show"
            title="Recent Transactions"
          />
        </ScrollView>
        <Button
          style={styles.floatingButton}
          onPress={() => router.push("/(modals)/transactionModal")}
        >
          <Icon.PlusIcon color="black" weight="bold" size={verticalScale(24)} />
        </Button>
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
    marginBottom: 5,
  },
  searchIcon: {
    padding: spacingX._10,
    backgroundColor: colors.neutral800,
    borderRadius: 50,
  },
  scrollContainer: {
    gap: spacingY._20,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  },
});
