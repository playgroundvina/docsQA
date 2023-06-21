/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../redux/slice/language";
const SelectLanguage = () => {
  const { language } = useSelector((state) => state.language);
  const dispatch = useDispatch();
  const data = [
    //trung quốc
    {
      id: 1,
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/225px-Flag_of_the_People%27s_Republic_of_China.svg.png",
      name: "Chinese",
      contentWelcome: '你好，我能帮助你吗!',
      code: "zh"
    },
    //anh
    {
      id: 2,
      icon: "https://touranh.com/wp-content/uploads/2022/07/uk.jpg",
      name: "English",
      contentWelcome: 'Hello, Can I help you!',
      code: "en"
    },

    //nhật
    {
      id: 3,
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flag_of_Japan.svg/225px-Flag_of_Japan.svg.png",
      name: "Japanese",
      contentWelcome: 'こんにちわ、 なにか お手伝い できます 化！',
      code: "ja"
    },
    //hàn
    {
      id: 4,
      icon: "https://cdn-icons-png.flaticon.com/512/552/552051.png",
      name: "Korean",
      contentWelcome: '안녕하세요, 도와드릴까요!',
      code: "ko"
    },
    //thái
    {
      id: 5,
      icon: "https://cdn.pixabay.com/photo/2012/04/10/23/01/thailand-26813_960_720.png",
      name: "Thai",
      contentWelcome: 'สวัสดีค่ะ ฉันช่วยเหลือคุณได้หรือไม่คะ!',
      code: "th"
    },
    //vn
    {
      id: 6,
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/225px-Flag_of_Vietnam.svg.png",
      name: "Vietnamese",
      contentWelcome: 'Xin chào, tôi có thể giúp bạn!',
      code: "vi"
    },
  ];

  useEffect(() => {
    const languageS = JSON.parse(localStorage.getItem("language"));
    // if (languageS?.name) {
    dispatch(setLanguage(languageS));
    // }
  }, []);

  window.onbeforeunload = function () {
    if (language?.name)
      localStorage.setItem("language", JSON.stringify(language));
  };

  const [visible, setVisible] = useState(false);


  window.addEventListener("click", (e) => {
    // console.log(e.target);
    const clickedElement = e.target;
    const targetElement = document.getElementById("openDropdown");
    const targetElement2 = document.getElementById("openDropdown2");
    const targetElement3 = document.getElementById("openDropdown3");

    if (clickedElement != targetElement && clickedElement != targetElement2 && clickedElement != targetElement3) {
      setVisible(false);
    }

  });

  return (
    <>
      <div className="ml-1 ">
        <div className="dropdown dropdown-top  ">
          <label
            onClick={() => {
              setVisible(!visible);
            }}
            tabIndex={0}
            className="flex items-center justify-center "
          >
            <div
              id="openDropdown"
              className="btn btn-sm btn-ghost normal-case font-normal m-0.5"
            >
              <img
                id="openDropdown2"
                className="w-5 h-3 mr-2 "
                src={language.icon}
                alt=""
              />
              <div id="openDropdown3">{language.name} </div>
              {/* Select language: {language?.name} */}
            </div>
            {/* <img className="h-16 w-24 my-2" src={select.icon} alt="" /> */}
          </label>
          {visible && (
            <ul
              tabIndex={0}
              className="dropdown-content menu shadow  bg-base-100 rounded-box w-52 z-10"
            >
              {data.map((e) => (
                <li className=" " key={e.id}>
                  <a
                    className="active:bg-base-200/50 hover:border-l-0"
                    onClick={() => {
                      dispatch(setLanguage(e));
                      setVisible(false);

                    }}
                  >
                    {/* <div>{e.icon}</div> */}
                    <img className="w-12 h-8 " src={e.icon} alt="" />
                    <div>{e.name} </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default SelectLanguage;
