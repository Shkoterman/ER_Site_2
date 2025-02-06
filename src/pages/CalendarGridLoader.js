import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarGrid } from './CalendarGrid';

import { getAirtableDataAllEvents } from '../api/airtable/getAirtableDataAllEvents';
import { QUERY_KEYS } from '../constants/queryKeys';

export const CalendarGridLoader = () => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: QUERY_KEYS.AIRTABLE_DATA,
    queryFn: getAirtableDataAllEvents,
  });

  if (isPending) {
    return null;
  }

  if (isError) {
    // Добавить экран ошибки
    console.error('Ошибка при запросе данных из Airtable:', error.message);
    return null;
  }

  return <CalendarGrid data={data.records} />;
};
