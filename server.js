require('dotenv').config({ path: '.env' });
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Получение всех ивентов из Airtable
app.get('/api/events', async (req, res) => {
  try {
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const BASE_ID = process.env.BASE_ID;
    const TABLE_NAME = process.env.TABLE_NAME;
    const VIEW_NAME = process.env.VIEW_NAME;
    const fieldsToFetch = [
      'start_date',
      'stop_date',
      'str_date',
      'dont_show_time',
      'Name_event',
      'short_description',
      'event_discriptoin',
      'cost_all',
      'cost_more',
      'Свободных мест',
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

    const fieldsQuery = fieldsToFetch.length
      ? fieldsToFetch.map((f) => `fields[]=${encodeURIComponent(f)}`).join('&')
      : '';

    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?view=${VIEW_NAME}&${fieldsQuery}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    res.json(response.data); // Отправляем данные в клиент
  } catch (error) {
    console.error('Ошибка при запросе данных из Airtable1:', error.message);
    res.status(500).json({ error: 'Ошибка при запросе данных из Airtable2' });
  }
});

// только 1 ивент
app.get('/api/event/:eventId', async (req, res) => {
  try {
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const BASE_ID = process.env.BASE_ID;
    const TABLE_NAME = process.env.TABLE_NAME;
    const VIEW_NAME = process.env.VIEW_NAME;

    const eventId = req.params.eventId; // Получаем eventId из URL

    const fieldsToFetch = [
      'start_date',
      'stop_date',
      'str_date',
      'dont_show_time',
      'Name_event',
      'short_description',
      'event_discriptoin',
      'cost_all',
      'cost_more',
      'Свободных мест',
      'web_site_tag',
      'place_name',
      'place_adres',
      'place_link',
      'Описание',
      'image',
      'web_site_tag',
      'external_link',
      'profee_page_link',
      'is_it_subscribers_only',
      'Статус',
    ];

    const fieldsQuery = fieldsToFetch.length
      ? fieldsToFetch.map((f) => `fields[]=${encodeURIComponent(f)}`).join('&')
      : '';

    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?view=${VIEW_NAME}&filterByFormula=RECORD_ID()="${eventId}"&${fieldsQuery}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    // Отправляем данные клиенту
    res.json(response.data);
  } catch (error) {
    console.error('Ошибка при запросе данных из Airtable:', error.message);
    res.status(500).json({ error: 'Ошибка при запросе данных из Airtable' });
  }
});

// POST маршрут для регистрации в Airtable
app.post('/api/register', async (req, res) => {
  try {
    const { tgNick, name, eventId } = req.body;
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const BASE_ID = process.env.BASE_ID;
    const REG_TABLE_NAME = process.env.REG_TABLE_NAME;

    if (!tgNick || !name || !eventId) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    const url = `https://api.airtable.com/v0/${BASE_ID}/${REG_TABLE_NAME}`;
    const response = await axios.post(
      url,
      {
        fields: {
          'You login in TG (reg)': tgNick,
          'Как тебя зовут (имя и фамилия)': name,
          'Event for reg': eventId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(201).json(response.data);
  } catch (error) {
    console.error('Ошибка при добавлении записи в Airtable:', error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
