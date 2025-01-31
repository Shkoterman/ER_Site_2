import React from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { marked } from 'marked';
import '../App.css'; // Импортируем стили

const EventPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const event = location.state; // Получаем объект события через state

  //подсчёт клика
  const countClick = async (inputText) => {
    try {
      await axios.post('http://localhost:5000/clickcount', {
        text: inputText,
      });
      //setResponseMessage(response.data.message);
      //setInputText(''); // Очистка строки после успешной записи
    } catch (error) {
      console.error('Ошибка при добавлении записи:', error);
      //setResponseMessage('Ошибка при добавлении записи');
    }
  };

  const handleEventButtonClick = () => {
    if (event.eventExternalLink) {
      window.open(event.eventExternalLink, '_blank'); // Открывает ссылку в новой вкладке
      countClick('ext link: ' + event.title);
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

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  return (
    <div className='eventPage-container'>
      <button className='eventPage-button' onClick={handleBackButtonClick}>
        &lt;
      </button>
      <h1 className='eventPage-title'>{event.title}</h1>

      <img src={event.imageUrl} alt={event.title} className='eventPage-image' />
      <p className='eventPage-time'>{event.time}</p>

      {event.placeLink?.length > 0 ? (
        event.placeAdres?.length > 0 ? (
          <button
            className='eventPage-address-button'
            onClick={() =>
              handleAddressClick(event.placeName, event.placeAdres)
            }
          >
            {event.placeName}, {event.placeAdres}
          </button>
        ) : (
          <button
            className='eventPage-address-button'
            onClick={() =>
              handleAddressClick(event.placeName, event.placeAdres)
            }
          >
            {event.placeName}
          </button>
        )
      ) : event.placeAdres?.length > 0 ? (
        <p className='eventPage-address'>
          {event.placeName}, {event.placeAdres}
        </p>
      ) : (
        <p className='eventPage-address'>{event.placeName}</p>
      )}

      <p
        className='eventPage-description'
        dangerouslySetInnerHTML={{ __html: marked(event.description) }}
      />

      <p className='eventPage-price'>{event.price}</p>
      {/* Кнопка для открытия ссылки на ивент */}
      {event.eventExternalLink.length > 0 ? (
        <button className='eventPage-button' onClick={handleEventButtonClick}>
          Перейти на страницу события
        </button>
      ) : (
        ''
      )}

      {/* Временные теги */}
      <div className='eventPage-tags'>
        {event.isToday && <span className='eventPage-time-tag'>Сегодня</span>}
        {event.isTomorrow && <span className='eventPage-time-tag'>Завтра</span>}
        {event.isThisWeek && (
          <span className='eventPage-time-tag'>На этой неделе</span>
        )}
        {event.atWeekend && (
          <span className='eventPage-time-tag'>На выходных</span>
        )}
      </div>

      {/* Теги из eventTagList */}
      <div className='eventPage-tags'>
        {event.eventTagList
          .filter((tag) => tag !== 'Все') // Исключаем тег "Все"
          .map((tag, index) => (
            <span key={index} className='eventPage-tag'>
              {tag}
            </span>
          ))}
      </div>
    </div>
  );
};

export default EventPage;
