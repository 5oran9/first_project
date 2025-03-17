import React from 'react'
import { area } from '../assets/koreaMapData';
import './KoreaMap.css'

const KMLabel = ({index, onSelectAreaLabel, onOpenPopup, onSelectCity, selectedArea}) => {
    // 개화시기 들어갈 p 태그
    const bloomP = document.createElement("p");
    bloomP.classList.add("bloom");
    const bloomP_S = document.createElement("p");
    bloomP_S.classList.add("bloom-selected"); // bloom class와 동일한 css(선택된 구역의 p태그 css는 여기서 변경)

    const labelP_on = (i) => {
      const onPath = document.querySelectorAll("path");
      onPath[i].classList.add("on-mouse");

      bloomP.textContent = area[i].p_text;
      bloomP.classList.add(area[i].p_class);
      document.querySelector("#map").appendChild(bloomP);
    }
      
    const labelP_out = (i) => {
        const onPath = document.querySelectorAll("path");
        onPath[i].classList.remove("on-mouse");
    
        bloomP.classList.remove(area[i].p_class);
        document.querySelector("#map").removeChild(document.querySelector(".bloom"));
    }

    const selectArea = (i) => {
      // 기존에 존재하던 선택된 구역이 있을 경우
      if(document.querySelector(".selectedArea")){
        document.querySelector(".selectedArea").classList.remove("selectedArea");
        bloomP_S.classList.remove(`${selectedArea}-p`);
        document.querySelector("#map").removeChild(document.querySelector(".bloom-selected"));
      }
      
      onSelectAreaLabel(area[i].area_name_EN);
      onSelectCity(area[i].default);
      // useState 들어갈 위치 area[index].area_name_EN을 변수에 집어넣기

      const selectedPath = document.querySelectorAll("path");
      selectedPath[i].classList.add("selectedArea"); // 선택된 구역 css

      bloomP_S.textContent = area[i].p_text;
      bloomP_S.classList.add(area[i].p_class);
      document.querySelector("#map").appendChild(bloomP_S);

      if(area[i].position === "right"){
        onOpenPopup("right");
      }
      else{
        onOpenPopup("left");
      }
    };

  return (
    <label className={`city-name ${area[index].area_name_EN}`} onMouseOver={() => labelP_on(index)} onMouseOut={() => labelP_out(index)} onClick={() => selectArea(index)}>{area[index].area_name_KO}</label>
  )
}

export default KMLabel
