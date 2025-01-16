import React from 'react';
import '../App.css'; // Импортируем стили из App.css

   
         

const EventCard = ({ title, time, address, description, price, imageUrl, WeekDay, dataDay, dataMouth, DataTime, placeLink, placeAdres, placeName }) => {
    
    // bg-gradient-to-t from-[#333033] from-30% via-[#333033]/5 via-60% to-[#333033]/30 to-100%
    
return (
<div className="p-0 max-w-[400px] lg:h-[440px]  hover:bg-[#000000]/40 flex flex-col justify-between border-r border-b border-[#fdfdfd]/10 relative overflow-hidden pb-3">
    
    
    
    {/* Текстовая часть карточки */}
    
    <div className="h-full flex flex-col justify-between p-3 pt-0">
        
        <div className="h-40 px-4">
            <div class="text-[64px] leading-[48px] font-[600] pt-8 font-[Commissioner]">
                <span class="tracking-tighter text-white/80">{dataDay}</span>
                <span class="text-lg font-[300] px-1 opacity-80">/{dataMouth}</span>
            </div>
            <div class="text-[13px] font-[500] uppercase pt-0 text-white/80">{WeekDay}</div>
            <div class="text-xs opacity-80 -mt-0.5">и еще 2 дня</div>
        </div>
    
        <h3 className="text-white/90 text-[19px] font-[500] text-left leading-[21px] lg:pt-4 pb-2 px-4 uppercase2 tracking-wide line-clamp-3">{title}</h3>
        
          <div className="flex-1 overflow-hidden text-left text-[14px] leading-[18px] font-[300] tracking-wide px-4 text-[#9c9c9c]">
            {description && ( <p class="line-clamp-5">{description}</p>    )}
          </div>
     
    
        <div className="flex justify-between pl-4 pr-4 pt-6 font-[Commissioner]">
            <div className="flex-1">
                {time && <div className="text-lg leading-[22px] font-[300] px-1 text-white/80">{DataTime}</div>}
                
                {placeName && <div className="text-xs font-[300] px-1 opacity-80">{placeName}</div>}
    
            </div>
            <div className="flex-none flex flex-col justify-end text-center">
                {price && <div className="text-white/90 min-w-20 px-4 py-1 rounded-full text-base font-[600] hover:bg-[#F8BF32] hover:text-[#272527] border border-[#676767] hover:border-[#F8BF32]"> {price} </div>}
            </div>
        </div>
    </div>
    
     {/* Изображение   <img src={imageUrl} class="object-cover w-[110px] h-[110px] absolute -top-0 right-0 z-1 rounded-full mr-7 mt-5 opacity-90"/> */}
    
    {imageUrl && (
    
   <img src={imageUrl} class="object-cover w-[145px] h-[145px] absolute -top-0 right-0 z-1 rounded-bl-full mr-0 mt-0 opacity-90"/>
        
    
    )}
    

</div>
  );
};

export default EventCard;
