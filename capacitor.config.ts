import type { CapacitorConfig } from '@capacitor/cli';
// import {} from "src/assets/icon/favicon.png";
// const icon = "../../favicon.png"

const config: CapacitorConfig = {
  appId: 'io.alarmoclock',
  appName: 'alarm-o-clock',
  webDir: 'www',
  plugins: {
    LocalNotifications: {
      smallIcon: "src/assets/icon/favicon.png",
      iconColor: "#488AFF",
      sound: "src/assets/sounds/clock-alarm-lo-fi-001.mp3",
    },
  },
};

export default config;
