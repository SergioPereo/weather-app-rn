import "dotenv/config";

const openWeatherApiKey = process.env.OPENWEATHER_API_KEY;

export default {
    name: "weather-app-rn-rvms",
    slug: "weather-app-rn-rvms",
    scheme: "weather-app-rn-rvms",
    extra: {
        openWeatherApiKey: openWeatherApiKey,
    },
  };