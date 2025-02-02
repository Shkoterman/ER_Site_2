'use client';
import React from 'react';
import Image from 'next/image';

import { marked } from 'marked';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AirtableEvent } from '@/api/airtable/types';
import { useRouter } from 'next/navigation';

export const EventPage = ({
  airtableEvent,
}: {
  airtableEvent: AirtableEvent;
}) => {
  const router = useRouter();

  const [showQuickReg, setShowQuickReg] = useState(false);
  const [tgNick, setTgNick] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const quickRegForm = () => {
    setShowQuickReg(true);
    setIsSubmitted(false); // Сбрасываем флаг отправки, если форма открывается снова
  };

  const checkQuickRegData = () => {
    if (!tgNick.trim()) {
      setError('Это обязательное поле');
      return;
    }

    setError('');
    // sendQuickRegData({ tgNick, name });

    // Запускаем анимацию скрытия формы перед показом сообщения
    setTimeout(() => {
      setShowQuickReg(false);
      setIsSubmitted(true);
    }, 500);
  };

  // const sendQuickRegData = () => {
  //   console.log("отправка реги", tgNick, name)
  // };

  //console.log(event)
  const handleBackButtonClick = () => {
    router.back();
  };

  return (
    <div className='bg-[#1d1d20] text-[#a2a2a7] font-sans leading-normal tracking-normal px-2 w-full'>
      <div className='max-w-5xl mx-auto relative'>
        <div className='pt-[300px] lg:pt-20 lg:flex'>
          <div className='flex-none lg:w-2/3 px-3 lg:px-0 lg:pr-12'>
            <div className='py-2 text-sm font-[300]'>
              <button
                className='text-[#565656] inline-block -ml-2 pl-2 pr-4 py-2 rounded-lg hover:bg-[#151516]'
                onClick={handleBackButtonClick}
              >
                &larr; вернуться
              </button>
            </div>
            <h1 className='text-4xl lg:text-5xl font-[600] text-[#FDFCF6] pt-4 lg:pt-16'>
              {airtableEvent.title}
            </h1>
            <div className='pt-0 lg:pt-1 py-1 text-xl lg:text-2xl font-[300] text-[#676767]'>
              {airtableEvent.time}
            </div>
            <div className='flex gap-2 text-sm mb-8 mt-4'>
              {[...airtableEvent.eventTimeList, ...airtableEvent.eventTagList]
                .filter((tag) => tag !== 'Все') // Убираем "Все"
                .map((tag, index) => (
                  <div
                    key={index}
                    className='border border-[#FDFCF6]/20 rounded-full px-4 py-1'
                  >
                    {tag}
                  </div>
                ))}
            </div>
            <div className='font-[200] lg:text-[18px] lg:leading-[28px] flex flex-col gap-6 pb-16'>
              <p
                dangerouslySetInnerHTML={{
                  __html: marked(airtableEvent.description),
                }}
              />
            </div>
          </div>
          <div className='flex-none lg:w-1/3 px-3 lg:p-4'>
            {/* Виджет картинки */}
            {airtableEvent.imageUrl && (
              <Image
                className='absolute lg:relative top-0 left-0 object-cover w-full h-[300px] z-1 rounded-2xl mr-0 mt-0 opacity-90'
                src={airtableEvent.imageUrl}
                alt='Event'
                width={500}
                height={300}
              />
            )}

            {/* Виджет даты */}
            <div className='flex rounded-2xl px-6 py-2 mt-4 bg-[#151516]'>
              <div className='flex-1 pt-4 font-[Commissioner] pr-3 pb-2'>
                <div className='text-[64px] leading-[48px] font-[600]'>
                  <span className='tracking-tighter text-white/80'>
                    {airtableEvent.dataDay}
                  </span>
                  <span className='text-lg font-[300] px-0 opacity-80'>
                    /{airtableEvent.dataMouth}
                  </span>
                </div>
                <div className='text-base font-[500] uppercase pt-0'>
                  {airtableEvent.weekDay}
                </div>
              </div>
              <div className='flex-1 py-4 text-white/80 border-l border-white/10 pl-6'>
                <div className='text-[13px] font-[500] uppercase pt-0'>
                  {airtableEvent.dataStr}
                </div>
              </div>
            </div>

            {/* Виджет место и время */}
            {airtableEvent.placeName && (
              <div className='bg-[#151516] rounded-2xl px-4 py-6 mt-4'>
                <div className='px-4 pt-0 pb-0 text-[#FDFCF6] font-[500]'>
                  Место и время
                </div>
                <div className='text-[#898989] mx-0 mt-2 mb-0 px-4 py-0 text-base font-[300] flex flex-col gap-0'>
                  {airtableEvent.placeName}
                  {airtableEvent.placeAdres &&
                    `, ${airtableEvent.placeAdres}`}{' '}
                  <br /> {airtableEvent.dataTime}
                  {airtableEvent.placeLink && (
                    <div className='text-sm'>
                      <a
                        href={airtableEvent.placeLink}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-[#595959] underline underline-offset-4'
                      >
                        Посмотреть на карте
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Виджет стоимости и участия если это наш ивент только для море */}
            {airtableEvent.ensaladaEvent && airtableEvent.moreOnly && (
              <div className='bg-[#151516] rounded-2xl px-4 py-6 mt-4 flex flex-col items-center'>
                <div className='px-4 pt-2 pb-0 text-[#FDFCF6] text-4xl font-[500] text-center'>
                  {airtableEvent.priceMore}
                </div>

                <button
                  className='bg-[#E1B71C] text-[#272527] mt-4 px-4 py-3 rounded-xl text-lg font-[700] flex place-content-center w-[calc(100%-16px)] mx-auto'
                  onClick={() =>
                    window.open(
                      'https://t.me/ensalada/3434',
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }
                >
                  Только с подпиской more
                </button>

                <div className='text-right text-sm px-1 pt-2'>
                  <a className='text-[#595959] underline underline-offset-4'></a>
                </div>
              </div>
            )}

            {/* Виджет стоимости и участия если это наш ивент для всех */}
            {airtableEvent.ensaladaEvent && !airtableEvent.moreOnly && (
              <div className='bg-[#151516] rounded-2xl px-4 py-6 mt-4 flex flex-col items-center'>
                <div className='px-4 pt-2 pb-0 text-[#FDFCF6] text-4xl font-[500] text-center'>
                  {airtableEvent.price}
                </div>

                <button
                  className='bg-[#E1B71C] text-[#272527] mt-4 px-4 py-3 rounded-xl text-lg font-[700] flex place-content-center w-[calc(100%-16px)] mx-auto'
                  onClick={() =>
                    airtableEvent.eventProfeePagelLink
                      ? window.open(
                          airtableEvent.eventProfeePagelLink,
                          '_blank',
                          'noopener,noreferrer'
                        )
                      : quickRegForm()
                  }
                >
                  {airtableEvent.eventProfeePagelLink
                    ? 'Регистрация и оплата'
                    : 'Регистрация'}
                </button>

                {airtableEvent.priceMore < airtableEvent.price && (
                  <div className='text-right text-sm px-1 pt-2'>
                    <a
                      href='https://t.me/ensalada/3434'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[#595959] underline underline-offset-4'
                    >
                      или {airtableEvent.priceMore} с подпиской .more
                    </a>
                  </div>
                )}

                {/* Форма быстрой регистрации */}
                <AnimatePresence mode='wait'>
                  {showQuickReg && (
                    <motion.div
                      className='w-full px-4 mt-4 flex flex-col gap-3'
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <input
                        type='text'
                        placeholder='@tg ник'
                        value={tgNick}
                        onChange={(e) => setTgNick(e.target.value)}
                        className='w-full px-4 py-2 rounded-lg bg-[#272527] text-white placeholder-[#595959] border border-[#595959]/50'
                      />
                      {error && (
                        <div className='text-red-500 text-sm'>{error}</div>
                      )}

                      <input
                        type='text'
                        placeholder='имя*'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='w-full px-4 py-2 rounded-lg bg-[#272527] text-white placeholder-[#595959] border border-[#595959]/50'
                      />

                      <button
                        className='bg-[#E1B71C] text-[#272527] mt-4 px-4 py-3 rounded-xl text-lg font-[700] flex place-content-center w-[calc(100%)] mx-auto'
                        onClick={checkQuickRegData}
                      >
                        Отправить заявку
                      </button>
                    </motion.div>
                  )}

                  {isSubmitted && (
                    <motion.div
                      className='text-green-500 text-lg font-semibold text-center mt-4'
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5, delay: 0.5 }} // Добавил задержку, чтобы надпись появилась после скрытия формы
                    >
                      Заявка отправлена
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* SOLD OUT */}
            {airtableEvent.soldOut && (
              <div className='bg-white text-[#272527] my-4 px-6 py-4 rounded-2xl text-lg font-[700]'>
                <div className='text-center text-3xl pt-0.5'>SOLD OUT</div>
              </div>
            )}

            {/* отсались вопросы */}
            {/* <div className="pt-16 pb-4 text-[#FDFCF6] font-[500]">
              Остались вопросы?
            </div>
            <div className="flex gap-4 mb-24">
              <div>
                <img
                  src={org_logo}
                  className="rounded-full border w-16 h-16"
                  alt="Organizer"
                />
              </div>
              <div className="text-sm">
                <div className="text-sm font-[400] pt-0 text-[#565656]">
                  енсалада
                </div>
                <div className="text-lg text-[300] text-[#FDFCF6] -mt-1">
                  @ensalaga_org
                </div>
                <a href="https://t.me/ensalada_org" className="text-[#565656] underline">
                  написать
                </a>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
