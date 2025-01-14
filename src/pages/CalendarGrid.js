import React, { useState, useEffect } from 'react';
import { formatAirtableData, tagList, timeList } from '../api/api';
import EventCard from '../components/EventCardV2';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Импортируем файл стилей



const Calendar_grid = () => {
  
  const [events, setEvents] = useState([]); // Локальное состояние для карточек
  const [filtersTimeSet, setFiltersTimeSet] = useState({}); // Состояние для активных фильтров времени 
  const [filtersTagSet, setFiltersTagSet] = useState({}); // Состояние для активных фильтров тэгов 
  const [filteredEvents, setFilteredEvents] = useState([]); // отфильтрованные события
  

  const navigate = useNavigate();

  const handleCardClick = (event) => {
    if (event.eventExternalLink !== "") {
      navigate('/event', { state: event }); // Переход на страницу события
    } if (event.eventProfeePagelLink !== "") {
      window.open(event.eventProfeePagelLink, '_blank'); // Открывает внешнюю ссылку в новой вкладке
    } else {
      return true;
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

  return (
    <div className="lg:flex gap-3 px-3 pb-24 bg-[#333033]">
      <div className="flex-1">
        <ul className="flex flex-col sticky top-4 bg-[#272527] rounded-xl px-6 py-8 gap-2 text-[#999999] w-[240px] text-[15px]">
          
          {/* кнопки для временных тэгов из timeList */}
          <li className="text-xs text-[#454545] py-2">КОГДА?</li>
          {Array.from(timeList).map((timeTag, index) => (
            <li key={index}>
              <span
                className={`p-2 hover:text-white cursor-pointer ${filtersTimeSet[timeTag] ? 'font-bold' : ''}`}
                onClick={() => handleFilterTimeClick(timeTag)}
              >
                {timeTag}
              </span>
            </li>
          ))}
          <li>
            <span
              className={`p-2 hover:text-white cursor-pointer ${filtersTimeSet['Всегда'] ? 'font-bold' : ''}`}
              onClick={() => handleFilterTimeClick('Всегда')}
            >
              Всегда
            </span>
          </li>
          
          {/* Отображаем кнопки для каждого тега из tagList */}
          <li className="text-xs text-[#454545] mt-4 py-2">КАК?</li>
          {Array.from(tagList).map((tag, index) => (
            <li key={index}>
              <span
                className={`p-2 hover:text-white cursor-pointer ${filtersTagSet[tag] ? 'font-bold' : ''}`}
                onClick={() => handleFilterTagClick(tag)}
              >
                {tag}
              </span>
            </li>
          ))}
          <li>
            <span
              className={`p-2 hover:text-white cursor-pointer ${filtersTagSet['Все'] ? 'font-bold' : ''}`}
              onClick={() => handleFilterTagClick('Все')}
            >
              Все
            </span>
          </li>
  
          <li className="text-xs text-[#454545] mt-4 py-2">ГДЕ?</li>
          <li><span className="p-2 hover:text-white cursor-pointer">HotSpot</span></li>
          <li><span className="p-2 hover:text-white cursor-pointer">В баре</span></li>
          <li><span className="p-2 hover:text-white cursor-pointer">На улице</span></li>
        </ul>
      </div>
  
      {/* Контейнер для карточек */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredEvents.map((event, index) => (
          <div key={index} onClick={() => handleCardClick(event)}>
            <EventCard {...event} />
          </div>
        ))}
      </div>
    </div>
  );
  

  

};

export default Calendar_grid;
