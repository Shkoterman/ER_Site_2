import axios from 'axios';
import { parseISO, format, isToday, isTomorrow, isThisWeek, isWeekend } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { ru } from 'date-fns/locale'; // Для локализации на русский язык

// Конфигурация Airtable
const AIRTABLE_API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY;
const BASE_ID = process.env.REACT_APP_BASE_ID;
const TABLE_NAME = process.env.REACT_APP_TABLE_NAME;
const VIEW_NAME = "for_web_calendar";

// Локальный JSON для данных из Airtable
let cachedData = null;
let tagList = new Set(); // набор тэгов 
let timeList = new Set(); // набор времён (сегодня завтра вот это всё) 


export const fetchAirtableData = async () => {  // получаю данные из Airtable
  try {
    const response = await axios.get(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?view=${VIEW_NAME}`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      }
    );

    // Обновляем локальный кэш
    cachedData = response.data.records;

    return cachedData;
  } catch (error) {
    // Выводим ошибку в консоль
    console.error('Ошибка при запросе данных из Airtable:', error.message);

    // Дополнительно выводим информацию о коде ошибки, если доступно
    if (error.response) {
      console.error('Код ошибки:', error.response.status);
      console.error('Ответ сервера:', error.response.data);
    } else if (error.request) {
      console.error('Запрос был отправлен, но ответа не получено:', error.request);
    } else {
      console.error('Ошибка при настройке запроса:', error.message);
    }

    return cachedData; // Возвращаем кэшированные данные, если они есть
  }
};

export const checkCachedData = async () => {  // чек, есть ли кэшированая версия
  if (!cachedData || cachedData.length === 0) {
    //console.log('Данные отсутствуют в кэше, загружаем из Airtable...');
    await fetchAirtableData();
  } else {
    //console.log('Данные найдены в кэше.');
  }
};

export const formatAirtableData = async () => { // форматирую, собираю под карточки
  
  await checkCachedData();  //чек
  const data = cachedData;
  return data.map((record) => {
    //время
    const utcDate = parseISO(record.fields.start_date); //парс в ISO 
    const barcelonaTime = toZonedTime(utcDate, 'Europe/Madrid'); //часовой пояс
    const formattedTime = format(barcelonaTime, "dd MMMM 'в' HH:mm", { locale: ru }); //формат
    const formattedTimeForColumns = format(barcelonaTime, "EEEE, dd.MM", { locale: ru }); //формат

    const cleanTitle = record.fields.Name_event.replace(
        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2764}\u{FE0F}\u{200B}\u{200C}\u{200D}\u{2060}\u{1F004}-\u{1F0CF}\u{1F34A}-]/gu, ""
        );  //ябучие эможди
    const price = record.fields.cost_all === 0 ? "Бесплатно" : record.fields.cost_all+" €";
    
    // булевые поля времени
    const isTodayEvent = isToday(barcelonaTime);
    const isTomorrowEvent = isTomorrow(barcelonaTime);
    const isThisWeekEvent = isThisWeek(barcelonaTime, { weekStartsOn: 1 }); // 1- пшт неделя начинается с понедельника
    const atWeekendEvent = isWeekend(barcelonaTime) && isThisWeekEvent;

    // Добавляем временные теги в Set timeList
    if (isTodayEvent) timeList.add("Сегодня");
    if (isTomorrowEvent) timeList.add("Завтра");
    if (isThisWeekEvent) timeList.add("На этой неделе");
    if (atWeekendEvent) timeList.add("На выходных");

    // Добавляем теги в глобальный набор
    if (Array.isArray(record.fields.web_site_tag)) {
      record.fields.web_site_tag.forEach(tag => tagList.add(tag.trim())); // Добавляем теги в Set
    }
    return {
      title: cleanTitle,
      time: formattedTime,
      date: formattedTimeForColumns,
      address: record.fields.adres_name || '',
      description: record.fields.event_discriptoin || '',
      price: price,
      imageUrl: record.fields.img_url || '',
      isToday: isTodayEvent,
      isTomorrow: isTomorrowEvent,
      isThisWeek: isThisWeekEvent,
      atWeekend: atWeekendEvent,
      eventTagList: record.fields.web_site_tag ? [...record.fields.web_site_tag, 'Все'] : ['Все'], // Добавляем "Всегда" в eventTagList
      };
    });
  
};
export { tagList };
export { timeList };