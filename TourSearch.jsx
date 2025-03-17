import React, { useEffect } from "react";
import axios from "axios";

const TourSearch = ({ selectedCity, onApiResponse }) => {
  const TOUR_API_KEY = "0imgyhhXUmSJ7xmBK7SLe74LfqzukopiSe2faHrmC8+O/1I8wFjAUcq90leo5aU7P4LxIOhd5bGHsDCty9Rfhw==";

  const areaCodes = {
    "서울": 1, "부산": 6, "대구": 4, "인천": 2, "광주": 5,
    "대전": 3, "울산": 7, "세종": 8, "경기": 31, "강원": 32,
    "충북": 33, "충남": 34, "전북": 35, "전남": 36,
    "경북": 37, "경남": 38, "제주": 39,
    "gongju": 34,  // 🟢 공주 추가! (공주는 충남 지역코드 34 사용)
    "jeonju": 35,  // 전주 추가 (전북 지역코드)
    "suwon": 31,   // 수원 추가 (경기 지역코드)
  };
  
  const getAreaCode = (city) => areaCodes[city] || 0;
  

  useEffect(() => {
    const fetchTouristAttractions = async () => {
      try {
        const response = await axios.get(`https://apis.data.go.kr/B551011/KorService1/areaBasedList1`, {
          params: {
            serviceKey: TOUR_API_KEY,
            MobileOS: "ETC",
            MobileApp: "AttractionsApp",
            listYN: "Y",
            numOfRows: 5,
            pageNo: 1,
            areaCode: getAreaCode(selectedCity), // 도시명 -> 지역 코드 변환 필요
            contentTypeId: 12,
            _type: "json",
          },
        });

        const attractions = response.data.response.body.items.item || [];
        const resultText = generateAttractionsDescription(attractions, selectedCity);
        onApiResponse(resultText);
      } catch (error) {
        console.error("❌ 관광지 정보 불러오기 실패:", error);
        onApiResponse(`${selectedCity}의 관광지 정보를 불러오는 데 실패했습니다.`);
      }
    };

    fetchTouristAttractions();
  }, [selectedCity, onApiResponse]);

  // 🟢 관광지 데이터를 친절한 설명으로 변환하는 함수
  const generateAttractionsDescription = (attractions, city) => {
    if (attractions.length === 0) return `🏛️ ${city}에는 추천할 관광지가 없습니다.`;

    let description = `🏛️ ${city}에서 추천하는 관광지는 다음과 같습니다:\n`;
    description += attractions
      .map((a, index) => `${index + 1}. ${a.title} - 📍 위치: ${a.addr1 || "정보 없음"}`)
      .join("\n");

    return description;
  };

  return null;
};

export default TourSearch;
