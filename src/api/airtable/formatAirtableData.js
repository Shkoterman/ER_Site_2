import {
  parseISO,
  format,
  isToday,
  isTomorrow,
  isThisWeek,
  addWeeks,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
} from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { ru } from 'date-fns/locale'; // Для локализации на русский язык

export const formatAirtableData = ({ data }) => {
  if (!data || data.length === 0) {
    console.error('Ошибка: Нет данных после загрузки.');
  }

  //строка под события с по
  const firstDate = parseISO(data[0].fields.start_date);
  const lastDate = parseISO(data[data.length - 1].fields.start_date);
  const firstBarcelonaTime = toZonedTime(firstDate, 'Europe/Madrid');
  const lastBarcelonaTime = toZonedTime(lastDate, 'Europe/Madrid');

  const tagsSetByEvents = new Set()
  const timeSetByEvents = new Set()

  return {
    tagsSetByEvents,
    timeSetByEvents,
    globalTimeSpan: `${format(firstBarcelonaTime, "dd MMMM", { locale: ru })} - ${format(lastBarcelonaTime, 'dd MMMM', { locale: ru })}`,
    events: data.map((record) => {
      // Время

      const startDate = record.fields.start_date
        ? new Date(record.fields.start_date)
        : null;
      const stopDate = record.fields.stop_date
        ? new Date(record.fields.stop_date)
        : null;
      let formatedDataStr = record.fields.str_date;
      const dontShowTime = record.fields.dont_show_time || false;

      const barcelonaStartData = toZonedTime(startDate, 'Europe/Madrid'); // часовой пояс
      const barcelonaStopData = stopDate
        ? toZonedTime(stopDate, 'Europe/Madrid')
        : null; // часовой пояс

      const formattedTimeForColumns = format(
        barcelonaStartData,
        'EEEE, dd.MM',
        { locale: ru }
      ); // формат
      const formattedWeekDay = format(barcelonaStartData, 'EEEE', {
        locale: ru,
      }); // формат
      const formattedDataDay = format(barcelonaStartData, 'dd', { locale: ru }); // формат
      const formateddataMouth = format(barcelonaStartData, 'MM', {
        locale: ru,
      }); // формат
      let formatedStartTime = format(barcelonaStartData, 'HH:mm', {
        locale: ru,
      });

      let formattedStartData = format(barcelonaStartData, 'dd MMMM', {
        locale: ru,
      });
      if (!dontShowTime) {
        formattedStartData = formattedStartData + ', ' + formatedStartTime;
        if (stopDate) {
          formattedStartData =
            formattedStartData +
            ' — ' +
            format(barcelonaStopData, ' HH:mm', { locale: ru });
        }
      }

      //чек на показываение времени
      if (dontShowTime) formatedStartTime = '';

      // это всё для "и ещё 2 дня"
      // Функция для правильного склонения слова "день"
      const getDayWord = (num) => {
        if (num % 10 === 1 && num % 100 !== 11) return 'день';
        if ([2, 3, 4].includes(num % 10) && ![12, 13, 14].includes(num % 100))
          return 'дня';
        return 'дней';
      };

      if (formatedDataStr === undefined) {
        if (
          startDate &&
          barcelonaStopData &&
          startDate.getDate() !== barcelonaStopData.getDate()
        ) {
          //для подписки и ещё дней
          const dayDifference = Math.ceil(
            (barcelonaStopData - startDate) / (1000 * 60 * 60 * 24) - 1
          );
          formatedDataStr = `и ещё ${dayDifference} ${getDayWord(dayDifference)}`;

          //для с по на странице ивента
          if (format(startDate, 'MMMM') === format(barcelonaStopData, 'MMMM')) {
            formattedStartData =
              format(startDate, 'dd — ', { locale: ru }) +
              format(barcelonaStopData, 'dd MMMM', { locale: ru }); // формат с по
          } else {
            formattedStartData =
              format(startDate, 'dd MMMM — ', { locale: ru }) +
              format(barcelonaStopData, 'dd MMMM', { locale: ru }); // формат с по
          }
        }
      }

      // чистка имоджей
      const formateTitle =
        record.fields.Name_event?.replace(
          /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2764}\u{FE0F}\u{200B}\u{200C}\u{200D}\u{2060}\u{1F004}-\u{1F0CF}\u{1F34A}-]/gu,
          ''
        )?.trim() || ''; // Проверка на undefined

      //описание
      const formatedShortDescription =
        record.fields.short_description !== undefined
          ? record.fields.short_description
          : record.fields.event_discriptoin;

      const formatedPrice =
        record.fields.cost_all === 0
          ? 'Бесплатно'
          : record.fields.cost_all === undefined
            ? 'хз 🤷‍♂️'
            : record.fields.cost_all + ' €';

      // Булевые поля времени
      const isTodayEvent = isToday(barcelonaStartData);
      const isTomorrowEvent = isTomorrow(barcelonaStartData);
      const isThisWeekEvent = isThisWeek(barcelonaStartData, {
        weekStartsOn: 1,
      });

      if (isTodayEvent) timeSetByEvents.add('Сегодня');
      if (isTomorrowEvent) timeSetByEvents.add('Завтра');
      if (isThisWeekEvent) timeSetByEvents.add('На этой неделе');

      // Добавляем временные теги в Set timeList
      const nextWeekStart = startOfWeek(addWeeks(new Date(), 1), {
        weekStartsOn: 1,
      });
      const nextWeekEnd = endOfWeek(nextWeekStart, { weekStartsOn: 1 });
      const atNextWeekEvent = isWithinInterval(barcelonaStartData, {
        start: nextWeekStart,
        end: nextWeekEnd,
      });

      if (atNextWeekEvent) timeSetByEvents.add('На следующей неделе');

      if (Array.isArray(record.fields.web_site_tag)) {
        record.fields.web_site_tag.forEach((tag) =>
          tagsSetByEvents.add(tag.trim())
        ); // Добавляем теги в Set
      }

      return {
        title: formateTitle,
        time: formattedStartData,
        date: formattedTimeForColumns,
        weekDay: formattedWeekDay,
        dataDay: formattedDataDay,
        dataMouth: formateddataMouth,
        dataTime: formatedStartTime,
        dataStr: formatedDataStr,
        //FromToDate: formatedFromToDate,

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
        imageUrl: record.fields.image?.[0]?.url?.trim() || '', // Проверка на undefined
        isToday: isTodayEvent,
        isTomorrow: isTomorrowEvent,
        isThisWeek: isThisWeekEvent,
        atNextWeek: atNextWeekEvent,
        //eventTagList: record.fields.web_site_tag ? [...record.fields.web_site_tag, 'Все'] : ['Все'],
        eventExternalLink: record.fields.external_link?.trim() || '',
        eventProfeePagelLink: record.fields.profee_page_link?.trim() || '',
        tagsSetByEvents: tagsSetByEvents.add('Все'),
        timeSetByEvents: timeSetByEvents.add('Всегда'),

      };
    }),
  };
};
