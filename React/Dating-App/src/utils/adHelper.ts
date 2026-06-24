export const AdHelper = {
  showBannerAd: () => {
    // Placeholder for PWA Ads (e.g., Google AdSense or dummy banner)
    console.log("Showing banner ad...");
    return true;
  },

  showInterstitialAd: (isVip: boolean) => {
    if (isVip) {
      console.log("User is VIP, skipping interstitial ad.");
      return false;
    }
    console.log("Showing interstitial ad...");
    return true;
  }
};
