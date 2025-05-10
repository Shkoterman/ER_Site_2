'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className='px-4 py-2 lg:py-2 flex items-center justify-between shadow-md relative'>
      <div className='flex'>
        <div className='flex-none w-40 lg:w-48 lg:mt-2 py-2 cursor-pointer'>
          <Link href='/'>
            <Image
              src='/logo_ensalada.png'
              alt='Logo'
              width={192}
              height={40}
            />
          </Link>
        </div>
        <div className='hidden lg:block lg:w-48 py-4 mt-1 text-[12px] leading-[13px] font-[300] px-1 opacity-50'></div>
      </div>

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

      <ul
        className={`bg-[#111111] ${
          isOpen ? 'flex' : 'hidden'
        } flex-col absolute top-16 left-0 w-full shadow-lg p-4 gap-3 md:gap-3 md:flex md:flex-row md:static md:top-0 md:w-auto z-50`}
      >
        <li>
          <Link
            href='/about'
            className='block mt-1.5 py-2 px-4 text-white/60 hover:text-white'
            onClick={() => setIsOpen(false)}
          >
            О нас
          </Link>
        </li>
        <li>
          <Link
            href='/'
            className='block mt-1.5 py-2 px-4 text-white/60 hover:text-white'
            onClick={() => setIsOpen(false)}
          >
            Календарь
          </Link>
        </li>
      </ul>
    </nav>
  );
};
