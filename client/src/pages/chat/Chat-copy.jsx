import React, { useEffect, useRef, useState } from 'react';
import Divider from '../../components/Divider';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Messages from '../../components/Messages';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getBot } from '../../redux/slice/bot';
import { setTheme } from '../../redux/slice/bot';

const ChatCopy = () => {
  let url = `${process.env.REACT_APP_URL_API}bot/chatbot/stream`;
  const { setting } = useSelector((state) => state?.bot);
  const dispatch = useDispatch();
  const { language } = useSelector((state) => state?.language);
  const [inputMessage, setInputMessage] = useState('');
  let [isLoading, setIsLoading] = useState(false);
  let [result, setResult] = useState('');
  const messagesLocalStorage = JSON.parse(localStorage.getItem('chat_messages'));
  const { bot, theme } = useSelector((state) => state?.bot);
  const cookie_id = JSON.parse(localStorage.getItem('cookie_id'));
  const [messages, setMessages] = useState([{ from: 'computer', text: language?.contentWelcome }]);
  const resultRef = useRef();

  const refresh = () => {
    setMessages([{ from: 'computer', text: language.contentWelcome }]);
    setResult('');
    setIsLoading(false);
    localStorage.removeItem('chat_messages');
  };

  const id = window.location.search.substring(1);
  useEffect(() => {
    if (bot?.title) {
      window.parent.postMessage(bot, '*');
    }
  }, [bot]);

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem('chat_messages'))) {
      const [firstElement, ...restOfArray] = messages;
      const welcomeSay = { from: 'computer', text: language.contentWelcome }
      setMessages([welcomeSay, ...restOfArray])
    }
  }, [language])

  useEffect(() => {
    try {
      dispatch(getBot(id));
    } catch (error) {
      console.log(error);
    }

    if (!cookie_id) {
      const now = new Date().getTime();
      const random = ~~Math.random() * 1000;
      localStorage.setItem('cookie_id', `${now}${random}`);
    }

    if (messagesLocalStorage) {
      setMessages(JSON.parse(localStorage.getItem('chat_messages')));
    }

  }, []);

  useEffect(() => {
    resultRef.current = result;
  }, [result]);

  //handleSendMessage
  const handleSendMessage = () => {
    if (inputMessage !== '') {
      setResult('');
      setIsLoading(true);

      let data = {
        bot_id: id,
        role: 'User',
        content: `${inputMessage}`,
        language: language.code,
        cookie_id: cookie_id,
      };

      const ctrl = new AbortController();
      fetchEventSource(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: ctrl.signal,
        openWhenHidden: true,
        onmessage(e) {
          console.log(e.data);
          if (e?.data !== '[DONE]') {
            let text = e?.data;
            resultRef.current = resultRef.current + text;
            setResult(resultRef.current);
          } else {
            setIsLoading(false);
          }
        },

        onerror(err) {
          console.log(err);
          setIsLoading(false);
          return;
        },
      });
    }
    if (!inputMessage.trim().length) {
      return;
    }
    const data = inputMessage;
    setMessages((old) => [...old, { from: 'me', text: data }]);
    setInputMessage('');
  };

  useEffect(() => {
    if (isLoading === false && result) {
      setMessages((old) => [...old, { from: 'computer', text: result }]);
      localStorage.setItem('chat_messages', JSON.stringify(messages));
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoading === false && result) {
      localStorage.setItem('chat_messages', JSON.stringify(messages));
    }
  }, [messages]);

  return (
    <div className=" bg-base-100 w-[100%] h-[100hv] rounded-2xl ">
      <div
        style={{
          'background-color': `${theme}33`,
        }}
      // className={`w-full h-full `}
      >
        <div className={`fixed z-10 top-0 w-[75%] `}>
          <Header onRefresh={refresh} />
        </div>
        <div className={`py-16 overflow-y-auto min-h-screen max-h-screen  `}>
          {/* <Divider /> */}
          <Messages messages={messages} result={result} isLoading={isLoading} />
          {/* <Divider /> */}
        </div>
        <div className={`fixed bottom-0 w-[75%]   bg-base-100  `}>
          <div
            style={{
              'background-color': `${theme}33`,
            }}
            className={` pt-2`}
          >
            <Footer isLoading={isLoading} inputMessage={inputMessage} setInputMessage={setInputMessage} handleSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCopy;
