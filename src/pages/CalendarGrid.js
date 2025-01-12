import React, { useState, useEffect } from 'react';
import { fetchAirtableData } from '../api/api';
import EventCard from '../components/EventCardV2';
import { parseISO, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { ru } from 'date-fns/locale'; // Для локализации на русский язык
import '../App.css'; // Импортируем файл стилей

const Calendar_grid = () => {
  const [events, setEvents] = useState([]); // Локальное состояние для карточек

  // Обработчик нажатия на кнопку
  const handleUpdateData = async () => {
    const data = await fetchAirtableData(); // Получаем данные из Airtable
    if (data) {
      // Преобразуем данные из Airtable в формат для карточек
      const formattedEvents = data.map((record) => {
        // Преобразование времени
        const utcDate = parseISO(record.fields.start_date); // Преобразуем ISO-строку в объект Date
        const barcelonaTime = toZonedTime(utcDate, 'Europe/Madrid'); // Переводим время в Барселонский часовой пояс
        const formattedTime = format(barcelonaTime, "dd MMMM 'в' HH:mm", { locale: ru }); // Форматируем дату и время
        const removeEmoji = (text) => {
          return text.replace(
            /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2764}\u{FE0F}\u{200B}\u{200C}\u{200D}\u{2060}\u{1F004}-\u{1F0CF}]/gu, ""
          );
        };
        const cleanTitle = removeEmoji(record.fields.Name_event || 'Без названия');
        return {
          title: cleanTitle,
          time: (
            <span>
              {formattedTime}
            </span>
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
          price: record.fields.cost_all,
          imageUrl: record.fields.img_url || '',
          link: record.fields.Link || '#',
        };
      });
      setEvents(formattedEvents); // Обновляем состояние
    }
  };

  // Вызов handleUpdateData при загрузке компонента
  useEffect(() => {
    handleUpdateData();
  }, []); // Пустой массив зависимостей означает вызов только один раз при монтировании

  return (
    <div className="lg:flex gap-6 px-6 pb-24">

      <div class="flex-1">
        <ul class="flex flex-col sticky top-4 bg-[#171717] rounded-xl p-8 gap-2 text-[#999999] max-w-[220px]">
            <li class="text-xs text-[#454545] py-2">КОГДА?</li>
            <li><a href="" class="p-2 hover:text-white">Сегодня</a></li>
            <li><a href="" class="p-2 hover:text-white">Завтра</a></li>
            <li><a href="" class="p-2 hover:text-white">На этой неделе</a></li>
            <li><a href="" class="p-2 hover:text-white">На выходных</a></li>
            
            <li class="text-xs text-[#454545] mt-4 py-2">КАК?</li>
            <li><a href="" class="p-2 hover:text-white">С детьми</a></li>
            <li><a href="" class="p-2 hover:text-white">Спортивно</a></li>
            <li><a href="" class="p-2 hover:text-white">Познавательно</a></li>
            <li><a href="" class="p-2 hover:text-white">Весело</a></li>
            <li><a href="" class="p-2 hover:text-white">Продуктивно</a></li>
      
            <li class="text-xs text-[#454545] mt-4 py-2">ГДЕ?</li>
            <li><a href="" class="p-2 hover:text-white">HotSpot</a></li>
            <li><a href="" class="p-2 hover:text-white">В баре</a></li>
            <li><a href="" class="p-2 hover:text-white">На улице</a></li>
        </ul>
      </div>

      {/* Контейнер для карточек */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {events.map((event, index) => (
          <EventCard key={index} {...event} />
        ))}
      </div>
    </div>
  );
};

export default Calendar_grid;
