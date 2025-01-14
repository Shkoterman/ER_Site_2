import React from 'react';
import '../App.css'; // Импортируем стили из App.css

   
         

const EventCard = ({ title, time, address, description, price, imageUrl, WeekDay, dataDay, dataMouth, DataTime, placeLink, placeAdres, placeName }) => {
    
    // bg-gradient-to-t from-[#333033] from-30% via-[#333033]/5 via-60% to-[#333033]/30 to-100%
    
return (
<div className="p-0 max-w-[560px] h-[480px]  hover:bg-[#000000]/40 flex flex-col justify-between border-r border-b border-[#fdfdfd]/10 relative overflow-hidden pb-4">
    
    
    
    {/* Текстовая часть карточки */}
    
    <div className="h-full flex flex-col justify-between p-3.5 pt-0">
        
        <div className="h-40 px-4">
            <div class="text-[48px] leading-[48px] font-[700] pt-8">
              {dataDay}<span class="text-lg font-[200] px-1 text-[#676767]">/{dataMouth}</span>
            </div>
            <div class="text-[11px] font-[500] -pt-2">{WeekDay}</div>
        </div>
    
        <h3 className="text-[#FEFEFE] text-[19px] font-[700] text-left leading-[21px] pt-6 pb-2 px-4 uppercase2 tracking-wide">{title}</h3>
        
          <div className="flex-1 overflow-hidden text-left text-[14px] leading-[17px] text-[#676767] font-[300] tracking-wide px-4">
            {description && ( <p>{description}</p>    )}
          </div>
     
    
        <div className="flex justify-between px-4">
            <div className="flex-1">
                {time && <p className="text-sm leading-[16px] py-0 text-[#676767] font-[600]">{DataTime}<br/> {placeName}</p>}
            </div>
            <div className="flex-none text-right">
                {price && <div className="bg-[#E1B71C] text-[#272527] px-6 py-1 rounded-full text-lg font-[800]"> {price} </div>}
            </div>
        </div>
    </div>
    
     {/* Изображение */}
    
    <img src={imageUrl} class="object-cover w-[170px] h-[180px] absolute -top-0 right-0 z-1 rounded-bl-full mr-0 mt-0"/>
      <div className="text-right p-2">
        <span className="inline-block bg-[#111111]/90 px-3 py-1 rounded-full text-xs hidden">весь месяц</span>
    </div>
    
      
            {/* Текстовая часть карточки */}
      <div className="px-3 py-0.5 text-left text-[#f5f5f4]/50 text-xs hidden">

        {address && <p className="hidden">{address}</p>}

        {time && <p className="hidden">{time}</p>}

        {price && (
          <p
            className="text-xs hidden"
            dangerouslySetInnerHTML={{ __html: `${price}` }}
          ></p>
        )}
      </div>
      
      
      {/* Изображение на фоне сверху карточки */}
      <div
        className="h-[220px] bg-cover bg-center rounded-md flex flex-col items-left justify-end hidden"
        style={{ backgroundImage: `url(${imageUrl})` }}>
      
      
      <div className="px-3 py-2 text-sm backdrop-blur-sm hover:bg-black/50 rounded-md flex justify-between h-16 hover:h-full hover:pt-4 overflow-hidden">
      
            <div className="">
				 <h3 className="text-white/90 text-[17px] font-bold text-left leading-5">{title}</h3>
                 <div className="text-white text-left pt-2">
                    {time && <p className="hidden">{time}</p>}
                 </div>
                    {/* Описание с обрезкой, если оно больше 4 строк */}
        {description && (
          <div className="h-32 overflow-scroll text-left text-xs text-white/60 font-think">
            <p>{description}</p>
          </div>
        )}
            </div>
            <div className="flex-none w-12 text-white text-right flex flex-col justify-end">
                    {time && <p className="text-xs text-white/50">{time}</p>}
                    {price && <p className="text-md pb-1"> {price}€ </p>}
            </div>
      </div>
      </div>

    </div>
  );
};

export default EventCard;
