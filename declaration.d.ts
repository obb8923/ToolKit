declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '@env' {
  export const GOOGLE_MOBILE_ADS_UNIT_ID_BANNER_ANDROID: string;
  export const GOOGLE_MOBILE_ADS_UNIT_ID_BANNER_IOS: string;
  export const GOOGLE_MOBILE_ADS_UNIT_ID_INTERSTITIAL_ANDROID: string;
  export const GOOGLE_MOBILE_ADS_UNIT_ID_INTERSTITIAL_IOS: string;
  export const GOOGLE_MOBILE_ADS_UNIT_ID_NATIVE_ANDROID: string;
  export const GOOGLE_MOBILE_ADS_UNIT_ID_NATIVE_IOS: string;
}

// declare module 'react-native-google-mobile-ads' {
//   export const TestIds: any;
//   export const BannerAd: any;
//   export const BannerAdSize: any;
//   export const NativeAdView: any;
//   export const HeadlineView: any;
//   export const TaglineView: any;
//   export const AdvertiserView: any;
//   export const StarRatingView: any;
//   export const IconView: any;
//   export const MediaView: any;
//   export const CallToActionView: any;
//   export const AdBadge: any;
//   export const ImageView: any;
//   export const useInterstitialAd: any;
// }
  