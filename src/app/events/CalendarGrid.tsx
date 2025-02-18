'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { EventCard } from './EventCard';
import { AirtableEvent, AirtableEventsData } from '@/api/airtable/types';

export const CalendarGrid = ({ airtableEventsData }: { airtableEventsData: AirtableEventsData }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [events] = useState(() => airtableEventsData.events);
  const [filteredEvents, setFilteredEvents] = useState(() => airtableEventsData.events);

  // Получаем фильтры из URL или задаем дефолтные
  const initialTimeFilter = searchParams.get('ft') || 'Всегда';
  const initialTagFilter = searchParams.get('fe') || 'Все';

  // Состояния фильтров
  const [filtersTimeSet, setFiltersTimeSet] = useState(() => {
    const timeFilters = Object.fromEntries(
      Array.from(airtableEventsData.timeSetByEvents).map((time) => [time, false])
    );
    timeFilters['Всегда'] = true;
    return { ...timeFilters, [initialTimeFilter]: true };
  });

  const [filtersTagSet, setFiltersTagSet] = useState(() => {
    const tagFilters = Object.fromEntries(
      Array.from(airtableEventsData.tagsSetByEvents).map((tag) => [tag, false])
    );
    tagFilters['Все'] = true;
    return { ...tagFilters, [initialTagFilter]: true };
  });

  useEffect(() => {
    applyFilters(filtersTimeSet, filtersTagSet);
  }, [filtersTimeSet, filtersTagSet]);

  // Метод для изменения URL
  const updateURL = (timeFilter: string, tagFilter: string) => {
    const params = new URLSearchParams();
    if (timeFilter !== 'Всегда') params.set('ft', timeFilter);
    if (tagFilter !== 'Все') params.set('fe', tagFilter);
    router.push(`/events?${params.toString()}`, { scroll: false });
  };

  // Выбор временного фильтра (ft)
  const handleFilterTimeClick = (filter: string) => {
    const newFilters = Object.fromEntries(Object.keys(filtersTimeSet).map((key) => [key, false]));
    newFilters[filter] = true;
    setFiltersTimeSet(newFilters);
    updateURL(filter, Object.keys(filtersTagSet).find((key) => filtersTagSet[key]) || 'Все');
  };

  // Выбор сущностного фильтра (fe)
  const handleFilterTagClick = (filter: string) => {
    const newFilters = Object.fromEntries(Object.keys(filtersTagSet).map((key) => [key, false]));
    newFilters[filter] = true;
    setFiltersTagSet(newFilters);
    updateURL(Object.keys(filtersTimeSet).find((key) => filtersTimeSet[key]) || 'Всегда', filter);
  };

  const applyFilters = (filtersTimeSet: Record<string, boolean>, filtersTagSet: Record<string, boolean>) => {
    const filtered = events.filter((event) => {
      const isTimeMatch = filtersTimeSet['Всегда'] || event.eventTimeList.some((time) => filtersTimeSet[time]);
      const isTagMatch = filtersTagSet['Все'] || event.eventTagList.some((tag) => filtersTagSet[tag]);
      return isTimeMatch && isTagMatch;
    });
    setFilteredEvents(filtered);
  };

  return (
    <div className='lg:flex flex-col gap-8 p-4 pb-24 bg-[#222221] text-[#70706c]'>
      <div className='py-12'>
        <h1 className='text-5xl font-[600] text-[#FDFCF6]'>События Барселоны</h1>
        <div className='pt-2 text-2xl font-[300] text-[#676767]'>{airtableEventsData.globalTimeSpan}</div>

        <div className='lg:px-6 pt-4 pb-4 sticky z-20 bg-[#222221] top-0 overflow-x-scroll lg:overflow-hidden'>
          <ul className='flex gap-3 text-sm text-[#9c9c9c] whitespace-nowrap'>
            {Array.from(airtableEventsData.timeSetByEvents).map((timeTag, index) => (
              <li key={index}>
                <button
                  className={`min-w-24 px-3 py-1.5 border rounded-full ${filtersTimeSet[timeTag] ? 'bg-white text-[#444]' : 'text-[#666]'}`}
                  onClick={() => handleFilterTimeClick(timeTag)}
                >
                  {timeTag}
                </button>
              </li>
            ))}
            <li><div className='w-px h-8 bg-gray-400 mx-1' /></li>
            {Array.from(airtableEventsData.tagsSetByEvents).map((tag, index) => (
              <li key={index}>
                <button
                  className={`min-w-24 px-3 py-1.5 border rounded-full ${filtersTagSet[tag] ? 'bg-white text-[#444]' : 'text-[#666]'}`}
                  onClick={() => handleFilterTagClick(tag)}
                >
                  {tag}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-l border-t border-[#fdfdfd]/10 lg:mx-6 rounded-tl-2xl mt-4'>
          {filteredEvents.map((event, index) => (
            <div key={index} className='cursor-pointer' onClick={() => router.push(`/events/${event.id}`)}>
              <EventCard airtableEvent={event} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
