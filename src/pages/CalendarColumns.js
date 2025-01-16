import React, { useState, useEffect } from 'react';
import { formatAirtableData, tagList } from '../api/api';
import EventCard from '../components/EventCard';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Подключаем файл стилей

const CalendarColumns = () => {
  const [events, setEvents] = useState([]); // Локальное состояние для карточек
  const [filteredEvents, setFilteredEvents] = useState([]); // отфильтрованные события

  const navigate = useNavigate();

  const [filtersTagSet, setFiltersTagSet] = useState({}); // Состояние для активных фильтров тэгов 


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
      
    
      // Устанавливаем начальные значения для фильтров тегов
      const initialTagFilters = Array.from(tagList).reduce((acc, tag) => {
        acc[tag] = false;
        return acc;
      }, {});
      initialTagFilters['Все'] = true;
      setFiltersTagSet(initialTagFilters);

    };
    fetchData();
    
  }, []); // Пустой массив зависимостей означает вызов только один раз при монтировании

  // Группируем события по дате
  const groupedEvents = filteredEvents.reduce((groups, event) => {
    const eventDate = event.date;
    if (!groups[eventDate]) {
      groups[eventDate] = [];
    }
    groups[eventDate].push(event);
    return groups;
  }, {});

  // Форматирование даты с проверкой на валидность
  const formatDate = (dateStr) => {
    const [day, datePart] = dateStr.split(', ');
    const formattedDay = day.charAt(0).toUpperCase() + day.slice(1); // Заглавная буква в день недели
    return { day: formattedDay, datePart };
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
      applyFilters(newFilters);
      console.log(newFilters)
    } else {
      // Для других фильтров инвертируем состояние фильтра
      setFiltersTagSet((prevFilters) => {
        const newFilters = { ...prevFilters, [filter]: !prevFilters[filter] };
        // Если все теги (кроме "Все") одинаковые, включаем "Все"
        const { Все, ...newFiltersCheck } = newFilters;
        const allSame = Object.values(newFiltersCheck).every(val => val === true) || Object.values(newFiltersCheck).every(val => val === false);
        newFilters['Все'] = allSame;
        applyFilters(newFilters);
        console.log(newFilters)
        return newFilters;
      });
    }
  };

  const applyFilters = (filtersTagSet) => {
    const filtered = events.filter((event) => {
      // Фильтрация по тегам
      const isTagMatch = Object.entries(filtersTagSet).some(([filterKey, isActive]) => {
        return isActive && event.eventTagList.includes(filterKey);
      });

      // Событие должно пройти оба фильтра (по времени и по тегам)
      return isTagMatch;
    });

    // Обновляем отфильтрованные события
    
    setFilteredEvents(filtered);
  };


  return (
    <div className="overflow-x-auto w-full snap-x snap-mandatory">
      <div className="flex space-x-0 min-w-max min-h-screen pt-20">
        <div className="flex-1">
          <ul className="flex flex-col sticky top-4 bg-[#272527] rounded-xl px-6 py-8 gap-2 text-[#999999] w-[240px] text-[15px]">
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
          
          {/* юля сказала убрать покачто 
          <li className="text-xs text-[#454545] mt-4 py-2">ГДЕ?</li>
          <li><span className="p-2 hover:text-white cursor-pointer">HotSpot</span></li>
          <li><span className="p-2 hover:text-white cursor-pointer">В баре</span></li>
          <li><span className="p-2 hover:text-white cursor-pointer">На улице</span></li>*/}
        </ul>
      </div>
        {/* Контейнер для столбцов с датами и днями недели */}
        <div className="flex">
          
          {Object.keys(groupedEvents).map((date) => {
            const { day, datePart } = formatDate(date); // Получаем форматированную дату и день недели

            return (
              <div key={date} className="flex-shrink-0 snap-center px-1 border-r border-[#323232]/30 text-[#565656] text-center">
                {/* День недели (жирный) */}
                <div className="font-medium">{day}</div>
                {/* Число (дата) под днем недели */}
                <div className="">{datePart}</div>

                {/* Рендерим карточки для данной даты */}
                <div className="flex flex-col gap-2 mt-4">
                  {groupedEvents[date].map((event, index) => {
                    //const { day, datePart } = formatDate(event.date);

                    return (
                      // Оборачиваем в div, чтобы добавить обработчик onClick
                      <div 
                        key={index} 
                        onClick={() => handleCardClick(event)} 
                        className="cursor-pointer"
                      >
                        <EventCard {...event} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarColumns;
