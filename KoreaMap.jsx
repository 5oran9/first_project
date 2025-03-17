import * as React from 'react'
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { feature } from 'topojson-client'
import './KoreaMap.css'

// 지도 그리는 좌표 정보
import korea from '../assets/southkorea.json';
// 마우스를 특정 행정구역에 올렸을 때 화면에 나타날 p 태그의 class와 내용
import { area } from '../assets/koreaMapData';
import KMLabel from './KMLabel'
 
const featureData = feature(korea, korea.objects["southkorea"]) // southkorea = korea-topo
// topojson-client는 topoJSON 파일을 D3에서 사용할 수 있게 바꿔주는 라이브러리라고 하네요??
// 그리고 저는 위에 'korea-topo' 라는 이름으로 접근했는데
// 만드신 topoJSON 파일을 열어서 'objects'라고 검색하셔서 객체로 안에 프로퍼티 이름을 적어주시면 된답니다.

const KoreaMap = ({onSelectArea, onOpenPopup, selectedArea, onSelectCity}) => {
  // 개화시기 들어갈 p 태그
  const bloomP = document.createElement("p");
  bloomP.classList.add("bloom");
  const bloomP_S = document.createElement("p");
  bloomP_S.classList.add("bloom-selected"); // bloom class와 동일한 css(선택된 구역의 p태그 css는 여기서 변경)
  let bloomP_S_class;

  const chooseCity = (d) => {
    // 기존에 존재하던 선택된 구역이 있을 경우
    if(document.querySelector(".selectedArea")){
      document.querySelector(".selectedArea").classList.remove("selectedArea");
      bloomP_S.classList.remove(bloomP_S_class);
      document.querySelector("#map").removeChild(document.querySelector(".bloom-selected"));
    }

    let i = 0;
    const pathA = document.querySelectorAll("path");
    for(i; i < pathA.length; i++){
        if(d.target === pathA[i]){
          break;
        }
    }
    onSelectArea(featureData.features[i].properties.CTP_ENG_NM);
    onSelectCity(area[i].default);

    pathA[i].classList.add("selectedArea"); // 선택된 구역 css
    bloomP_S.textContent = area[i].p_text;
    bloomP_S.classList.add(area[i].p_class);
    bloomP_S_class = area[i].p_class;
    document.querySelector("#map").appendChild(bloomP_S);

    if(area[i].position === "right"){
      onOpenPopup("right");
    }
    else{
      onOpenPopup("left");
    }
  }

  const pathP_on = (d) => {
    let i = 0;
    const pathA = document.querySelectorAll("path");
    for(i; i < pathA.length; i++){
        if(d.target === pathA[i]){
          break;
      }
    }

    bloomP.textContent = area[i].p_text;
    bloomP.classList.add(area[i].p_class);
    document.querySelector("#map").appendChild(bloomP);
  };

  const pathP_out = (d) => {
    let i = 0;
    const pathA = document.querySelectorAll("path");
    for(i; i < pathA.length; i++){
        if(d.target === pathA[i]){
          break;
      }
    }

    bloomP.classList.remove(area[i].p_class);
    document.querySelector("#map").removeChild(bloomP);
  };

  // svg를 그릴 엘리먼트 설정을 위한 ref
  const chart = useRef(null)
 
  const printD3 = () => {
 
    // 지도 svg의 너비와 높이
    const width = 900
    const height = 900
 
 
    // 메르카토르 투영법 설정
    // 우리가 가장 많이 쓰는 도법으로 구형인 지구를 평면으로 표현하는 하나의 방법이라고 하네요??
    const projection = d3.geoMercator().scale(1).translate([0, 0])
    const path = d3.geoPath().projection(projection)
    const bounds = path.bounds(featureData)
    
    // svg의 크기에 따른 지도의 크기와 위치값을 설정합니다.
    const dx = bounds[1][0] - bounds[0][0]
    const dy = bounds[1][1] - bounds[0][1]
    const x = (bounds[0][0] + bounds[1][0]) / 2
    const y = (bounds[0][1] + bounds[1][1]) / 2
    const scale = 0.9 / Math.max(dx / width, dy / height)
    const translate = [width / 2 - scale * x, height / 2 - scale * y]
 
    projection.scale(scale).translate(translate)
 
    // svg를 만들고
    const svg = d3
      .select(chart.current)
      .append('svg')
      .attr('width', width) // 여기 크기 바꾸니까 글씨도 같이 움직여요 🦧 허나 반응형 웹에 뒷통수 맞아 원위치..
      .attr('height', height) 
      //.attr("viewBox", `0 0 ${width} ${height}`)  // 기존 width, height 그대로 🦧 여기는 챗GPT가 추가
      //.attr("preserveAspectRatio", "xMidYMid meet");  // 비율 깨지도록 설정 🦧 여기는 챗GPT가 추가

 
    const mapLayer = svg.append('g')
    
    // topoJSON의 데이터를 그려줍니다.
    mapLayer
      .selectAll('path')
      .data(featureData.features)
      .enter().append('path')
      .attr('d', path)
      .on('click', chooseCity)
      .on('mouseover', pathP_on)
      .on('mouseout', pathP_out)
  }
 
  useEffect(() => {
    printD3()
  }, [])
 
    return (
      <div ref={chart} id="map">
        <KMLabel 
        index={0} onSelectAreaLabel={onSelectArea} onOpenPopup={onOpenPopup} onSelectCity={onSelectCity} selectedArea={selectedArea}
        />
        <KMLabel 
        index={1} onSelectAreaLabel={onSelectArea} onOpenPopup={onOpenPopup} onSelectCity={onSelectCity} selectedArea={selectedArea}
        />
        <KMLabel
        index={2} onSelectAreaLabel={onSelectArea} onOpenPopup={onOpenPopup} onSelectCity={onSelectCity} selectedArea={selectedArea}
        />
        <KMLabel 
        index={3} onSelectAreaLabel={onSelectArea} onOpenPopup={onOpenPopup} onSelectCity={onSelectCity} selectedArea={selectedArea}
        />
        <KMLabel 
        index={4} onSelectAreaLabel={onSelectArea} onOpenPopup={onOpenPopup} onSelectCity={onSelectCity} selectedArea={selectedArea}
        />
        <KMLabel 
        index={5} onSelectAreaLabel={onSelectArea} onOpenPopup={onOpenPopup} onSelectCity={onSelectCity} selectedArea={selectedArea}
        />
        <KMLabel 
        index={6} onSelectAreaLabel={onSelectArea} onOpenPopup={onOpenPopup} onSelectCity={onSelectCity} selectedArea={selectedArea}/>
        <KMLabel 
        index={7} onSelectAreaLabel={onSelectArea} onOpenPopup={onOpenPopup} onSelectCity={onSelectCity} selectedArea={selectedArea}
        />
        <KMLabel 
        index={8} onSelectAreaLabel={onSelectArea} onOpenPopup={onOpenPopup} onSelectCity={onSelectCity} selectedArea={selectedArea}
        />
        <KMLabel 
        index={9} onSelectAreaLabel={onSelectArea} onOpenPopup={onOpenPopup} onSelectCity={onSelectCity} selectedArea={selectedArea}
        />
        <KMLabel 
        index={10} onSelectAreaLabel={onSelectArea} onOpenPopup={onOpenPopup} onSelectCity={onSelectCity} selectedArea={selectedArea}
        />
        <KMLabel 
        index={11} onSelectAreaLabel={onSelectArea} onOpenPopup={onOpenPopup} onSelectCity={onSelectCity} selectedArea={selectedArea}
        />
        <KMLabel 
        index={12} onSelectAreaLabel={onSelectArea} onOpenPopup={onOpenPopup} onSelectCity={onSelectCity} selectedArea={selectedArea}
        />
        <KMLabel 
        index={13} onSelectAreaLabel={onSelectArea} onOpenPopup={onOpenPopup} onSelectCity={onSelectCity} selectedArea={selectedArea}
        />
        <KMLabel 
        index={14} onSelectAreaLabel={onSelectArea} onOpenPopup={onOpenPopup} onSelectCity={onSelectCity} selectedArea={selectedArea}
        />
        <KMLabel 
        index={15} onSelectAreaLabel={onSelectArea} onOpenPopup={onOpenPopup} onSelectCity={onSelectCity} selectedArea={selectedArea}
        />
        <KMLabel 
        index={16} onSelectAreaLabel={onSelectArea} onOpenPopup={onOpenPopup} onSelectCity={onSelectCity} selectedArea={selectedArea}
        />
      </div>
    )
};

export default KoreaMap;
