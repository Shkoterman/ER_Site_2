import React from 'react';
import '../App.css'; // Импортируем стили из App.css

const EventCard = ({ title, time, address, description, price, imageUrl, placeLink }) => {
  return (
    <div className="event-card">
      {/* Изображение на фоне сверху карточки */}
      <div
        className="event-card__image"
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>

      {/* Текстовая часть карточки */}
      <div className="event-card__content">
        <h3 className="event-card__title">{title}</h3>

        {time && <p className="event-card__text">{time}</p>}

        {address && <p className="event-card__text">{address}</p>}

        {/* Описание с обрезкой, если оно больше 4 строк */}
        {description && (
          <div className="event-card__description">
            <p>{description}</p>
            {/* Градиент для скрытия последней строки при большем тексте */}
            {description.length > 100 && (
              <div className="event-card__description-gradient" />
            )}
          </div>
        )}

        {price && (
          <p
            className="event-card__text"
            dangerouslySetInnerHTML={{ __html: `${price}` }}
          ></p>
        )}
      </div>
    </div>
  );
};

export default EventCard;
