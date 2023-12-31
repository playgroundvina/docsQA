import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDoc, getSingleDoc, uploadDoc } from '../../redux/slice/docQA';
import ListDoc from './ListDoc';

const Left = ({ setOpen }) => {
    const [selectedFile, setSelectedFile] = useState('');
    const { listDocQA, uploadDocQA } = useSelector((state) => state?.docQA);
    const dispatch = useDispatch();
    const cookie_id = JSON.parse(localStorage.getItem('cookie_id'));
    const [active, setActive] = useState(null);
    const [screenMode, setScreenMode] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    const dataGetListDoc = {
        id: cookie_id,
        page: 1,
        limit: 10
    }
    const dataPostDoc = {
        file: selectedFile,
        owner: cookie_id,
        filename: selectedFile?.name
    }
    const data = [dataGetListDoc, dataPostDoc]

    useEffect(() => {
        dispatch(getDoc(dataGetListDoc))
    }, []);

    useEffect(() => {
        if (uploadDocQA && isLoading === true)
            setIsLoading(false)
    }, [uploadDocQA]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handelClickUpload = (event) => {
        event.preventDefault();
        setIsLoading(true)
        if (dataPostDoc) {
            dispatch(uploadDoc(data));
            setSelectedFile('')
        }
    }

    const handleClick = (id, doc) => {
        setActive(id);
        if (id === doc._id) {
            dispatch(getSingleDoc(doc))
            if (screenMode === 'mobile') {
                setOpen(false)
            }
        }
    }
    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            const mode = screenWidth < 1024 ? 'mobile' : 'desktop';
            setScreenMode(mode);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [screenMode]);

    return (
        <div className=' flex flex-col justify-center items-center px-[5px]'>

            <h1 className='text-[30px] font-semibold pt-3'>DocsQA</h1>
            <div className='pt-6 flex '>
                <input type="file" className="file-input file-input-bordered file-input-info w-full max-w-xs "
                    onChange={handleFileChange}
                />
                <button className="btn btn-info ml-3 "
                    onClick={handelClickUpload}
                >{isLoading === true ? (<span className="loading loading-spinner loading-sm"></span>) : "Upload"} </button>
            </div>

            {listDocQA && listDocQA[0]?.map((doc) => (
                <div key={doc._id} onClick={() => { handleClick(doc._id, doc) }} className='w-[90%] mx-[10px]'>
                    <ListDoc active={active} document={doc} />
                </div>
            ))}



        </div>
    )
}

export default Left