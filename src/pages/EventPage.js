import React from 'react';
import { useLocation } from 'react-router-dom';
import { marked } from 'marked';
import '../App.css'; // Импортируем стили

const cleanMarkdown = (markdown) => {
  // Убираем пробелы перед закрывающими знаками Markdown
  return markdown
    //.replace(/\s\*\*/g, '** ')   // Заменяем пробел перед ** на корректный
    //.replace(/\s~~/g, '~~ ')      // Заменяем пробел перед ~~ на корректный
    //.replace(/\s_/g, '_ ')
    //.replace(/\s--/g, '-- ');      // Заменяем пробел перед -- на корректный
    
};

const EventPage = () => {
  
  const location = useLocation();
  const event = location.state; // Получаем объект события через state
  const cleanedDescription = cleanMarkdown(event.description || '');

  const handleEventButtonClick = () => {
    if (event.eventExternalLink) {
      window.open(event.eventExternalLink, '_blank'); // Открывает ссылку в новой вкладке
    } else {
      alert('Ссылка не найдена'); // Сообщение, если ссылка отсутствует
    }
  };

  const handleAddressClick = () => {
    if (event.eventExternalLink) {
      window.open(event.placeLink, '_blank'); // Открывает ссылку в новой вкладке
    } else {
      alert('Ссылка не найдена'); // Сообщение, если ссылка отсутствует
    }
  };
  console.log(event.description)
  return (
    <div className="eventPage-container">
      
      <h1 className="eventPage-title">{event.title}</h1>

      <img
        src={event.imageUrl}
        alt={event.title}
        className="eventPage-image"
      />
      <p className="eventPage-time">Когда: {event.time}</p>

      {event.placeLink?.length > 0 ? (
        event.placeAdres?.length > 0 ? (
        <button
          className="eventPage-address-button"
          onClick={() => handleAddressClick(event.placeName, event.placeAdres)}
        >
          Где: {event.placeName}, {event.placeAdres}
        </button>
      ) : (
        <button
          className="eventPage-address-button"
          onClick={() => handleAddressClick(event.placeName, event.placeAdres)}
        >
          Где: {event.placeName}
        </button>))
           
      : (
        event.placeAdres?.length > 0 ? (
          <p className="eventPage-address">
            Где: {event.placeName}, {event.placeAdres}
          </p>
        ) : (
          <p className="eventPage-address">
            Где: {event.placeName}
          </p>
        )
      )}
      
      <p 
        className="eventPage-description" 
        dangerouslySetInnerHTML={{ __html: marked(cleanedDescription) }} 
      />     

      <p className="eventPage-price">Цена: {event.price}</p>

      {/* Кнопка для открытия ссылки */}
      <button 
        className="eventPage-button" 
        onClick={handleEventButtonClick}
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
