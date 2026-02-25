import {
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import * as Icon from "phosphor-react-native";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import { TransactionType } from "@/types";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { firestore } from "@/config/firebase";
import { Timestamp } from "firebase/firestore";
import { expenseCategories, incomeCategory } from "@/constants/data";
import Loading from "@/components/Loading";

const SearchModal = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [searchText, setSearchText] = useState("");
    const [allTransactions, setAllTransactions] = useState<TransactionType[]>([]);
    const [filtered, setFiltered] = useState<TransactionType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllTransactions();
    }, []);

    useEffect(() => {
        const q = searchText.trim().toLowerCase();
        if (!q) {
            setFiltered(allTransactions);
            return;
        }
        const results = allTransactions.filter((t) => {
            const category =
                t.type === "income"
                    ? incomeCategory.label
                    : expenseCategories[t.category!]?.label ?? "";
            const description = t.description?.toLowerCase() ?? "";
            const amount = t.amount.toString();
            return (
                category.toLowerCase().includes(q) ||
                description.includes(q) ||
                amount.includes(q)
            );
        });
        setFiltered(results);
    }, [searchText, allTransactions]);

    const fetchAllTransactions = async () => {
        try {
            const q = query(
                collection(firestore, "transactions"),
                where("uid", "==", user?.uid),
                orderBy("date", "desc"),
            );
            const snapshot = await getDocs(q);
            const txns: TransactionType[] = snapshot.docs.map((doc) => ({
                ...(doc.data() as TransactionType),
                id: doc.id,
            }));
            setAllTransactions(txns);
            setFiltered(txns);
        } catch (e) {
            console.log("search fetch error:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = (item: TransactionType) => {
        router.push({
            pathname: "/(modals)/transactionModal",
            params: {
                id: item?.id,
                type: item?.type,
                amount: item?.amount.toString(),
                category: item?.category,
                date: (item.date as Timestamp)?.toDate()?.toISOString(),
                description: item?.description,
                image: item?.image,
                uid: item?.uid,
                walletId: item?.walletId,
            },
        });
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Icon.ArrowLeftIcon
                            size={verticalScale(22)}
                            color={colors.white}
                            weight="bold"
                        />
                    </TouchableOpacity>
                    <Typo size={20} fontWeight={600}>
                        Search Transactions
                    </Typo>
                </View>

                {/* Search bar */}
                <Input
                    placeholder="Search by category, description or amount…"
                    value={searchText}
                    onChangeText={setSearchText}
                    autoFocus
                    icon={
                        <Icon.MagnifyingGlassIcon
                            size={verticalScale(20)}
                            color={colors.neutral400}
                            weight="bold"
                        />
                    }
                />

                {/* Results count */}
                {!loading && (
                    <Typo size={13} color={colors.neutral400}>
                        {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                    </Typo>
                )}

                {/* List */}
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Loading color={colors.white} />
                    </View>
                ) : (
                    <FlatList
                        data={filtered}
                        keyExtractor={(item) => item.id!}
                        renderItem={({ item }) => (
                            <SearchTransactionItem item={item} onPress={handleClick} />
                        )}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <Typo
                                size={15}
                                color={colors.neutral400}
                                style={{ textAlign: "center", marginTop: spacingY._20 }}
                            >
                                No transactions found
                            </Typo>
                        }
                    />
                )}
            </View>
        </ScreenWrapper>
    );
};

type ItemProps = { item: TransactionType; onPress: (t: TransactionType) => void };

const SearchTransactionItem = ({ item, onPress }: ItemProps) => {
    const category =
        item.type === "income"
            ? incomeCategory
            : expenseCategories[item.category!];
    const IconComponent = category?.icon;
    const date = (item.date as Timestamp)
        ?.toDate()
        ?.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

    return (
        <TouchableOpacity style={styles.row} onPress={() => onPress(item)}>
            <View style={[styles.icon, { backgroundColor: category?.bgColor }]}>
                {IconComponent && (
                    <IconComponent size={verticalScale(25)} weight="fill" color={colors.white} />
                )}
            </View>
            <View style={styles.categoryDes}>
                <Typo size={17}>{category?.label}</Typo>
                <Typo size={12} color={colors.neutral400} textProps={{ numberOfLines: 1 }}>
                    {item.description || "—"}
                </Typo>
            </View>
            <View style={styles.amountDate}>
                <Typo fontWeight={500} color={item.type === "income" ? colors.primary : colors.rose}>
                    {`${item.type === "income" ? "+" : "-"}${item.amount}$`}
                </Typo>
                <Typo size={13} color={colors.neutral400}>
                    {date}
                </Typo>
            </View>
        </TouchableOpacity>
    );
};

export default SearchModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingX._20,
        paddingTop: spacingY._10,
        gap: spacingY._15,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacingX._12,
    },
    backBtn: {
        padding: scale(6),
        borderRadius: 50,
        backgroundColor: colors.neutral800,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    listContent: {
        paddingBottom: verticalScale(100),
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: spacingX._12,
        marginBottom: spacingY._12,
        backgroundColor: colors.neutral800,
        padding: spacingY._10,
        paddingHorizontal: spacingX._10,
        borderRadius: radius._17,
    },
    icon: {
        height: verticalScale(44),
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: radius._12,
        borderCurve: "continuous",
    },
    categoryDes: {
        flex: 1,
        gap: 2.5,
    },
    amountDate: {
        alignItems: "flex-end",
        gap: 3,
    },
});
