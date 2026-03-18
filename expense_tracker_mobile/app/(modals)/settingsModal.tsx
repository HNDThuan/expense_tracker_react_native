import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import {
    cancelAllReminders,
    getNotificationSettings,
    initializeNotifications,
    saveNotificationSettings,
    scheduleDailyReminder,
} from "@/services/notificationService";
import { NotificationSettingsType } from "@/types";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Switch, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const SettingsModal = () => {
    const [settings, setSettings] = useState<NotificationSettingsType>({
        enabled: true,
        hour: 21,
        minute: 0,
    });
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const saved = await getNotificationSettings();
        setSettings(saved);
        setLoading(false);
    };

    const handleToggle = async (value: boolean) => {
        const newSettings = { ...settings, enabled: value };
        setSettings(newSettings);
        await saveNotificationSettings(newSettings);

        if (value) {
            const granted = await initializeNotifications();
            if (granted) {
                await scheduleDailyReminder(newSettings.hour, newSettings.minute);
            }
        } else {
            await cancelAllReminders();
        }
    };

    const handleTimeChange = async (
        event: DateTimePickerEvent,
        selectedDate?: Date,
    ) => {
        if (Platform.OS === "android") {
            setShowTimePicker(false);
        }

        if (event.type === "dismissed") return;

        if (selectedDate) {
            const newHour = selectedDate.getHours();
            const newMinute = selectedDate.getMinutes();
            const newSettings = { ...settings, hour: newHour, minute: newMinute };
            setSettings(newSettings);
            await saveNotificationSettings(newSettings);

            if (newSettings.enabled) {
                await scheduleDailyReminder(newHour, newMinute);
            }
        }
    };

    const formatTime = (hour: number, minute: number): string => {
        const h = hour.toString().padStart(2, "0");
        const m = minute.toString().padStart(2, "0");
        return `${h}:${m}`;
    };

    const getTimeDate = (): Date => {
        const date = new Date();
        date.setHours(settings.hour);
        date.setMinutes(settings.minute);
        date.setSeconds(0);
        return date;
    };

    if (loading) return null;

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Header
                    title="Settings"
                    leftIcon={<BackButton />}
                    style={{ marginBottom: spacingY._10 }}
                />

                {/* Notification Section */}
                <Animated.View entering={FadeInDown.delay(50)} style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Icons.BellRingingIcon
                            size={22}
                            color={colors.primary}
                            weight="fill"
                        />
                        <Typo size={18} fontWeight="600" color={colors.neutral100}>
                            Thông báo
                        </Typo>
                    </View>

                    {/* Toggle Notification */}
                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Typo size={16} fontWeight="500" color={colors.neutral200}>
                                Nhắc nhở chi tiêu
                            </Typo>
                            <Typo size={13} color={colors.neutral400}>
                                Nhận thông báo nhắc nhập chi tiêu hàng ngày
                            </Typo>
                        </View>
                        <Switch
                            value={settings.enabled}
                            onValueChange={handleToggle}
                            trackColor={{
                                false: colors.neutral700,
                                true: colors.primary + "80",
                            }}
                            thumbColor={settings.enabled ? colors.primary : colors.neutral400}
                        />
                    </View>

                    {/* Time Picker */}
                    {settings.enabled && (
                        <Animated.View entering={FadeInDown.delay(100)}>
                            <TouchableOpacity
                                style={styles.timeRow}
                                onPress={() => setShowTimePicker(true)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.settingInfo}>
                                    <Typo size={16} fontWeight="500" color={colors.neutral200}>
                                        Thời gian thông báo
                                    </Typo>
                                    <Typo size={13} color={colors.neutral400}>
                                        Chọn thời gian nhận thông báo mỗi ngày
                                    </Typo>
                                </View>
                                <View style={styles.timeDisplay}>
                                    <Icons.ClockIcon
                                        size={18}
                                        color={colors.primary}
                                        weight="bold"
                                    />
                                    <Typo size={18} fontWeight="600" color={colors.primary}>
                                        {formatTime(settings.hour, settings.minute)}
                                    </Typo>
                                </View>
                            </TouchableOpacity>

                            {showTimePicker && (
                                <DateTimePicker
                                    value={getTimeDate()}
                                    mode="time"
                                    is24Hour={true}
                                    display={Platform.OS === "ios" ? "spinner" : "default"}
                                    onChange={handleTimeChange}
                                    themeVariant="dark"
                                />
                            )}
                        </Animated.View>
                    )}
                </Animated.View>

                {/* Info */}
                <Animated.View entering={FadeInDown.delay(150)} style={styles.infoBox}>
                    <Icons.InfoIcon size={18} color={colors.neutral400} />
                    <Typo
                        size={13}
                        color={colors.neutral400}
                        style={{ flex: 1, marginLeft: 8 }}
                    >
                        Thông báo sẽ được gửi vào thời gian đã chọn mỗi ngày để nhắc bạn
                        ghi lại chi tiêu.
                    </Typo>
                </Animated.View>
            </View>
        </ScreenWrapper>
    );
};

export default SettingsModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingX._20,
        paddingTop: spacingX._20,
    },
    section: {
        backgroundColor: colors.neutral800,
        borderRadius: radius._17,
        padding: spacingX._20,
        marginTop: spacingY._10,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacingX._10,
        marginBottom: spacingY._17,
        paddingBottom: spacingY._12,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral700,
    },
    settingRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    settingInfo: {
        flex: 1,
        gap: 4,
    },
    timeRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: spacingY._17,
        paddingTop: spacingY._17,
        borderTopWidth: 1,
        borderTopColor: colors.neutral700,
    },
    timeDisplay: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacingX._7,
        backgroundColor: colors.neutral700,
        paddingHorizontal: spacingX._12,
        paddingVertical: spacingY._7,
        borderRadius: radius._10,
    },
    infoBox: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: spacingY._20,
        paddingHorizontal: spacingX._10,
    },
});
