import './SubPage.css'
import { cityList } from '../assets/data'

const SubPage = ({ onClosePopup, selectedArea, selectedCity, onSelectCity }) => {


  
  const cityDataList = cityList[selectedArea] || []
  const selectedCityData = cityDataList.find(city => city.city_EN_name === selectedCity) || cityDataList[0];

  
  
  const onClose = () => {
    onClosePopup();
    document.querySelector(".selectedArea").classList.remove("selectedArea");
    document.querySelector(".bloom-selected").classList.remove(`${selectedArea}-p`);
    document.querySelector("#map").removeChild(document.querySelector(".bloom-selected"));
  };

    // 카카오맵 새 창 열기 함수 🦧 여기 경중님이 주신 코드 추가했습니다
  const openKakaoMap = (address) => {
    const kakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(address)}`;
    window.open(kakaoMapUrl, '_blank', 'width=800,height=600');
  };

  return (
    <div>
      <div className='desc'>
        <menu>
        {cityList[selectedArea].map((city, index) => (
            <li key={index}><button className={selectedCity === city.city_EN_name ? 'active' : ''} onClick={() => onSelectCity(city.city_EN_name)}>{city.city_name}</button></li>
          ))}

          <div id='close' onClick={() => {onClose()}}>X</div>
        </menu>
        <div className='cities'>

          <div className='city-detail'>
          {selectedCityData ? (
              <div>
                {selectedCityData.content.map((place, index) => (
                  <div key={index}>
                    <h2>{`🌸 ${place.placeName} 🌸`}</h2>
                    <img src={place.imageSrc} alt={place.placeName}/>
                    <h3>
                      <button
                      onClick={(e) => {e.preventDefault(); 
                      openKakaoMap(place.address);}}></button>
                      {`${place.address}`}</h3>
                    <h5>{place.intro}</h5>
                    <p>{place.desc}</p>
                  </div>
                ))}
              </div>
            ) : ''}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubPage
