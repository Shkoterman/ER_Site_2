// Типы, которые отдаются на фронтенд
export type AirtableEventsData = {
  globalTimeSpan: string;
  events: AirtableEvent[];
  tagsSetByEvents: Set<string>;
  timeSetByEvents: Set<string>;
};

export type AirtableEvent = {
  id: string;
  title: string;
  time: string;
  date: string;
  weekDay: string;
  dataDay: string;
  dataMouth: string;
  dataTime: string;
  dataStr: string | undefined;
  placeName: string;
  placeAdres: string;
  placeLink: string;
  shortDescription: string;
  description: string;
  price: string;
  priceMore: string;
  imageUrl: string;
  isToday: boolean;
  isTomorrow: boolean;
  isThisWeek: boolean;
  atNextWeek: boolean;
  eventTagList: string[];
  eventTimeList: string[];
  eventExternalLink: string;
  eventProfeePagelLink: string;
  soldOut: boolean;
  ensaladaEvent: boolean;
  moreOnly: boolean;
};
