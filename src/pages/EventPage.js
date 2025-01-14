import React from 'react';
import { useLocation } from 'react-router-dom';
import '../App.css'; // Импортируем стили

const EventPage = () => {
  const location = useLocation();
  const event = location.state; // Получаем объект события через state

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
      <div className="eventPage-tags">
        {event.isToday && <span className="eventPage-tag">Сегодня</span>}
        {event.isTomorrow && <span className="eventPage-tag">Завтра</span>}
        {event.isThisWeek && <span className="eventPage-tag">На этой неделе</span>}
        {event.atWeekend && <span className="eventPage-tag">На выходных</span>}
      </div>
    </div>
  );
};

export default EventPage;
