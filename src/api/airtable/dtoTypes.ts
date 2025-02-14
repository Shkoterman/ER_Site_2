// Ответ, который ожидается от airtable
// Позволяет проверять по коду, что мы точно работаем с теми
// типами, которые пришли в ответе

// Эти типы не должны экспортироваться из папки /api
// Перед отправкой на фронтенд требуется маппинг типов
export type EventsDTO = EventDTO[];

export type EventDTO = {
  id: string;
  createdTime: string;
  fields: {
    Описание: string;
    short_description: string;
    str_date?: string;
    dont_show_time?: boolean;
    profee_page_link?: string;
    Name_event: string;
    web_site_tag: string[];
    external_link: string;
    image: ImageDTO[];
    event_discriptoin: string;
    stop_date: string;
    start_date: string;
    cost_all: number;
    place_adres: string[];
    place_name: string[];
    place_link: string[];
    cost_more: number;
    is_it_subscribers_only: boolean;
    Статус: string;
    'Свободных мест': number;
  };
};

type ImageDTO = {
  id: string;
  width: number;
  height: number;
  url: string;
  filename: string;
  size: number;
  type: string;
  thumbnails: {
    small: ImageSizeDTO;
    large: ImageSizeDTO;
    full: ImageSizeDTO;
  };
};

type ImageSizeDTO = {
  url: string;
  width: number;
  height: number;
};
