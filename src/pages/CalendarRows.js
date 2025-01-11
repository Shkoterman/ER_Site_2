import React, { useState, useEffect } from 'react';
import { fetchAirtableData } from '../api/api';
import EventCard from '../components/EventCard';
import { format, isValid, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale'; // Для локализации на русский язык
import { toZonedTime } from 'date-fns-tz'; // Исправленный импорт
import '../App.css'; // Импортируем файл стилей

const CalendarRows = () => {
  const [events, setEvents] = useState([]); // Локальное состояние для карточек

  // Обработчик нажатия на кнопку
  const handleUpdateData = async () => {
    const data = await fetchAirtableData(); // Получаем данные из Airtable
    if (data) {
      // Преобразуем данные из Airtable в формат для карточек
      const formattedEvents = data.map((record) => {
        // Преобразуем дату в Барселонский часовой пояс
        const eventDateStr = record.fields.start_date;
        let eventDate = eventDateStr ? parseISO(eventDateStr) : null;
        
        if (eventDate) {
          // Конвертируем время в Барселону с учётом летнего времени
          eventDate = toZonedTime(eventDate, 'Europe/Madrid');
        }

        return {
          title: record.fields.Name_event || 'Без названия',
          time: eventDate ? (
            <span>
              <strong>Когда:</strong> {format(eventDate, 'dd.MM, HH:mm', { locale: ru })}
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
          date: record.fields.start_date || '', // Добавляем дату для группировки
        };
      });
      setEvents(formattedEvents); // Обновляем состояние
    }
  };

  // Вызов handleUpdateData при загрузке компонента
  useEffect(() => {
    handleUpdateData();
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
    const date = new Date(dateStr);
    if (isValid(date)) {
      const formattedDate = format(date, 'EEEE, dd.MM', { locale: ru }); // Форматируем как "суббота, 11.01"
      const [day, datePart] = formattedDate.split(', ');
      const formattedDay = day.charAt(0).toUpperCase() + day.slice(1); // Заглавная буква в день недели
      return { day: formattedDay, datePart };
    }
    return { day: '', datePart: '' }; // Если дата не валидная, возвращаем пустые строки
  };

  return (
    <div className="calendar-rows-container">
      {/* Кнопка для обновления данных */}
      <button onClick={handleUpdateData} className="update-button">
        Обновить данные
      </button>

      {/* Контейнер для карточек */}
      <div className="events-container-rows">
        {Object.keys(groupedEvents).map((date, index) => {
          const { day, datePart } = formatDate(date); // Получаем форматированную дату и день недели

          return (
            <div key={date}>
              <div className="date-row">
                {/* День недели (жирный) */}
                <div className="day">{day}</div>
                {/* Число (дата) под днем недели */}
                <div className="date-part">{datePart}</div>

                {/* Рендерим карточки для данной даты */}
                <div className="event-cards">
                  {groupedEvents[date].map((event, index) => (
                    <EventCard key={index} {...event} />
                  ))}
                </div>
              </div>
              {/* Разделительная линия */}
              {index !== Object.keys(groupedEvents).length - 1 && <hr className="divider" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarRows;

