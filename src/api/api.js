import axios from 'axios';
import { parseISO, format, isToday, isTomorrow, isThisWeek, addWeeks, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
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
let globalTimeSpan = String();

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

export const formatAirtableData = async () => {
  await checkCachedData(); // чек
  const data = cachedData;
  
  //строка под события с по
  const firstDate = parseISO(data[0].fields.start_date);
  const lastDate = parseISO(data[data.length - 1].fields.start_date);
  const firstBarcelonaTime = toZonedTime(firstDate, 'Europe/Madrid');
  const lastBarcelonaTime = toZonedTime(lastDate, 'Europe/Madrid');
  globalTimeSpan = `${format(firstBarcelonaTime, "dd MMMM", { locale: ru })} - ${format(lastBarcelonaTime, "dd MMMM", { locale: ru })}`;
  

  return data.map((record) => {
    // Время
    const utcDate = parseISO(record.fields.start_date); // парс в ISO
    const barcelonaTime = toZonedTime(utcDate, 'Europe/Madrid'); // часовой пояс
    const formattedTime = format(barcelonaTime, "dd MMMM 'в' HH:mm", { locale: ru }); // формат
    const formattedTimeForColumns = format(barcelonaTime, "EEEE, dd.MM", { locale: ru }); // формат
    const formattedWeekDay = format(barcelonaTime, "EEEE", { locale: ru }); // формат
    const formattedDataDay = format(barcelonaTime, "dd", { locale: ru }); // формат
    const formateddataMouth = format(barcelonaTime, "MM", { locale: ru }); // формат
         
    //чек на показываение времени
    let formatedDataTime = format(barcelonaTime, "HH:mm", { locale: ru }); // формат
    const dontShowTime = record.fields.dont_show_time || false;
    if (dontShowTime) formatedDataTime = "";

    // это всё для "и ещё 2 дня"    
    const startDate = record.fields.start_date ? new Date(record.fields.start_date) : null;
    const stopDate = record.fields.stop_date ? new Date(record.fields.stop_date) : null;
    const dayDifference = Math.ceil(((stopDate - startDate) / (1000 * 60 * 60 * 24))-1);
    let formatedDataStr = record.fields.str_date;
    if (startDate && stopDate && startDate.getDate() !== stopDate.getDate()) {
      if (formatedDataStr === undefined) {
        // Функция для правильного склонения слова "день"
        const getDayWord = (num) => {
          if (num % 10 === 1 && num % 100 !== 11) return "день";
          if ([2, 3, 4].includes(num % 10) && ![12, 13, 14].includes(num % 100)) return "дня";
          return "дней";
        };

        formatedDataStr = `и ещё ${dayDifference} ${getDayWord(dayDifference)}`;
      } else {
      }
    } else {
      formatedDataStr = "";
    }
    
    // чистка имоджей
    const formateTitle = record.fields.Name_event?.replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2764}\u{FE0F}\u{200B}\u{200C}\u{200D}\u{2060}\u{1F004}-\u{1F0CF}\u{1F34A}-]/gu,
      ""
    )?.trim() || ''; // Проверка на undefined

    //описание 
    const formatedShortDescription = record.fields.short_description !== undefined
      ? record.fields.short_description
      : record.fields.event_discriptoin;
    
    const formatedPrice = record.fields.cost_all === 0 ? "Бесплатно" : record.fields.cost_all + " €";

    // Булевые поля времени
    const isTodayEvent = isToday(barcelonaTime);
    const isTomorrowEvent = isTomorrow(barcelonaTime);
    const isThisWeekEvent = isThisWeek(barcelonaTime, { weekStartsOn: 1 });
    
    // Добавляем временные теги в Set timeList
    const nextWeekStart = startOfWeek(addWeeks(new Date(), 1), { weekStartsOn: 1 });
    const nextWeekEnd = endOfWeek(nextWeekStart, { weekStartsOn: 1 });
    const atNextWeekEvent = isWithinInterval(barcelonaTime, { start: nextWeekStart, end: nextWeekEnd });
    if (isTodayEvent) timeList.add("Сегодня");
    if (isTomorrowEvent) timeList.add("Завтра");
    if (isThisWeekEvent) timeList.add("На этой неделе");
    if (atNextWeekEvent) timeList.add("На следующей неделе");

    // Добавляем теги в глобальный набор
    if (Array.isArray(record.fields.web_site_tag)) {
      record.fields.web_site_tag.forEach(tag => tagList.add(tag.trim())); // Добавляем теги в Set
    }
    console.log(record.fields.event_discriptoin);
    return {
      title: formateTitle,
      time: formattedTime,
      date: formattedTimeForColumns,
      weekDay: formattedWeekDay,
      dataDay: formattedDataDay,
      dataMouth: formateddataMouth,
      dataTime: formatedDataTime,
      dataStr: formatedDataStr,
      
      placeName: record.fields.place_name 
      ? record.fields.place_name[0]?.trim() || '' 
      : '',    
      placeAdres: record.fields.place_adres 
      ? record.fields.place_adres[0]?.trim() || '' 
      : '',    
      placeLink: record.fields.place_link 
      ? record.fields.place_link[0]?.trim() || '' 
      : '',
      shortDescription: formatedShortDescription,
      description: record.fields['Описание']?.trim() || '', // Проверка на undefined
      price: formatedPrice,
      imageUrl: record.fields.img_url?.trim() || '', // Проверка на undefined
      isToday: isTodayEvent,
      isTomorrow: isTomorrowEvent,
      isThisWeek: isThisWeekEvent,
      atNextWeek: atNextWeekEvent,
      eventTagList: record.fields.web_site_tag ? [...record.fields.web_site_tag, 'Все'] : ['Все'],
      eventExternalLink: record.fields.external_link?.trim() || '',
      eventProfeePagelLink: record.fields.profee_page_link?.trim() || '',
      
    };
  });
};

export { tagList };
export { timeList };
export { globalTimeSpan };