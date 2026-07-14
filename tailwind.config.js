export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F2A93B",
        primarySoft: "#FDF3DC",
        primaryDeep: "#E89A25",
        cream: "#FCF0D4",
        creamSpot: "#F0B655",
        ink: "#1F2024",
        sub: "#8E9199",
        line: "#F1F2F4",
        danger: "#FF4D4F",
        field: "#F5F6F8"
      },
      fontFamily: {
        sans: ["Pretendard", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"]
      },
      boxShadow: {
        sheet: "0 -8px 24px rgba(0,0,0,0.08)",
        fab: "0 4px 12px rgba(0,0,0,0.12)"
      }
    }
  },
  plugins: []
};
