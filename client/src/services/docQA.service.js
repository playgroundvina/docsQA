import axiosClient from "./axiosClient";

const docQA = {
    postDoc: (data) => {
        const url = `upload`;
        return axiosClient.post(url, data);
    },

    getDoc: (data) => {
        const { id, page, limit } = data;
        const url = `upload/owner/${id}?page=${page}&limit=${limit}`;
        return axiosClient.get(url);
    },

    chatDoc: (data) => {
        const { documentId, content, language } = data;
        const message = { content: content, language: language }
        const url = `chatgpt/pdf/${documentId}`;
        return axiosClient.post(url, message);
    },

    getHistoryChat: (data) => {
        const { id, page, limit } = data;
        const url = `chatgpt/pdf/${id}?page=${page}&limit=${limit}`;
        return axiosClient.get(url);
    },

    deleteHistoryChat: (id) => {
        const url = `chatgpt/pdf/${id}`;
        return axiosClient.delete(url);
    },

};
export default docQA;
