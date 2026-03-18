import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
import { PieChart } from "react-native-gifted-charts";
import { expenseCategories } from "@/constants/data";
import * as Icon from 'phosphor-react-native'



const Statistics = () => {

  const [activeIndex, setActiveIndex] = useState(0)
  const { user } = useAuth()
  const [chartData, setChartData] = useState<any[]>([])
  const [pieData, setPieData] = useState<any[]>([])
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar')

  const [chartLoading, setChartLoading] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])

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
      processPieData(res?.data?.transactions)
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
      processPieData(res?.data?.transactions)
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
      processPieData(res?.data?.transactions)
    } else {
      Alert.alert("Error", res.msg)
    }
  }

  const processPieData = (data: any[]) => {
    let categoryStats: any = {}
    data.forEach((item) => {
      if (item.type === 'expense') {
        if (categoryStats[item.category]) {
          categoryStats[item.category] += item.amount
        } else {
          categoryStats[item.category] = item.amount
        }
      }
    })

    const processedData = Object.keys(categoryStats).map((category) => {
      const categoryInfo = expenseCategories[category] || expenseCategories.others;
      return {
        value: categoryStats[category],
        color: categoryInfo.bgColor,
        text: categoryInfo.label,
        label: categoryInfo.label
      }
    })

    setPieData(processedData)
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

          {/* <TouchableOpacity onPress={() => setChartType(chartType === "bar" ? "pie" : "bar")} style={{ alignSelf: "flex-end" }}>
            {chartType === "bar" ? <Icon.ChartBarIcon /> : <Icon.ChartPieIcon />}
          </TouchableOpacity> */}

          <View style={styles.segmentContainer}>
            <TouchableOpacity
              onPress={() => setChartType("bar")}
              style={[
                styles.segmentItem,
                chartType === "bar" && styles.segmentActive,
              ]}
            >
              <Icon.ChartBarIcon size={20} weight="bold" color={chartType === "bar" ? colors.neutral900 : colors.white} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setChartType("pie")}
              style={[
                styles.segmentItem,
                chartType === "pie" && styles.segmentActive,
              ]}
            >

              <Icon.ChartPieIcon size={20} weight="bold" color={chartType === "pie" ? colors.neutral900 : colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.chartContainer}>
            {
              chartLoading ? (
                <View style={styles.noChart}>
                  <Loading color={colors.white} />
                </View>
              ) : chartType === 'bar' ? (
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
                  <View style={styles.noChart}>
                    <Typo color={colors.neutral400}>No data for bar chart</Typo>
                  </View>
                )
              ) : (
                pieData.length > 0 ? (
                  <View style={styles.pieChartWrapper}>
                    <PieChart
                      donut

                      sectionAutoFocus
                      radius={scale(80)}
                      innerRadius={scale(55)}
                      innerCircleColor={colors.neutral900}
                      data={pieData}
                    />
                    <View style={styles.pieDescription}>
                      {pieData.map((item, index) => (
                        <View key={index} style={styles.legendItem}>
                          <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                          <Typo size={12} color={colors.neutral300}>{item.label}</Typo>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : (
                  <View style={styles.noChart}>
                    <Typo color={colors.neutral400}>No data for pie chart</Typo>
                  </View>
                )
              )
            }
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
  segmentContainer: {
    flexDirection: "row",
    backgroundColor: colors.neutral800,
    borderRadius: 999,
    padding: 4,
    width: 100,
    height: 40,
    alignSelf: "flex-end"
  },

  segmentItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },

  segmentActive: {
    backgroundColor: colors.primary,
  },

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

  header: {},

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

  pieChartWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: spacingY._10
  },

  pieDescription: {
    gap: spacingY._5
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._10
  },

  legendColor: {
    width: scale(10),
    height: scale(10),
    borderRadius: 5
  }
});
