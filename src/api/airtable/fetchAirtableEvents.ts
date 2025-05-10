import { BASE_ID, TABLE_NAME, AIRTABLE_API_KEY } from './airtableConfig';
import { EventsDTO } from './dtoTypes';
const VIEW_NAME = 'for_web_calendar';
const fieldsToFetch = [
  'start_date',
  'stop_date',
  'str_date',
  'dont_show_time',
  'Name_event',
  'short_description',
  'event_discriptoin',
  'cost_all',
  'web_site_tag',
  'place_name',
  'place_adres',
  'place_link',
  'Описание',
  'image',
  'web_site_tag',
  'external_link',
  'profee_page_link',
];

export const fetchAirtableEvents = async (): Promise<{
  records: EventsDTO;
}> => {
  const fieldsQuery = fieldsToFetch.length
    ? fieldsToFetch.map((f) => `fields[]=${encodeURIComponent(f)}`).join('&')
    : '';

  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?view=${VIEW_NAME}&${fieldsQuery}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
  }

  return res.json() as Promise<{ records: EventsDTO }>;
};
