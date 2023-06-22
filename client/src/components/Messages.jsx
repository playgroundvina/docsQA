import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Messages = ({ messages, result, isLoading }) => {
  // const { theme } = useSelector((state) => state.bot);
  const theme = '#0487df'

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };
  return (
    <div className="w-full h-full overflow-y-auto p-5">
      {messages?.map((item, index) => {
        if (item.role === 'human') {
          return (
            <div key={index} className="chat chat-end">
              <div className="chat-image avatar">

              </div>
              <div
                style={{
                  'background-color': `${theme}aa`,
                }}
                className={`chat-bubble whitespace-pre-line`}
              >
                {item.content}
              </div>
            </div>
          );
        } else {
          return (
            <div key={index} className="chat chat-start">
              <div className="chat-image avatar">
                <div className="w-12 rounded-full">
                  <img src="https://img.upanh.tv/2023/05/19/icon-chat-bot.png" alt="" />
                </div>
              </div>
              <div
                style={{
                  'background-color': `${theme}66`,
                }}
                className={`chat-bubble whitespace-pre-line`}
              >
                {item.content}
              </div>
            </div>
          );
        }
      })}
      {isLoading === true && (
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-12 rounded-full">
              <img src="https://img.upanh.tv/2023/05/19/icon-chat-bot.png" alt="" />
            </div>
          </div>
          <div
            style={{
              'background-color': `${theme}66`,
            }}
            className={` chat-bubble whitespace-pre-line flex items-center justify-center`}
          >
            {result ? result : (<div className='loading loading-dots loading-xs'></div>)}
          </div>
        </div>
      )}

      <AlwaysScrollToBottom />
    </div>
  );
};

export default Messages;
