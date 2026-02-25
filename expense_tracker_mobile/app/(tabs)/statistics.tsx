import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Header from "@/components/Header";
import { scale, verticalScale } from "@/utils/styling";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { BarChart } from "react-native-gifted-charts";
import Loading from "@/components/Loading";
import { useAuth } from "@/contexts/authContext";
import { fetchMonthlyStats, fetchWeeklyStats, fetchYearlyStats } from "@/services/transactionService";
import TransactionList from "@/components/TransactionList";



const Statistics = () => {

  const [activeIndex, setActiveIndex] = useState(0)
  const { user } = useAuth()
  const [chartData, setChartData] = useState([])

  const [chartLoading, setChartLoading] = useState(false)
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    if (activeIndex == 0) {
      getWeeklyStats()
    }
    if (activeIndex == 1) {
      getMonthlyStats()
    }
    if (activeIndex == 2) {
      getYearlyStats()
    }
  }, [activeIndex])

  const getWeeklyStats = async () => {
    setChartLoading(true)
    let res = await fetchWeeklyStats(user?.uid as string);
    setChartLoading(false)
    if (res.success) {
      setChartData(res?.data?.stats)
      setTransactions(res?.data?.transactions)
    } else {
      Alert.alert("Error", res.msg)
    }
  }
  const getMonthlyStats = async () => {
    setChartLoading(true)
    let res = await fetchMonthlyStats(user?.uid as string);
    setChartLoading(false)
    if (res.success) {
      setChartData(res?.data?.stats)
      setTransactions(res?.data?.transactions)
    } else {
      Alert.alert("Error", res.msg)
    }
  }
  const getYearlyStats = async () => {
    setChartLoading(true)
    let res = await fetchYearlyStats(user?.uid as string);
    setChartLoading(false)
    if (res.success) {
      setChartData(res?.data?.stats)
      setTransactions(res?.data?.transactions)
    } else {
      Alert.alert("Error", res.msg)
    }
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Header title="Statistics" />
        </View>

        <ScrollView contentContainerStyle={{
          gap: spacingY._20,
          paddingTop: spacingY._5,
          paddingBottom: verticalScale(100)
        }} showsVerticalScrollIndicator={false}>
          <SegmentedControl
            values={['Weekly', 'Monthly', 'Yearly']}
            selectedIndex={activeIndex}
            onChange={(event) => {
              setActiveIndex(event.nativeEvent.selectedSegmentIndex)
            }}
            tintColor={colors.neutral200}
            backgroundColor={colors.neutral800}
            appearance="dark"
            activeFontStyle={styles.segmentFontStyle}
            style={styles.segmentStyle}
            fontStyle={{ ...styles.segmentFontStyle, color: colors.white }}
          />
          <View style={styles.chartContainer}>
            {
              chartData.length > 0 ? (
                <BarChart
                  data={chartData}
                  barWidth={scale(12)}
                  spacing={[1, 2].includes(activeIndex) ? scale(25) : scale(16)}
                  roundedTop
                  roundedBottom
                  hideRules
                  yAxisLabelPrefix="$"
                  yAxisLabelWidth={[1, 2].includes(activeIndex) ? scale(35) : scale(38)}

                  yAxisThickness={0}
                  xAxisThickness={0}
                  yAxisTextStyle={{ color: colors.neutral300 }}
                  xAxisLabelTextStyle={{ color: colors.neutral350, fontSize: verticalScale(9) }}
                  noOfSections={3}
                  minHeight={5}
                />
              ) : (
                <View style={styles.noChart} />
              )
            }

            {chartLoading && (
              <View style={styles.chartLoadingContainer}>
                <Loading color={colors.white} />
              </View>
            )}
          </View>

          <View>
            <TransactionList title="Transactions" emptyListMessage="No transactions found" data={transactions} />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  chartContainer: {
    position: "relative",
    justifyContent: 'center',
    alignItems: "center"
  },
  container: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._5,
    gap: spacingY._10
  },
  header: {

  },
  noChart: {
    backgroundColor: "black",
    height: verticalScale(210)
  },
  segmentStyle: {
    height: scale(37)
  },
  segmentFontStyle: {
    fontSize: verticalScale(13),
    fontWeight: "bold",
    color: colors.black
  },
  chartLoadingContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: radius._12,
    backgroundColor: "rgba(0,0,0,0.6)"
  }
});
