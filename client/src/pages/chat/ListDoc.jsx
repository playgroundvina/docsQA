import React, { useEffect, useState } from 'react'

const ListDoc = ({ document, active }) => {

    return (
        <div className={`flex items-center mt-5 flex-row w-full hover:bg-[#d9f2f8] rounded-[5px] h-[50px] cursor-pointer 
        ${active === document._id
                ? " bg-[#d9f2f8]"
                : ""
            }
        `}
        >
            <div >
                <img src="https://www.shareicon.net/data/2016/07/03/636103_file_512x512.png"
                    alt=''
                    width="50px" height="50px"
                />
            </div>
            <p className=''>{document?.filename}</p>
        </div>
    )
}

export default ListDoc