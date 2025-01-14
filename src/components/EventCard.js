import React from 'react';
import '../App.css'; // Импортируем стили из App.css

   
         

const EventCard = ({ title, time, address, description, price, imageUrl, placeLink }) => {
    
    
    
      
  return (
      

          
    <div className="p-0 rounded rounded-md w-[284px] bg-[#171717]/70">
      
      
            {/* Текстовая часть карточки */}
      <div className="px-3 py-0.5 text-left text-[#f5f5f4]/50 text-xs">

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
        className="h-[220px] bg-cover bg-center rounded-md flex flex-col items-left justify-end"
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
