import React from 'react';
import '../App.css'; // Импортируем стили из App.css

   
         

const EventCard = ({ title, time, address, shortDescription, price, imageUrl, weekDay, dataDay, dataMouth, dataTime, placeLink, placeAdres, placeName, dataStr }) => {
    
    // bg-gradient-to-t from-[#333033] from-30% via-[#333033]/5 via-60% to-[#333033]/30 to-100%
    
return (
<div className="p-0 max-w-[560px] h-[480px]  hover:bg-[#000000]/40 flex flex-col justify-between border-r border-b border-[#fdfdfd]/10 relative overflow-hidden pb-4" >
    
    
    
    {/* Текстовая часть карточки */}
    
    <div className="h-full flex flex-col justify-between p-3.5 pt-0">
        
        <div className="h-40 px-4">
            <div class="text-[64px] leading-[48px] font-[600] pt-8 font-[Commissioner]">
                <span class="tracking-tighter text-white/80">{dataDay}</span>
                <span class="text-lg font-[300] px-1 opacity-80">/{dataMouth}</span>
            </div>
            <div class="text-[13px] font-[500] uppercase pt-0 text-white/80">{weekDay}</div>
            <div class="text-xs opacity-80 -mt-0.5">{dataStr}</div>
        </div>
    
        <h3 className="text-[#FEFEFE] text-[19px] font-[700] text-left leading-[21px] pt-6 pb-2 px-4 uppercase2 tracking-wide">{title}</h3>
        
          <div className="flex-1 overflow-hidden text-left text-[14px] leading-[18px] font-[300] tracking-wide px-4 text-[#9c9c9c]">
            {shortDescription && ( <p class="line-clamp-5">{shortDescription}</p>    )}
          </div>
     
    
        <div className="flex justify-between px-4 font-[Commissioner]">
            <div className="flex-1">
                {time && <div className="text-lg leading-[22px] font-[300] px-1 text-white/80">{dataTime}</div>}
                
                {placeName && <div className="text-xs font-[300] px-1 opacity-80">{placeName}</div>}
    
            </div>
            <div className="flex-none text-right">
                {price && <div className="bg-[#E1B71C] text-[#272527] px-6 py-1 rounded-full text-lg font-[700]"> {price} </div>}
            </div>
        </div>
    </div>
    
     {/* Изображение   <img src={imageUrl} class="object-cover w-[110px] h-[110px] absolute -top-0 right-0 z-1 rounded-full mr-7 mt-5 opacity-90"/> */}
    
    {imageUrl && (
    
   <img src={imageUrl} class="object-cover w-[145px] h-[145px] absolute -top-0 right-0 z-1 rounded-bl-full mr-0 mt-0 opacity-90" alt = "..."/>
        
    
    )}
    

    </div>
  );
};

export default EventCard;
