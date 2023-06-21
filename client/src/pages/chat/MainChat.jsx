import React, { useEffect } from 'react'
import Left from './Left'
import Chat from './Chat'
import { useNavigate } from 'react-router-dom';

const MainChat = () => {
  const navigate = useNavigate();
  const tokens = localStorage.getItem('tokens');
  useEffect(() => {
    if (tokens?.length > 19) {
      navigate('/')
    } else { navigate('/login') }
  }, [tokens, navigate])
  return (
    <div className='w-[100vw] flex '>
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
