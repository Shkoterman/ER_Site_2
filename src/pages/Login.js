import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Подключаем файл стилей

const LoginPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        password,
      });
      // Сохраняем токен
      localStorage.setItem('token', response.data.token);
      // Перенаправляем на страницу админ-панели
      navigate('/controlpanel');
    } catch (error) {
      setError('лол, нет');
    }
  };
  return (
    <div className='loginPage-container'>
      <div className='loginPage-placeholder'>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Введите пароль'
        />
        <button className='loginPage-button' onClick={handleLogin}>
          Войти
        </button>
        {error && <div className='loginPage-error'>{error}</div>}
      </div>
    </div>
  );
};

export default LoginPage;
