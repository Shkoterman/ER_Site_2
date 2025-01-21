import React from 'react';
import logoImage from './img/logo_ensalada.png';
import axios from 'axios';

const countClick = async (inputText) => {
  /*try {
    await axios.post('http://localhost:5000/clickcount', {
      text: inputText,
    });
  } catch (error) {
    console.error('Ошибка при добавлении записи:', error);
  }*/
};

const Footer = () => {
  return (
    <footer className="bg-[#111111] p-4 lg:px-16 lg:py-24 min-h-[360px] font-[Commissioner] font-[200]">
      <div className="lg:max-w-5xl mx-auto lg:flex gap-32">
      <div className="flex-1 text-[#676767]">
      <div className="w-48 pb-4 opacity-40"><img src={logoImage} alt="Logo" /></div>
      <p className="w-48 text-[13px] leading-[16px] pl-6">Коммьюнити и медиа<br/> для тех, кто переехал<br/> в Барселону</p>
      <p className="w-48 text-[13px] leading-[16px] pl-6 my-4 lg:mt-16 ">ensalada.net 2025</p>
      </div>
      
      <div className="flex-none lg:w-1/2 pl-6 flex gap-8 font-[400]">
      <ul className="flex-none lg:w-48 py-4 flex flex-col gap-3">
        <li className="font-[500] text-[#676767] lg:text-xl">Быть с нами:</li>
        <li>
          <a 
            href="https://www.instagram.com/ensalada.bcn/" target="_blank"
            onClick={() => countClick('Footer click Instagaram')}
            >Instagram
          </a>
        </li>
        <li><a 
          href="https://t.me/ensalada" target="_blank"
          onClick={() => countClick('Footer click Telegram')}
          >Telegram</a></li>
        {/*<li><a href="https://www.t.me/ensalada/" target="_blank">Чат</a></li>*/}
      </ul>
      <ul className="flex-none lg:w-48 py-4 flex flex-col gap-3">
        <li className="font-[500] text-[#676767] lg:text-xl">Есть вопросы?</li>
        <li><a 
          href="https://t.me/ensalada_org" target="_blank"
          onClick={() => countClick('Footer click ensalada_org')}
          >Написать в Telegram</a></li>
        <li className="w-48 text-[#676767] text-[13px] leading-[16px] font-[200]">По сотрудничеству, рекламе или если нужна помощь нашей службы поддержки.</li>
      </ul>
      </div>
      </div>
      <div className="py-2">
        
      </div>
    </footer>
 
  );
};

export default Footer; 