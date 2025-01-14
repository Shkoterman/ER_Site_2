import React from 'react';
import { useLocation } from 'react-router-dom';
import '../App.css'; // Импортируем стили

const EventPage = () => {
  const location = useLocation();
  const event = location.state; // Получаем объект события через state

  const handleButtonClick = () => {
    if (event.eventProfeePagelLink) {
      window.open(event.eventProfeePagelLink, '_blank'); // Открывает ссылку в новой вкладке
    } else {
      alert('Ссылка не найдена'); // Сообщение, если ссылка отсутствует
    }
  };

  return (
    <div className="eventPage-container">
      <h1 className="eventPage-title">{event.title}</h1>
      <img
        src={event.imageUrl}
        alt={event.title}
        className="eventPage-image"
      />
      <p className="eventPage-time">Время начала: {event.time}</p>
      <p className="eventPage-address">Адрес: {event.address}</p>
      <p className="eventPage-description">{event.description}</p>
      <p className="eventPage-price">Цена: {event.price}</p>

      {/* Кнопка для открытия ссылки */}
      <button 
        className="eventPage-button" 
        onClick={handleButtonClick}
      >
        Перейти на страницу события
      </button>

      {/* Временные теги */}
      <div className="eventPage-tags">
        {event.isToday && <span className="eventPage-time-tag">Сегодня</span>}
        {event.isTomorrow && <span className="eventPage-time-tag">Завтра</span>}
        {event.isThisWeek && <span className="eventPage-time-tag">На этой неделе</span>}
        {event.atWeekend && <span className="eventPage-time-tag">На выходных</span>}
      </div>

      {/* Теги из eventTagList */}
      <div className="eventPage-tags">
        {event.eventTagList
          .filter(tag => tag !== 'Все') // Исключаем тег "Все"
          .map((tag, index) => (
            <span key={index} className="eventPage-tag">
              {tag}
            </span>
          ))}
      </div>
    </div>
  );
};

export default EventPage;
