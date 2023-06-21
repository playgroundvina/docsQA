import React, { useRef, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import useClickOutSide from "../../src/hooks/useClickOutSide";
import Left from "../pages/chat/Left";
import { deleteHistoryChat } from "../redux/slice/docQA";

const Header = () => {
  const { bot, theme } = useSelector((state) => state.bot);
  const { documentQA, } = useSelector((state) => state?.docQA);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const onClose = () => {
    if (open) {
      setOpen(false);
    }
  };
  const menuRef = useRef(null);
  const menuBarRef = useRef(null);
  useClickOutSide(onClose, menuRef, menuBarRef);

  const turnOffchatBot = () => {
    window.parent.postMessage(false, "*");
  }

  const onRefresh = () => {
    dispatch(deleteHistoryChat(documentQA?._id))
  }

  return (
    <>
      <div
        style={{
          "background-color": `${theme}`,
        }}
        className={`w-[100%] p-3 flex justify-between items-center  `}
      >
        <div className={`text-lg font-bold`}>
          <div className="">{documentQA?.filename}</div>
        </div>
        <div className="flex justify-between items-center space-x-0.5">
          <button
            onClick={() => { onRefresh() }}
            className="btn w-8 btn-ghost btn-sm"
          >
            <FontAwesomeIcon icon="fa-solid fa-rotate" />
          </button>
          {/* <button
            onClick={() => {
              turnOffchatBot();
            }}
            className="btn w-8 btn-ghost btn-sm"
          >
            <FontAwesomeIcon icon="fa-solid fa-x" />
          </button> */}

          <div
            ref={menuRef}
            className="btn w-12 btn-ghost btn-sm lg:hidden flex items-center"
          >
            <img alt="" src="https://cdn-icons-png.flaticon.com/128/4543/4543046.png" onClick={() => {
              setOpen((prev) => prev === true ? false : true);
            }} />

            <div
              className={`${open ? "translate-y-0" : "translate-y-[100%] "
                } lg:hidden navbar w-[300px] fixed z-[9999999999] bg-[#fff] top-0 right-0 h-screen `}
            >
              <div className=" absolute top-2">
                <Left setOpen={setOpen} />
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
