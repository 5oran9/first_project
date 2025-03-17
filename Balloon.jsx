import React, { useState }  from 'react'
import './Balloon.css'

const balloonRandom = ["더 많은 정보를 알고 싶으시다면 저를 눌러주세요!", "질문이 있으시다면 저를 눌러주세요!", "반가워요! 질문이 있으신가요?"];

function genRandomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}


export const ChatBalloon = ({onToggleChat}) => {
    const balloonDesc = balloonRandom[genRandomInt(2)];
    const [isToggled, setIsToggled] = useState(false);

    const handleToggle = () => {
      setIsToggled(prev => !prev); // 상태 변경
      onToggleChat(); // 팝업 열기/닫기
    };

  return (
    <div className='chat-container'>
      <button className={`main-page-btn ${isToggled ? 'checked' : ''}`} onClick={handleToggle}></button>
      <div className='balloon' id='chatBalloon'>{balloonDesc}</div>
    </div>
  )
}

export const Manual = () => {

  return (
    <div>
      <div className='balloon' id='manualBalloon'>
        지도를 누르시면 벚꽃 명소를 보실 수 있어요 (❁´◡`❁)
        <div>
          <button id='map-icon'></button> ⬅ 이걸 누르시면 상세한 지도로 연결됩니다!
        </div>
      </div>
    </div>
  )
}
