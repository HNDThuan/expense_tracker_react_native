import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Button from "@/components/Button";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
const Welcome = () => {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* sign in button and image */}
        <View>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            style={styles.loginButton}
          >
            <Typo fontWeight={500}>Sign In</Typo>
          </TouchableOpacity>

          <Animated.Image
            entering={FadeIn.duration(500)}
            source={require("../../assets/images/welcome.png")}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </View>

        {/* footer with text and button */}

        <View style={styles.footer}>
          <Animated.View
            entering={FadeInDown.duration(1000).springify().damping(15)}
            style={{ alignItems: "center" }}
          >
            <Typo size={24} fontWeight="800">
              Always take control
            </Typo>

            <Typo size={24} fontWeight="800">
              of your expenses
            </Typo>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000)
              .delay(500)
              .springify()
              .damping(15)}
            style={{ alignItems: "center", gap: 2 }}
          >
            <Typo size={15}>Finances must be arranged to set a better</Typo>

            <Typo size={15}>lifestyle in future</Typo>
          </Animated.View>

          <View style={styles.buttonContainer}>
            <Button onPress={() => router.push("/(auth)/register")}>
              <Typo size={18} color={colors.neutral900} fontWeight={600}>
                Get Started
              </Typo>
            </Button>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacingY._7,
  },
  welcomeImage: {
    width: "80%",
    height: verticalScale(300),
    alignSelf: "center",
    marginTop: verticalScale(100),
  },
  loginButton: {
    alignSelf: "flex-end",
    marginRight: spacingX._20,
  },
  footer: {
    backgroundColor: colors.neutral900,
    alignItems: "center",
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(45),
    gap: spacingY._20,
    shadowColor: colors.white,
    elevation: 50,
  },

  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacingX._25,
  },
});
