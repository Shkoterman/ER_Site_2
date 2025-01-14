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
  //console.log(filteredEvents)

  const navigate = useNavigate();

  const handleCardClick = (event) => {
    navigate('/event', { state: event });
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
      const newFilters = { 
        ...filtersTimeSet, 
        'Сегодня': true, 
        'Завтра': true, 
        'На этой неделе': true, 
        'На выходных': true, 
        'Всегда': true,
      };
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
          if (filterKey === 'На выходных') return event.atWeekend;
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
    <div className="lg:flex gap-6 px-6 pb-24">
      <div className="flex-1">
        <ul className="flex flex-col sticky top-4 bg-[#171717] rounded-xl p-8 gap-2 text-[#999999] max-w-[230px]">
          
          {/* кнопки для временных тэгов из timeList */}
          <li className="text-xs text-[#454545] py-2">КОГДА?</li>
          {Array.from(timeList).map((timeTag, index) => (
            <li key={index}>
              <a
                href="#"
                className={`p-2 hover:text-white ${filtersTimeSet[timeTag] ? 'font-bold' : ''}`}
                onClick={() => handleFilterTimeClick(timeTag)}
              >
                {timeTag}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#"
              className={`p-2 hover:text-white ${filtersTimeSet['Всегда'] ? 'font-bold' : ''}`}
              onClick={() => handleFilterTimeClick('Всегда')}
            >
              Всегда
            </a>
          </li>
          
          {/* Отображаем кнопки для каждого тега из tagList */}
          <li className="text-xs text-[#454545] mt-4 py-2">КАК?</li>
          {Array.from(tagList).map((tag, index) => (
            <li key={index}>
              <a
                href="#"
                className={`p-2 hover:text-white ${filtersTagSet[tag] ? 'font-bold' : ''}`}
                onClick={() => handleFilterTagClick(tag)}
              >
                {tag}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#"
              className={`p-2 hover:text-white ${filtersTagSet['Все'] ? 'font-bold' : ''}`}
              onClick={() => handleFilterTagClick('Все')}
            >
              Все
            </a>
          </li>

          <li className="text-xs text-[#454545] mt-4 py-2">ГДЕ?</li>
          <li><a href="#" className="p-2 hover:text-white">HotSpot</a></li>
          <li><a href="#" className="p-2 hover:text-white">В баре</a></li>
          <li><a href="#" className="p-2 hover:text-white">На улице</a></li>
        </ul>
      </div>

      {/* Контейнер для карточек */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
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
