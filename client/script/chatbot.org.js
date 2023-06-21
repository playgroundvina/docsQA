const chatBotContainer = document.createElement('div');
const src = `http://localhost:3000`;
chatBotContainer.innerHTML = `
    <style>
        .click-chat-bot {
            position: fixed;
            right: 0px;
            bottom: 30px;
            cursor: pointer;
            animation: gotop 1s ease;
            z-index: 9999;
            width: 10%;
            min-width: 100px;
            // width: 100px;
            background-color: #F70000; 
        }

        .container-chat-bot .iframe-chat-bot{
            display: none;
            position: absolute;
            bottom: 20px;
            left: -440px;
            width: 445px; 
            height: 740px;
            z-index: 99999;
        }
        .click-chat-bot .container-chat-bot .icon-chat-bot{
            position: absolute;
            z-index: 99999;
            bottom: 10px;
            transition-duration: 500ms;
            // background-color: #F70000; 

        }
        .click-chat-bot .container-chat-bot :hover.icon-chat-bot{
            scale: 1.1;
        }
        .container-chat-bot .iframe-chat-bot .iframe {
            border: none; 
            border-radius: 15px; 
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); 
            background-color: #f2f2f2; 
            margin: 10px; 
            width:100%; 
            height:100%;
        }
        .click-chat-bot .container-chat-bot .icon-chat-bot #image-chat-bot {
                width: 100%;
                height: 100%;
            }
        @media screen and (max-width: 768px) {
            .container-chat-bot .iframe-chat-bot{
                bottom: 20px;
                left: -400px;
                width: 400px; 
                height: 640px;
            }
        }

        @media screen and (max-width: 500px) {
            .container-chat-bot .iframe-chat-bot{
                bottom: 20px;
                left: -300px;
                width: 300px; 
                height: 600px;
            }
            .icon-chat-bot{
                right: 10px;
                bottom: -30px;
            }
            .click-chat-bot{
                min-width: 80px;
            }

            .container-chat-bot .iframe-chat-bot{
            bottom: 40px;
            left: -260px;
            scale: 0.95;
            z-index: 99999;
            }
        }



        @media screen and (max-width: 320px) {
            .click-chat-bot {
                display: none
            }
        }

    </style>

    <div class="click-chat-bot">
        <div class="container-chat-bot">
            <div class="iframe-chat-bot">
                <iframe src=${src}/?${pg_chatbot_id} title="Chatbot AI"  class="iframe"></iframe>
            </div>
            <div class="icon-chat-bot" id="chatBotIframe">
                <img id="image-chat-bot" alt="" />
            </div>
        </div>
    </div>
`;

const chatBotIframe = chatBotContainer.querySelector('.iframe-chat-bot');
const clickIconChatBox = chatBotContainer.querySelector('#chatBotIframe');
const iframe = chatBotContainer.querySelector('.iframe');
const image = chatBotContainer.querySelector('#image-chat-bot');
let data = {};
iframe.style.display = 'none';

window.addEventListener('message', function (e) {
  if (e.origin == src) {
    if (e.data) {
      data = e.data;
      if (haveDomain(data.domain)) {
        iframe.style.display = 'block';
        image.src = data.avatar;
      }
    } else {
      chatBotVisible = false;
      chatBotIframe.style.display = chatBotVisible ? 'block' : 'none';
      localStorage.setItem('chatBotVisible', chatBotVisible.toString());
    }
  }
});

let chatBotVisible = localStorage.getItem('chatBotVisible') === 'true' || false;
chatBotIframe.style.display = chatBotVisible ? 'block' : 'none';

clickIconChatBox.addEventListener('click', function () {
  chatBotVisible = !chatBotVisible;
  chatBotIframe.style.display = chatBotVisible ? 'block' : 'none';
  localStorage.setItem('chatBotVisible', chatBotVisible.toString());
});

document.body.appendChild(chatBotContainer);

function haveDomain(domain) {
  const domainCurrent = location.hostname;
  const list = domain.split(',');
  const kq = list.find((e) => e == domainCurrent);
  return kq;
}
