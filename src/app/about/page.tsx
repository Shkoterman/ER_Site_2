import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function About() {
  return (
    <div className='pt-12 pb-24 lg:py-32 bg-[#191919]'>
      <div className='px-3 lg:px-0 max-w-3xl mx-auto'>
        <div className='max-w-2xl mx-auto text-[#676767] text-xs'>О НАС</div>
        <h1 className='max-w-2xl mx-auto text-4xl lg:text-5xl font-bold pt-3 text-[#fdfcf6]'>
          Наша история
        </h1>

        <div className='max-w-2xl mx-auto flex flex-col gap-8 py-8 text-[19px] leading-[32px] text-[#9c9c9c] font-[300]'>
          <p>
            Наше сообщество возникло в июне 2022 года. Тогда это был чатик из 20
            человек, оказавшихся в Барселоне в одиночестве, с кучей вопросов:
            где найти вкусный шоколад, как оплатить проезд, где взять адвоката
            для подачи на ВНЖ и, конечно, где самые вкусные огурцы.
          </p>

          <Image
            src={'/about_1.jpg'}
            className='py-4'
            alt='About'
            width={672}
            height={480}
          />

          <p>
            Со временем количество участников выросло до почти 7000 человек, а
            вопросы стали сложнее: Как выборы мэра Барселоны повлияют на нашу
            жизнь? Как мне найти настоящих друзей? Как мне реализоваться в новой
            стране? где найти вкусные чебуреки?
          </p>

          <p>Мы не всегда знаем точные ответы (кроме чебуреков).</p>

          <p>
            Мы исследуем город, проводим эксперименты и рассказываем вам самое
            интересное. Мы делаем мероприятия сами и рекомендуем, куда сходить в
            этом городе. Все, чтобы вы почувствовали себя здесь как дома.
          </p>

          <p>
            <Link
              href='/events'
              className='hover:text-[#fdfcf6] underline underline-offset-8'
            >
              Погнали с нами!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
