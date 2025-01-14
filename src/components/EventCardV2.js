import React from 'react';
import '../App.css'; // Импортируем стили из App.css

   
         

const EventCard = ({ title, time, address, description, price, imageUrl, placeLink }) => {
    
    
    
return (
<div className="p-0 rounded rounded-md max-w-[560px] bg-[#171717]/70 hover:bg-[#000000] flex">
    
    {/* Изображение */}
    
    <div className="h-[200px] w-1/3 bg-cover bg-center rounded-md flex flex-col items-left justify-end opacity-60 hover:opacity-100 cursor-pointer" style={{ backgroundImage: `url(${imageUrl})` }}>
    <div className="text-right p-2">
        <span className="inline-block bg-[#111111]/90 px-3 py-1 rounded-full text-xs">весь месяц</span>
    </div>
    </div>
    
    {/* Текстовая часть карточки */}
    
    <div className="h-48 w-2/3 flex flex-col justify-between px-4">
        <h3 className="text-white/80 text-[20px] font-[600] text-left leading-[22px] pt-2.5 pb-2">{title}</h3>
        {description && (
          <div className="flex-1 overflow-hidden text-left text-[13px] leading-[17px] text-[#676767] font-[300] tracking-wide">
            <p>{description}</p>
          </div>
        )}
    
        <div className="flex">
            <div className="flex-1">
                {time && <p className="text-xs py-2 text-[#676767] font-[600]">{time} | HotSpot</p>}
            </div>
            <div className="flex-none text-right">
                {price && <p className="text-lg pb-1 font-[600]"> {price} </p>}
            </div>
        </div>
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
