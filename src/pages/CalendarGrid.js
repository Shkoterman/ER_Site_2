import React, { useState, useEffect } from 'react';
import { formatAirtableData, tagList, timeList, globalTimeSpan } from '../api/api';
import EventCard from '../components/EventCardV2';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Импортируем файл стилей
import axios from 'axios';



const Calendar_grid = () => {
  
  const [events, setEvents] = useState([]); // Локальное состояние для карточек
  const [filtersTimeSet, setFiltersTimeSet] = useState({}); // Состояние для активных фильтров времени 
  const [filtersTagSet, setFiltersTagSet] = useState({}); // Состояние для активных фильтров тэгов 
  const [filteredEvents, setFilteredEvents] = useState([]); // отфильтрованные события
  

  const navigate = useNavigate();

  const handleCardClick = (event) => {
    if (event.eventProfeePagelLink !== "") {
      window.open(event.eventProfeePagelLink, '_blank'); // Открывает profee ссылку в нов вкладке
      //navigate('/event', { state: event }); // Переход на страницу события
    } else {
      navigate('/event', { state: event }); // Переход на страницу события
    }
  };
  
  

  useEffect(() => { // Вызов handleUpdateData при загрузке компонента
    const fetchData = async () => {
      const formattedEvents = await formatAirtableData();
      setEvents(formattedEvents); // Обновляем состояние
      setFilteredEvents(formattedEvents); // По умолчанию отображаем все события
      const initialTimeFilters = Array.from(timeList).reduce((acc, timeTag) => {
        acc[timeTag] = false;
        return acc;
      }, {});
      initialTimeFilters['Всегда'] = true;
    
      // Устанавливаем начальные значения для фильтров тегов
      const initialTagFilters = Array.from(tagList).reduce((acc, tag) => {
        acc[tag] = false;
        return acc;
      }, {});
      initialTagFilters['Все'] = true;
    
      setFiltersTimeSet(initialTimeFilters);
      setFiltersTagSet(initialTagFilters);
      
    };
    fetchData();
    
  }, []); // Пустой массив зависимостей означает вызов только один раз при монтировании

  const handleFilterTimeClick = (filter) => {
    if (filter === 'Всегда') {
      // Если выбран "Всегда", все фильтры времени становятся активными
      const newFilters = Object.keys(filtersTimeSet).reduce((acc, key) => {
        acc[key] = true; // Устанавливаем каждый фильтр в true
        return acc;
      }, {});
      setFiltersTimeSet(newFilters);
      applyFilters(newFilters, filtersTagSet);
      //console.log(newFilters)
    } else {
      // Для других фильтров инвертируем состояние фильтра
      setFiltersTimeSet((prevFilters) => {
        const newFilters = { ...prevFilters, [filter]: !prevFilters[filter] };
        // Если все фильтры времени (кроме "Всегда") одинаковые, включаем "Всегда"
        const { Всегда, ...newFiltersCheck } = newFilters;
        const allSame = Object.values(newFiltersCheck).every(val => val === true) || Object.values(newFiltersCheck).every(val => val === false);
        newFilters['Всегда'] = allSame;
        applyFilters(newFilters, filtersTagSet);
        //console.log(newFilters)
        return newFilters;
        
      });
    }
    
  };

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
  };
  
  const applyFilters = (filtersTimeSet, filtersTagSet) => {
    const filtered = events.filter((event) => {
      // Фильтрация по времени
      const isTimeMatch = filtersTimeSet['Всегда'] ||  Object.keys(filtersTimeSet).some((filterKey) => {
        if (timeList.has(filterKey) && filtersTimeSet[filterKey]) {
          if (filterKey === 'Сегодня') return event.isToday;
          if (filterKey === 'Завтра') return event.isTomorrow;
          if (filterKey === 'На этой неделе') return event.isThisWeek;
          if (filterKey === 'На следующей неделе') return event.atNextWeek;
          return true;
          
        }
        //console.log(event.shortDescription);
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
            <div className="pt-2 lg:pt-0 py-1 text-2xl font-[300] text-[#676767]">{globalTimeSpan}</div>
        </div>

        <div className="lg:px-6 pt-4 pb-4 sticky z-20 bg-[#222221] top-0 overflow-x-scroll lg:overflow-hidden">
  <ul className="flex gap-3 text-center text-sm text-[#9c9c9c] whitespace-nowrap">
    
    {/* Временные фильтры */}
    {Array.from(timeList).map((timeTag, index) => (
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

    {/* Сущностные фильтры */}
    {Array.from(tagList).map((tag, index) => (
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

export default Calendar_grid;
