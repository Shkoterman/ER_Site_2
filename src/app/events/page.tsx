import React from 'react';
import { CalendarGrid } from './CalendarGrid';

import { fetchAirtableEvents } from '@/api/airtable/fetchAirtableEvents';
import { mapAirtableEvents } from '@/api/airtable/mapAirtableEvents';

export const dynamic = 'force-dynamic';

export default async function Events() {
  const data = await fetchAirtableEvents();
  const mappedData = mapAirtableEvents(data.records);

  return <CalendarGrid airtableEventsData={mappedData} />;
}
