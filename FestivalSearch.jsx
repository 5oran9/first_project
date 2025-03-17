import React, { useEffect } from "react";
import axios from "axios";

const FestivalSearch = ({ selectedCity, onApiResponse }) => {
  const FESTIVAL_API_KEY = '0imgyhhXUmSJ7xmBK7SLe74LfqzukopiSe2faHrmC8+O/1I8wFjAUcq90leo5aU7P4LxIOhd5bGHsDCty9Rfhw==';;

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
    const fetchFestival = async () => {
      try {
        const response = await axios.get(`https://apis.data.go.kr/B551011/KorService1/searchFestival1`, {
          params: {
            serviceKey: FESTIVAL_API_KEY,
            MobileOS: "ETC",
            MobileApp: "FestivalApp",
            listYN: "Y",
            numOfRows: 5,
            pageNo: 1,
            areaCode: getAreaCode(selectedCity),
            _type: "json",
          },
        });

        const festivals = response.data?.response?.body?.items?.item || [];
        
        if (!festivals.length) {
          console.error("❌ 축제 정보 없음:", selectedCity);
          onApiResponse(`${selectedCity}에서는 현재 예정된 축제가 없습니다.`);
          return;
        }

        const resultText = generateFestivalDescription(festivals, selectedCity);
        onApiResponse(resultText);
      } catch (error) {
        console.error("❌ 축제 정보 불러오기 실패:", error);
        onApiResponse(`${selectedCity}의 축제 정보를 불러오는 데 실패했습니다.`);
      }
    };

    fetchFestival();
  }, [selectedCity, onApiResponse]);

  // 🟢 축제 데이터를 친절한 설명으로 변환하는 함수
  const generateFestivalDescription = (festivals, city) => {
    if (festivals.length === 0) return `🎉 ${city}에서는 현재 예정된 축제가 없습니다.`;

    let description = `🎉 ${city}에서 열리는 축제 정보를 알려드릴게요!\n`;
    description += festivals
      .map(
        (f, index) =>
          `${index + 1}. ${f.title} - 📅 기간: ${f.eventstartdate} ~ ${f.eventenddate}, 📍 위치: ${f.addr1 || "정보 없음"}`
      )
      .join("\n");

    return description;
  };

  return null;
};

export default FestivalSearch;
