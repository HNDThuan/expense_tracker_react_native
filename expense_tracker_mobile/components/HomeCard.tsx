import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ImageBackground } from "expo-image";
import { scale, verticalScale } from "@/utils/styling";
import { colors, spacingX, spacingY } from "@/constants/theme";
import Typo from "./Typo";
import * as Icon from "phosphor-react-native";
import { useAuth } from "@/contexts/authContext";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { orderBy, where } from "firebase/firestore";
const HomeCard = () => {
  const { user } = useAuth();
  const {
    data: wallets,
    loading: walletLoading,
    error,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const getTotals = () => {
    return wallets.reduce(
      (totals: any, item: WalletType) => {
        totals.balance = totals.balance + Number(item.amount);
        totals.income = totals.income + Number(item.totalIncome);
        totals.expenses = totals.expenses + Number(item.totalExpense);
        return totals;
      },
      { balance: 0, income: 0, expenses: 0 },
    );
  };
  return (
    <ImageBackground
      source={require("../assets/images/card.png")}
      contentFit="fill"
      style={styles.bgImage}
    >
      <View style={styles.container}>
        <View>
          <View style={styles.totalBlanceRow}>
            <Typo size={17} color={colors.neutral800} fontWeight={500}>
              Total Balance
            </Typo>
            <Icon.DotsThreeOutlineIcon
              size={24}
              color={colors.black}
              weight="fill"
            />
          </View>
          <Typo size={30} color={colors.black} fontWeight="bold">
            ${getTotals()?.balance?.toFixed(2)}
          </Typo>
        </View>

        {/*total expense and income */}
        <View style={styles.stats}>
          {/*income*/}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Icon.ArrowDownIcon
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>
              <Typo size={16} color={colors.neutral700} fontWeight={500}>
                Income
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo size={16} color={colors.green} fontWeight={600}>
                {getTotals()?.income?.toFixed(2)} $
              </Typo>
            </View>
          </View>

          {/*expense*/}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Icon.ArrowUpIcon
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>
              <Typo size={16} color={colors.neutral700} fontWeight={500}>
                Expense
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo size={16} color={colors.rose} fontWeight={600}>
                {getTotals()?.expenses?.toFixed(2)} $
              </Typo>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  bgImage: {
    width: "100%",
    height: scale(210),
  },
  container: {
    padding: spacingX._20,
    paddingHorizontal: scale(23),
    height: "87%",
    width: "100%",
    justifyContent: "space-between",
  },
  totalBlanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._5,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  incomeExpense: {
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
  },
  statsIcon: {
    backgroundColor: colors.neutral350,
    padding: spacingX._5,
    borderRadius: 50,
  },
});
