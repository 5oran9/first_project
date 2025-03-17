import React, { useState, useEffect } from 'react';
import './Mainpage.css';
import KoreaMap from './KoreaMap.jsx';
import SubPage from './SubPage.jsx';
import {ChatBalloon, Manual} from './Balloon.jsx'
import ChatBot from './ChatBot.jsx';


const MainPage = ({isPopupOpen, onOpenPopup, onClosePopup}) => {



  const [ selectedArea, setSelectedArea ] = useState(null);
  const [ selectedCity, setSelectedCity] = useState(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages'); //  localStorage에서 데이터 가져오기
    return savedMessages ? JSON.parse(savedMessages) : []; // 데이터가 있으면 파싱해서 사용, 없으면 빈 배열([]) 반환
  }); 

  // useEffect(() => {
  //   const savedMessages = localStorage.getItem('chatMessages');
  //   if (savedMessages) {
  //     setChatMessages(JSON.parse(savedMessages));
  //   }
  // }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
  }, [chatMessages]);


  return (
    <div className='main-content' id='main-content'>

      <section id='part-1'>
        {isPopupOpen === "left" && 
        <SubPage
        onClosePopup={onClosePopup}
        selectedArea={selectedArea}
        selectedCity={selectedCity}

        />}
        <ChatBalloon onToggleChat={() => setIsChatOpen(prev => !prev)}/>
      </section>
        


      <section id='part-2'>
        <KoreaMap 
        onSelectArea={setSelectedArea}
        onOpenPopup ={onOpenPopup}
        selectedArea={selectedArea}
        onSelectCity={setSelectedCity}
        />
      {isChatOpen && (
        <ChatBot
          onCloseChat={() => setIsChatOpen(false)}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          selectedCity={selectedCity}
          selectedArea={selectedArea}
        />

        
      )}

      
      </section>



      <section id='part-3'>
      {isPopupOpen === "right" && 
        <SubPage
        onClosePopup={onClosePopup}
        selectedArea={selectedArea}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
      />}
      <Manual/>
      </section>
    </div>
  );
}

export default MainPage
