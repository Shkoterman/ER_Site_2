import React, { useState, useEffect } from 'react';
import { fetchAirtableData } from '../api/api';
import EventCard from '../components/EventCard';
import '../App.css'; // Импортируем файл стилей

const Calendar_grid = () => {
  const [events, setEvents] = useState([]); // Локальное состояние для карточек

  // Обработчик нажатия на кнопку
  const handleUpdateData = async () => {
    const data = await fetchAirtableData(); // Получаем данные из Airtable
    if (data) {
      // Преобразуем данные из Airtable в формат для карточек
      const formattedEvents = data.map((record) => ({
        title: record.fields.Name_event || 'Без названия',
        time: record.fields.start_date_str ? (
          <span>
            <strong>Когда:</strong> {record.fields.start_date_str}
          </span>
        ) : (
          ''
        ),
        address:
          record.fields.adress_link && record.fields.adres_name ? (
            <span>
              <strong>Адрес:</strong>{' '}
              <a href={record.fields.adress_link} target="_blank" rel="noopener noreferrer">
                {record.fields.adres_name}
              </a>
            </span>
          ) : (
            ''
          ),
        description: record.fields.event_discriptoin || '',
        price: (() => {
          const costAll = record.fields.cost_all;
          const costMore = record.fields.cost_more;

          if (costAll === 0 && costMore === 0) {
            return '<strong>Цена: </strong>Бесплатно';
          }

          if (costAll === costMore && costAll >= 0) {
            return `${costAll}€`;
          }

          if (!costAll && costMore > 0) {
            return `<strong>Цена: </strong> ${costMore}€, только для <a href="https://t.me/ensaladaru/1319" target="_blank" rel="noopener noreferrer">ensalada.more</a>`;
          }

          if (!costMore && costAll > 0) {
            return `<strong>Цена: </strong> ${costAll}€`;
          }

          if (costAll > 0 && costMore > 0) {
            return `<strong>Цена: </strong> ${costAll}€, ${costMore}€ для <a href="https://t.me/ensaladaru/1319" target="_blank" rel="noopener noreferrer">ensalada.more</a>`;
          }

          return '';
        })(),
        imageUrl: record.fields.img_url || '',
        link: record.fields.Link || '#',
      }));
      setEvents(formattedEvents); // Обновляем состояние
    }
  };

  // Вызов handleUpdateData при загрузке компонента
  useEffect(() => {
    handleUpdateData();
  }, []); // Пустой массив зависимостей означает вызов только один раз при монтировании

  return (
    <div className="calendar-grid-container">
      {/* Кнопка для обновления данных */}
      <button
        onClick={handleUpdateData}
        className="update-button"
      >
        Обновить данные
      </button>

      {/* Контейнер для карточек */}
      <div className="event-cards-container">
        {events.map((event, index) => (
          <EventCard key={index} {...event} />
        ))}
      </div>
    </div>
  );
};

export default Calendar_grid;

