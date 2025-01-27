import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImage from './img/logo_ensalada.png';

const Header = ({ countClick = () => {} }) => {
  // Добавляем значение по умолчанию для countClick
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavClick = (text) => {
    countClick(text);
    setIsOpen(false); // Закрываем меню при клике на ссылку
  };

  return (
    <nav className='px-4 py-2 lg:py-2 flex items-center justify-between shadow-md relative'>
      {/* Логотип */}
      <div className='flex'>
        <div className='flex-none w-40 lg:w-48 lg:mt-2 py-2 cursor-pointer'>
          <Link to='/CalendarGrid' onClick={() => handleNavClick('nav: Лого')}>
            <img src={logoImage} alt='Logo' />
          </Link>
        </div>
        <div className='hidden lg:block lg:w-48 py-4 mt-1 text-[12px] leading-[13px] font-[300] px-1 opacity-50'></div>
      </div>

      {/* Гамбургер-меню */}
      <button
        className='text-gray-800 md:hidden'
        onClick={toggleMenu}
        aria-label='Toggle menu'
      >
        <svg
          className='w-6 h-6'
          fill='none'
          stroke='white'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
          />
        </svg>
      </button>

      {/* Меню */}
      <ul
        className={`bg-[#111111] ${
          isOpen ? 'flex' : 'hidden'
        } flex-col absolute top-16 left-0 w-full shadow-lg p-4 gap-3 md:gap-3 md:flex md:flex-row md:static md:top-0 md:w-auto`}
      >
        <li>
          <Link
            to='/about'
            onClick={() => handleNavClick('nav: О нас')}
            className='block mt-1.5 py-2 px-4 text-white/60 hover:text-white'
          >
            О нас
          </Link>
        </li>
        <li>
          <Link
            to='/CalendarGrid'
            onClick={() => handleNavClick('nav: Календарь grid')}
            className='block mt-1.5 py-2 px-4 text-white/60 hover:text-white'
          >
            Календарь
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
