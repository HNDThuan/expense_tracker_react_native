import { NotificationSettingsType } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const NOTIFICATION_SETTINGS_KEY = "notification_settings";

const DEFAULT_SETTINGS: NotificationSettingsType = {
    enabled: true,
    hour: 21, // 9 PM
    minute: 0,
};

// Configure how notifications are displayed when the app is in the foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

/**
 * Initialize notifications: request permissions and set up Android channel
 */
export const initializeNotifications = async (): Promise<boolean> => {
    try {
        // Request permissions
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            console.log("Notification permissions not granted");
            return false;
        }

        // Set up Android notification channel
        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("daily-reminder", {
                name: "Nhắc nhở chi tiêu",
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                sound: "default",
            });
        }

        return true;
    } catch (error) {
        console.error("Error initializing notifications:", error);
        return false;
    }
};

/**
 * Get notification settings from AsyncStorage
 */
export const getNotificationSettings =
    async (): Promise<NotificationSettingsType> => {
        try {
            const stored = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
            if (stored) {
                return JSON.parse(stored) as NotificationSettingsType;
            }
            return DEFAULT_SETTINGS;
        } catch (error) {
            console.error("Error reading notification settings:", error);
            return DEFAULT_SETTINGS;
        }
    };

/**
 * Save notification settings to AsyncStorage
 */
export const saveNotificationSettings = async (
    settings: NotificationSettingsType,
): Promise<void> => {
    try {
        await AsyncStorage.setItem(
            NOTIFICATION_SETTINGS_KEY,
            JSON.stringify(settings),
        );
    } catch (error) {
        console.error("Error saving notification settings:", error);
    }
};

/**
 * Schedule a daily reminder notification at the specified time
 */
export const scheduleDailyReminder = async (
    hour: number,
    minute: number,
): Promise<void> => {
    try {
        // Cancel existing reminders first
        await cancelAllReminders();

        // Schedule new daily notification
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Nhắc nhở chi tiêu 💰",
                body: "Hãy nhập chi tiêu cho hôm nay!",
                sound: "default",
                ...(Platform.OS === "android" && {
                    channelId: "daily-reminder",
                }),
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour: hour,
                minute: minute,
            },
        });

        console.log(`Daily reminder scheduled at ${hour}:${minute}`);
    } catch (error) {
        console.error("Error scheduling daily reminder:", error);
    }
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllReminders = async (): Promise<void> => {
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
        console.log("All reminders cancelled");
    } catch (error) {
        console.error("Error cancelling reminders:", error);
    }
};

/**
 * Setup notifications on app start: read settings and schedule if enabled
 */
export const setupNotificationsOnStart = async (): Promise<void> => {
    const permissionGranted = await initializeNotifications();
    if (!permissionGranted) return;

    const settings = await getNotificationSettings();
    if (settings.enabled) {
        await scheduleDailyReminder(settings.hour, settings.minute);
    }
};
