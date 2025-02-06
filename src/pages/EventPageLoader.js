import React from 'react';

import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { EventPage } from './EventPage';

import { getAirtableDataEvent } from '../api/airtable/getAirtableDataEvent';
import { QUERY_KEYS } from '../constants/queryKeys';

export const EventPageLoader = () => {
    const { eventId } = useParams();
    const eventParams = { eventId };
    const { isPending, isError, data, error } = useQuery({
        queryKey: [QUERY_KEYS.AIRTABLE_DATA, eventParams], // Используем ключ в виде объекта
        queryFn: () => getAirtableDataEvent(eventParams), // Передаем eventParams в queryFn
    });

    if (isPending) {
        return "Загрузочка...";
    }

    if (isError) {
        // Добавить экран ошибки
        console.error('Ошибка при запросе данных из Airtable:', error.message);
        return null;
    }

    return <EventPage data={data.records} />;
}; 