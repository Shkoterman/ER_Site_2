import React, { useState, useEffect } from 'react';
import { formatAirtableData } from '../api/api';
import EventCard from '../components/EventCard';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Подключаем файл стилей

const CalendarColumns = () => {
  const [events, setEvents] = useState([]); // Локальное состояние для карточек
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
    };
    fetchData();
  }, []); // Пустой массив зависимостей означает вызов только один раз при монтировании

  // Группируем события по дате
  const groupedEvents = events.reduce((groups, event) => {
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

  return (
    <div className="overflow-x-auto w-full snap-x snap-mandatory">
      <div className="flex space-x-0 min-w-max min-h-screen pt-20">
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
