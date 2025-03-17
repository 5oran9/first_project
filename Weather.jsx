import React, { useEffect } from "react";
import axios from "axios";

// 🟢 도시별 기상청 격자 좌표 데이터 (직접 매핑)
const cityGridData = {
  서울: { nx: 60, ny: 127 },
  부산: { nx: 98, ny: 76 },
  대구: { nx: 89, ny: 90 },
  인천: { nx: 55, ny: 124 },
  광주: { nx: 58, ny: 74 },
  대전: { nx: 67, ny: 100 },
  울산: { nx: 102, ny: 84 },
  세종: { nx: 66, ny: 103 },
  경기: { nx: 60, ny: 120 },
  강원: { nx: 73, ny: 134 },
  충북: { nx: 69, ny: 107 },
  충남: { nx: 68, ny: 100 },
  전북: { nx: 63, ny: 89 },
  전남: { nx: 51, ny: 67 },
  경북: { nx: 91, ny: 106 },
  경남: { nx: 91, ny: 77 },
  제주: { nx: 52, ny: 38 },
};

const Weather = ({ selectedCity, onApiResponse }) => {
  const WEATHER_API_KEY = '0imgyhhXUmSJ7xmBK7SLe74LfqzukopiSe2faHrmC8+O/1I8wFjAUcq90leo5aU7P4LxIOhd5bGHsDCty9Rfhw=='; // 기상청 API 키

  useEffect(() => {
    const fetchWeather = async () => {
      if (!selectedCity || !cityGridData[selectedCity]) {
        console.error("❌ 유효한 도시가 아닙니다:", selectedCity);
        onApiResponse("유효한 도시를 선택해주세요.");
        return;
      }

      try {
        const { nx, ny } = cityGridData[selectedCity]; // 도시별 nx, ny 값 가져오기
        const response = await axios.get(`https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst`, {
          params: {
            serviceKey: WEATHER_API_KEY,
            numOfRows: 10,
            pageNo: 1,
            dataType: "JSON",
            base_date: new Date().toISOString().slice(0, 10).replace(/-/g, ""), // 오늘 날짜
            base_time: "0600",
            nx,
            ny,
          },
        });

        const data = response.data.response.body.items.item;
        const weatherDescription = generateWeatherDescription(data, selectedCity);
        onApiResponse(weatherDescription);
      } catch (error) {
        console.error("❌ 날씨 정보 불러오기 실패:", error);
        onApiResponse(`${selectedCity}의 날씨 정보를 불러오는 데 실패했습니다.`);
      }
    };

    fetchWeather();
  }, [selectedCity, onApiResponse]);

  // 🟢 날씨 데이터를 서술식으로 변환하는 함수 (친절한 설명 유지)
  const generateWeatherDescription = (data, city) => {
    let description = `🌦️ ${city}의 날씨 정보:\n`;
    let temp = "",
      humidity = "",
      rain = "";

    data.forEach((item) => {
      switch (item.category) {
        case "T1H":
          temp = `🌡️ 현재 기온: ${item.obsrValue}°C\n`;
          break;
        case "REH":
          humidity = `💧 습도: ${item.obsrValue}%\n`;
          break;
        case "PTY": // 강수 형태(비, 눈) 처리
          switch (item.obsrValue) {
            case 0:
              rain = "☀️ 비나 눈이 내리지 않습니다.\n";
              break;
            case 1:
              rain = "🌧️ 비가 내리고 있습니다.\n";
              break;
            case 2:
              rain = "🌨️ 진눈깨비가 내리고 있습니다.\n";
              break;
            case 3:
              rain = "❄️ 눈이 내리고 있습니다.\n";
              break;
            case 4:
              rain = "⛈️ 소나기가 내리고 있습니다.\n";
              break;
            default:
              rain = "🌦️ 강수 정보가 없습니다.\n";
              break;
          }
          break;
        default:
          break;
      }
    });

    description += temp + humidity + rain;
    return description;
  };

  return null;
};

export default Weather;
