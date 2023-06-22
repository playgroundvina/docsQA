import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Chat from './Chat';
import Left from './Left';
import { Popup } from '../../components/Popup';

const MainChat = () => {
  const navigate = useNavigate();
  const tokens = localStorage.getItem('tokens');
  useEffect(() => {
    if (tokens?.length > 19) {
      navigate('/')
    } else { navigate('/login') }
  }, [tokens, navigate])
  return (
    <div className='w-[100vw] flex  relative'>
      {/* <Popup /> */}
      <div className='w-[25%] lg:block hidden'>
        <Left />
      </div>
      <div className='lg:w-[75%] w-full'>
        <Chat />
      </div>

    </div>
  )
}

export default MainChat
