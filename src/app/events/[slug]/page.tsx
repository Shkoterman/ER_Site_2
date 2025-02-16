import React from 'react';
import type { Metadata } from 'next';

import { mapAirtableEvents } from '@/api/airtable/mapAirtableEvents';
import { fetchOneAirtableEvent } from '@/api/airtable/fetchOneAirtableEvent';
import { EventPage } from './EventPage';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params; // Разрешаем промис
  const data = await fetchOneAirtableEvent({ eventId: slug });
  const mappedData = mapAirtableEvents(data.records);
  const airtableEvent = mappedData.events.at(0);

  if (!airtableEvent) {
    return {
      title: 'ensalada - сообщество в Барселоне',
      description: 'Комьюнити в Барселоне',
    };
  }

  return {
    title: 'ensalada - ' + airtableEvent.title,
    description: airtableEvent.description,
  };
}

export default async function Event({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const parsedSlug = !Array.isArray(slug) ? (slug ?? '') : '';

  const data = await fetchOneAirtableEvent({ eventId: parsedSlug });
  const mappedData = mapAirtableEvents(data.records);
  const airtableEvent = mappedData.events.at(0);

  if (!airtableEvent) {
    return <p>Событие не найдено</p>;
  }

  return <EventPage airtableEvent={airtableEvent} />;
}
