'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { EventCard } from './EventCard';
import { AirtableEvent, AirtableEventsData } from '@/api/airtable/types';

export const CalendarGrid = ({
  airtableEventsData,
}: {
  airtableEventsData: AirtableEventsData;
}) => {
  const router = useRouter();

  // Локальное состояние для карточек
  const [events] = useState(() => airtableEventsData.events);
  // Отфильтрованные события
  const [filteredEvents, setFilteredEvents] = useState(
    () => airtableEventsData.events
  );

  // Состояние для активных фильтров времени
  const [filtersTimeSet, setFiltersTimeSet] = useState(() => {
    const initialTimeFilters = Array.from(
      airtableEventsData.timeSetByEvents
    ).reduce<Record<string, boolean>>((acc, timeTag) => {
      acc[timeTag] = false;
      return acc;
    }, {});
    initialTimeFilters['Всегда'] = true;

    return initialTimeFilters;
  });

  // Состояние для активных фильтров тэгов
  const [filtersTagSet, setFiltersTagSet] = useState(() => {
    const initialTagFilters = Array.from(
      airtableEventsData.tagsSetByEvents
    ).reduce<Record<string, boolean>>((acc, tag) => {
      acc[tag] = false;
      return acc;
    }, {});
    initialTagFilters['Все'] = true;

    return initialTagFilters;
  });

  const handleCardClick = (event: AirtableEvent) => {
    router.push(`/events/${event.id}`);
  };

  //ЭТОТ МЕТОД ДЛЯ НОВОЙ ФИЛЬТРАЦИИ ПО ВРЕМЕНИ КОГДА МОЖНО ВЫБРАТЬ ТОЛЬКО 1 ФИЛЬТР
  const handleFilterTimeClick = (filter: string) => {
    const newFilters = Object.keys(filtersTimeSet).reduce<
      Record<string, boolean>
    >((acc, key) => {
      acc[key] = false; // Устанавливаем каждый фильтр в false
      return acc;
    }, {});

    newFilters[filter] = true;
    setFiltersTimeSet(newFilters);
    applyFilters(newFilters, filtersTagSet);
  };

  //ЭТОТ МЕТОД ДЛЯ НОВОЙ ФИЛЬТРАЦИИ ПО ТЭГУ КОГДА МОЖНО ВЫБРАТЬ ТОЛЬКО 1 ФИЛЬТР
  const handleFilterTagClick = (filter: string) => {
    const newFilters = Object.keys(filtersTagSet).reduce<
      Record<string, boolean>
    >((acc, key) => {
      acc[key] = false; // Устанавливаем каждый фильтр в false
      return acc;
    }, {});
    newFilters[filter] = true;
    setFiltersTagSet(newFilters);
    applyFilters(filtersTimeSet, newFilters);
  };

  const applyFilters = (
    filtersTimeSet: Record<string, boolean>,
    filtersTagSet: Record<string, boolean>
  ) => {
    const filtered = events.filter((event) => {
      // Фильтрация по времени
      const isTimeMatch =
        filtersTimeSet['Всегда'] || // Если "Всегда" = true, пропускаем проверку
        event.eventTimeList.some((time) => filtersTimeSet[time]); // Проверяем соответствие eventTimeList

      // Фильтрация по тегам
      const isTagMatch =
        filtersTagSet['Все'] || // Если "Все" = true, пропускаем проверку
        event.eventTagList.some((tag) => filtersTagSet[tag]); // Проверяем соответствие eventTagList

      return isTimeMatch && isTagMatch; // Оставляем только события, удовлетворяющие обоим фильтрам
    });

    setFilteredEvents(filtered); // Обновляем отфильтрованные события
  };

  return (
    <div className='lg:flex flex-col gap-8 p-4 pb-24 bg-[#222221] text-[#70706c]'>
      <div className='py-12'>
        <div className='pb-2 lg:pl-6'>
          <h1 className='text-5xl font-[600] text-[#FDFCF6]'>
            События Барселоны
          </h1>
          <div className='pt-2 lg:pt-0 py-1 text-2xl font-[300] text-[#676767]'>
            {airtableEventsData.globalTimeSpan}
          </div>
        </div>

        <div className='lg:px-6 pt-4 pb-4 sticky z-20 bg-[#222221] top-0 overflow-x-scroll lg:overflow-hidden'>
          <ul className='flex gap-3 text-center text-sm text-[#9c9c9c] whitespace-nowrap'>
            {/* Временные фильтры */}
            {Array.from(airtableEventsData.timeSetByEvents).map(
              (timeTag, index) => (
                <li key={index}>
                  <button
                    className={`min-w-24 px-3 py-1.5 border rounded-full border-[#9c9c9c] cursor-pointer font-[500] ${
                      filtersTimeSet[timeTag]
                        ? 'bg-white text-[#444444] hover:text-[#111111]'
                        : 'bg-none text-[#666666] hover:text-[#999999]'
                    }`}
                    onClick={() => {
                      handleFilterTimeClick(timeTag);
                    }}
                  >
                    {timeTag}
                  </button>
                </li>
              )
            )}

            {/* Разделитель */}
            <li>
              <div className='w-px h-8 bg-gray-400 mx-1' />
            </li>

            {/* Сущностные фильтры */}
            {Array.from(airtableEventsData.tagsSetByEvents).map(
              (tag, index) => (
                <li key={index}>
                  <button
                    className={`min-w-24 px-3 py-1.5 border rounded-full border-[#9c9c9c] cursor-pointer font-[500] ${
                      filtersTagSet[tag]
                        ? 'bg-white text-[#444444] hover:text-[#111111]'
                        : 'bg-none text-[#666666] hover:text-[#999999]'
                    }`}
                    onClick={() => {
                      handleFilterTagClick(tag);
                    }}
                  >
                    {tag}
                  </button>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Контейнер для карточек */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-l border-t border-[#fdfdfd]/10 lg:mx-6 rounded-tl-2xl mt-4 lg:mt-0'>
          {filteredEvents.map((event, index) => (
            <div
              key={index}
              className='cursor-pointer'
              onClick={() => {
                handleCardClick(event);
              }}
            >
              <EventCard airtableEvent={event} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
