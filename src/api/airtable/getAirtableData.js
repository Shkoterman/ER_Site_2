import axios from 'axios';

const AIRTABLE_API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY;
const BASE_ID = process.env.REACT_APP_BASE_ID;
const TABLE_NAME = process.env.REACT_APP_TABLE_NAME;

const VIEW_NAME = "for_web_calendar";
const fieldsToFetch = ['start_date', 'stop_date', 'str_date', 'dont_show_time', 
  'Name_event', 'short_description', 'event_discriptoin', 'cost_all', 'web_site_tag',
   'place_name', 'place_adres', 'place_link', 'Описание', 'image', 'web_site_tag', 'external_link', 'profee_page_link'];

export const getAirtableData = async () => {
  const fieldsQuery = fieldsToFetch.length ? fieldsToFetch.map(f => `fields[]=${encodeURIComponent(f)}`).join('&') : '';
  
  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?view=${VIEW_NAME}&${fieldsQuery}`;

  return await axios.get(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    },
  });
};