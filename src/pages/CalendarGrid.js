import React, { useState } from 'react';
import { formatAirtableData } from '../api/airtable/formatAirtableData';
import EventCard from '../components/EventCardV2';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Импортируем файл стилей

export const CalendarGrid = (data) => {
  const airtbleData = formatAirtableData(data);

  // Локальное состояние для карточек
  const [events] = useState(() => airtbleData.events); 
  // Отфильтрованные события
  const [filteredEvents, setFilteredEvents] = useState(() => airtbleData.events); 

  // Состояние для активных фильтров времени 
  const [filtersTimeSet, setFiltersTimeSet] = useState(() => {
    const initialTimeFilters = Array.from(airtbleData.timeSetByEvents).reduce((acc, timeTag) => {
      acc[timeTag] = false;
      return acc;
    }, {});
    initialTimeFilters['Всегда'] = true;

    return initialTimeFilters
  });

  // Состояние для активных фильтров тэгов
  const [filtersTagSet, setFiltersTagSet] = useState(() => {
    const initialTagFilters = Array.from(airtbleData.tagsSetByEvents).reduce((acc, tag) => {
      acc[tag] = false;
      return acc;
    }, {});
    initialTagFilters['Все'] = true;

    return initialTagFilters
  });

  const navigate = useNavigate();

  const handleCardClick = (event) => {
  const userAgent = navigator.userAgent;
  const isTelegramBrowser = /Telegram/i.test(userAgent) || /Chrome\/[\d\.]+ Mobile Safari/i.test(userAgent); 
    if (event.eventProfeePagelLink !== "") {
      if (isTelegramBrowser) {
        window.location.href = event.eventProfeePagelLink; // Открыть ссылку в текущем окне
      } else {
        window.open(event.eventProfeePagelLink, '_blank'); // Открыть в новой вкладке, если не Telegram
      }
    } else {
      navigate('/event', { state: event }); // Переход на страницу события
    }
  };

  //ЭТОТ МЕТОД ДЛЯ НОВОЙ ФИЛЬТРАЦИИ ПО ВРЕМЕНИ КОГДА МОЖНО ВЫБРАТЬ ТОЛЬКО 1 ФИЛЬТР
  const handleFilterTimeClick = (filter) => {
    const newFilters = Object.keys(filtersTimeSet).reduce((acc, key) => {
      acc[key] = false; // Устанавливаем каждый фильтр в false
      return acc;
    }, {});
    newFilters[filter] = true;
    setFiltersTimeSet(newFilters);
    applyFilters(newFilters, filtersTagSet);
  };

  //ЭТОТ МЕТОД ДЛЯ НОВОЙ ФИЛЬТРАЦИИ ПО ТЭГУ КОГДА МОЖНО ВЫБРАТЬ ТОЛЬКО 1 ФИЛЬТР
  const handleFilterTagClick = (filter) => {
    const newFilters = Object.keys(filtersTagSet).reduce((acc, key) => {
      acc[key] = false; // Устанавливаем каждый фильтр в false
      return acc;
    }, {});
    newFilters[filter] = true;
    setFiltersTagSet(newFilters);
      applyFilters(filtersTimeSet, newFilters);
  };

  /* //ЭТОТ МЕТОД ДЛЯ СТАРОЙ ФИЛЬТРАЦИИ ПО ВРЕМЕНИ КОГДА МОЖНО ВЫБРАТЬ НЕСКОЛЬКО
  const handleFilterTimeClick = (filter) => {
    if (filter === 'Всегда') {
      // Если выбран "Всегда", все фильтры времени становятся активными
      const newFilters = Object.keys(filtersTimeSet).reduce((acc, key) => {
        acc[key] = true; // Устанавливаем каждый фильтр в true
        return acc;
      }, {});
      setFiltersTimeSet(newFilters);
      applyFilters(newFilters, filtersTagSet);
    } else {
      // Для других фильтров инвертируем состояние фильтра
      setFiltersTimeSet((prevFilters) => {
        const newFilters = { ...prevFilters, [filter]: !prevFilters[filter] };
        // Если все фильтры времени (кроме "Всегда") одинаковые, включаем "Всегда"
        const { Всегда, ...newFiltersCheck } = newFilters;
        const allSame = Object.values(newFiltersCheck).every(val => val === true) || Object.values(newFiltersCheck).every(val => val === false);
        newFilters['Всегда'] = allSame;
        applyFilters(newFilters, filtersTagSet);
        return newFilters;
      });
    }
  };*/

  /* //ЭТОТ МЕТОД ДЛЯ СТАРОЙ ФИЛЬТРАЦИИ ПО ТЭГУ КОГДА МОЖНО ВЫБРАТЬ НЕСКОЛЬКО
  const handleFilterTagClick = (filter) => {
    if (filter === 'Все') {
      // Если выбран "Все", все теги становятся активными
      const newFilters = {
        ...Object.keys(filtersTagSet).reduce((acc, key) => {
          acc[key] = true; // Устанавливаем все теги, включая "Все", в true
          return acc;
        }, {})
      };
      setFiltersTagSet(newFilters);
      applyFilters(filtersTimeSet, newFilters);
      //console.log(newFilters)
    } else {
      // Для других фильтров инвертируем состояние фильтра
      setFiltersTagSet((prevFilters) => {
        const newFilters = { ...prevFilters, [filter]: !prevFilters[filter] };
        // Если все теги (кроме "Все") одинаковые, включаем "Все"
        const { Все, ...newFiltersCheck } = newFilters;
        const allSame = Object.values(newFiltersCheck).every(val => val === true) || Object.values(newFiltersCheck).every(val => val === false);
        newFilters['Все'] = allSame;
        applyFilters(filtersTimeSet, newFilters);
        //console.log(newFilters)
        return newFilters;
      });
    }
  };*/
  
  const applyFilters = (filtersTimeSet, filtersTagSet) => {
    const filtered = events.filter((event) => {
      // Фильтрация по времени
      const isTimeMatch = filtersTimeSet['Всегда'] ||  Object.keys(filtersTimeSet).some((filterKey) => {
        if (airtbleData.timeSetByEvents.has(filterKey) && filtersTimeSet[filterKey]) {
          if (filterKey === 'Сегодня') return event.isToday;
          if (filterKey === 'Завтра') return event.isTomorrow;
          if (filterKey === 'На этой неделе') return event.isThisWeek;
          if (filterKey === 'На следующей неделе') return event.atNextWeek;
          return true;
        }
        return false;
      });
      // Фильтрация по тегам
      const isTagMatch = Object.entries(filtersTagSet).some(([filterKey, isActive]) => {
        return isActive && event.eventTagList.includes(filterKey);
      });
      // Событие должно пройти оба фильтра (по времени и по тегам)
      return isTimeMatch && isTagMatch;
    });
    // Обновляем отфильтрованные события    
    setFilteredEvents(filtered);
  };

  //подсчёт клика
  const countClick = async (inputText) => {
    /*try {
      await axios.post('http://localhost:5000/clickcount', {
        text: inputText,
      });
    } catch (error) {
      console.error('Ошибка при добавлении записи:', error);
    }*/
  };

  return (
    <div className="lg:flex flex-col gap-8 p-4 pb-24 bg-[#222221] text-[#70706c]">

      
      <div className="py-12">
        <div className="pb-2 lg:pl-6">
            <h1 className="text-5xl font-[600] text-[#FDFCF6]">События Барселоны</h1>
            <div className="pt-2 lg:pt-0 py-1 text-2xl font-[300] text-[#676767]">{airtbleData.globalTimeSpan}</div>
        </div>

        <div className="lg:px-6 pt-4 pb-4 sticky z-20 bg-[#222221] top-0 overflow-x-scroll lg:overflow-hidden">
  <ul className="flex gap-3 text-center text-sm text-[#9c9c9c] whitespace-nowrap">
    
    {/* Временные фильтры */}
    {Array.from(airtbleData.timeSetByEvents).map((timeTag, index) => (
      <li key={index}>
        <button
          className={`min-w-24 px-3 py-1.5 border rounded-full border-[#9c9c9c] bg-none hover:text-white cursor-pointer text-[#666666] font-[500] ${
            filtersTimeSet[timeTag] ? 'bg-white text-[#333333] hover:text-black' : ''
          }`}
          onClick={() => {
            handleFilterTimeClick(timeTag);
            countClick(filtersTimeSet[timeTag] ? `filter off: ${timeTag}` : `filter on: ${timeTag}`);
          }}
        >
          {timeTag}
        </button>
      </li>
    ))}

    {/* Разделитель */}
    <li>
      <div className="w-px h-8 bg-gray-400 mx-1" />
    </li>

    {/* Сущностные фильтры */}
    {Array.from(airtbleData.tagsSetByEvents).map((tag, index) => (
      
      <li key={index}>
        <button
          className={`min-w-24 px-3 py-1.5 border rounded-full border-[#9c9c9c] bg-none hover:text-white cursor-pointer text-[#666666] font-[500] ${
            filtersTagSet[tag] ? 'bg-white text-[#333333] hover:text-black' : ''
          }`}
          onClick={() => {
            handleFilterTagClick(tag);
            countClick(filtersTagSet[tag] ? `filter off: ${tag}` : `filter on: ${tag}`);
          }}
        >
          {tag}
        </button>
      </li>
    ))}
    
  </ul>
</div>

      {/* Контейнер для карточек */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-l border-t border-[#fdfdfd]/10 lg:mx-6 rounded-tl-2xl mt-4 lg:mt-0">
        {filteredEvents.map((event, index) => (
          <div key={index} className="cursor-pointer" 
            onClick={() => {
              handleCardClick(event);
              countClick('event card click: ' + event.title);
            }}>
            <EventCard {...event} />
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

