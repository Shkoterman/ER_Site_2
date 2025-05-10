import { AIRTABLE_API_KEY, BASE_ID, REG_TABLE_NAME } from './airtableConfig';

const AIRTABLE_API_URL = `https://api.airtable.com/v0/${BASE_ID}/${REG_TABLE_NAME}`;
console.log(AIRTABLE_API_URL);
export async function postAirtableRegistration({
  tgNick,
  name,
  eventId,
}: {
  tgNick: string;
  name?: string;
  eventId: string;
}) {
  try {
    const body = JSON.stringify({
      records: [
        {
          fields: {
            'You login in TG (reg)': tgNick,
            'Как тебя зовут (имя и фамилия)': name || '', // Если имени нет, отправляем пустую строку
            'Event for reg': [eventId], // Airtable требует массив
          },
        },
      ],
      typecast: true, // Принудительно конвертирует данные
    });

    console.log('Отправляем в Airtable:', body);

    const response = await fetch(AIRTABLE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
      body,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Ошибка при отправке в Airtable:', data);
      throw new Error(data.error?.message || 'Ошибка запроса');
    }

    return data;
  } catch (error) {
    console.error('Ошибка при отправке данных в Airtable:', error);
    throw error;
  }
}
