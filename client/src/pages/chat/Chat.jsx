import React, { useEffect, useRef, useState } from 'react';
import Divider from '../../components/Divider';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Messages from '../../components/Messages';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getBot } from '../../redux/slice/bot';
import { setTheme } from '../../redux/slice/bot';
import { chatDoc, deleteHistoryChat, getHistoryChat } from '../../redux/slice/docQA';

const Chat = () => {
  const { documentQA, messagesResponse, histories } = useSelector((state) => state?.docQA);

  const dispatch = useDispatch();
  const { language } = useSelector((state) => state?.language);
  const [inputMessage, setInputMessage] = useState('');
  let [isLoading, setIsLoading] = useState(false);
  let [result, setResult] = useState('');
  const messagesLocalStorage = JSON.parse(localStorage.getItem('chat_messages'));
  const { bot, theme } = useSelector((state) => state?.bot);
  const cookie_id = JSON.parse(localStorage.getItem('cookie_id'));
  const [messages, setMessages] = useState([{ role: 'ai', content: "Please select the document to start chatting" }]);
  const resultRef = useRef();
  const id = window.location.search.substring(1);


  // get messages history chat
  const dataGerHistoryChat = {
    id: documentQA?._id,
    page: 1,
    limit: 10
  }
  useEffect(() => {
    dispatch(getHistoryChat(dataGerHistoryChat))
  }, [documentQA?._id]);

  useEffect(() => {
    if (histories?.length > 0) {
      setMessages(histories[0])
    } else {
      setMessages([{ role: 'ai', content: "Please select the document to start chatting" }])
    }
  }, [histories]);

  // create userId
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

  // save data stream
  useEffect(() => {
    resultRef.current = result;
  }, [result]);

  //handleSendMessage
  const handleSendMessage = () => {
    if (inputMessage !== '') {
      setResult('');
      setIsLoading(true);
      // let data = {
      //   documentId: documentQA?._id,
      //   content: inputMessage,
      //   language: language?.name
      // };

      let data = {

        content: inputMessage,
        language: language?.name
      };
      let documentId = documentQA?._id;

      // call api stream
      let url = `${process.env.REACT_APP_URL_API}chatgpt/pdf/stream/${documentId}`;
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
          if (e?.data !== '[DONE]') {
            let text = e?.data.replace('*%#', '\n');
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

      //call api chat no stream
      // dispatch(chatDoc(data))
    }
    if (!inputMessage.trim().length) {
      return;
    }
    const data = inputMessage;
    setMessages((old) => [...old, { role: 'human', content: data }]);
    setInputMessage('');
  };

  // add value chat
  useEffect(() => {
    setIsLoading(false);
    if (messagesResponse) {
      setResult(messagesResponse[0]?.text)
    }
  }, [messagesResponse]);

  // set data reply
  useEffect(() => {
    if (isLoading === false && result) {
      setMessages((old) => [...old, { role: 'ai', content: result }]);
    }
  }, [isLoading]);


  return (
    <div className=" bg-base-100 w-[100%] h-[100hv] rounded-2xl ">
      <div
        style={{
          'background-color': `${theme}33`,
        }}

      >
        <div className={`fixed z-10 top-0 lg:w-[75%] w-full `}>
          <Header />
        </div>
        <div className={`py-16 overflow-y-auto min-h-screen max-h-screen  `}>
          <Messages messages={messages} result={result} isLoading={isLoading} />
        </div>
        <div className={`fixed bottom-0 lg:w-[75%] w-full bg-base-100  `}>
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

export default Chat;
