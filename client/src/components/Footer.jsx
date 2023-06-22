import React from "react";
import SelectLanguage2 from "./SelectLanguage2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const Footer = ({ isLoading, inputMessage, setInputMessage, handleSendMessage, selectLanguageWelcome }) => {
  const { bot, theme } = useSelector((state) => state?.bot);
  const { documentQA } = useSelector((state) => state?.docQA);

  const handleClickSendMessage = () => {
    if (documentQA) {
      handleSendMessage()
    } else {
      toast.warning('Please select the file you want to chat with!')
    }
  }

  return (
    <>
      <div className="w-auto px-2">
        <div className="form-control w-full ">
          <div className="input-group flex items-center justify-center">
            {documentQA?._id
              ? (<input
                style={{
                  "background-color": `${theme}33`,
                }}
                disabled={isLoading}
                type="text"
                placeholder="Type Something..."
                className={`input  w-full disabled:bg-opacity-10  focus:outline-0 `}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />)
              : (<input

                style={{
                  "background-color": `${theme}33`,
                }}
                disabled={true}
                type="text"
                placeholder="Type Something..."
                className={`input  w-full disabled:bg-opacity-10  focus:outline-0 `}

              />)
            }

            {documentQA?._id
              ? (<button style={{ "background-color": `${theme}`, }}
                className={`${isLoading ? "loading" : ""
                  } btn btn-square overflow-hidden border-0`}
                onClick={handleClickSendMessage}
              >
                {!isLoading && (
                  <FontAwesomeIcon
                    className="w-5 h-5 hover:scale-125 duration-300"
                    icon="fa-solid fa-paper-plane"
                  />
                )}
              </button>)
              : (<button style={{ "background-color": `${theme}`, }}
                className={`${isLoading ? "loading" : ""
                  } btn btn-square overflow-hidden border-0`}
                onClick={handleClickSendMessage}
                disabled={true}
              >
                <FontAwesomeIcon
                  className="w-5 h-5 hover:scale-125 duration-300"
                  icon="fa-solid fa-paper-plane"
                />
              </button>)
            }

          </div>
        </div>
        <div className="flex justify-center">
          <SelectLanguage2 />
        </div>
      </div>
    </>
  );
};

export default Footer;
