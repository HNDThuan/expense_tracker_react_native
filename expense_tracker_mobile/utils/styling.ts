import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const [shortDemention, longDemention] =
  SCREEN_WIDTH < SCREEN_HEIGHT
    ? [SCREEN_WIDTH, SCREEN_HEIGHT]
    : [SCREEN_HEIGHT, SCREEN_WIDTH];

const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

export const scale = (size: number) =>
  Math.round(
    PixelRatio.roundToNearestPixel(
      ((shortDemention / guidelineBaseWidth) * size) as number,
    ),
  );
export const verticalScale = (size: number) =>
  Math.round(
    PixelRatio.roundToNearestPixel(
      ((longDemention / guidelineBaseHeight) * size) as number,
    ),
  );
