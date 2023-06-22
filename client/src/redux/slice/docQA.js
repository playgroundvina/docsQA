import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import docQAService from "../../services/docQA.service";
import { toast } from "react-toastify";
import axios from "axios";
import queryString from "query-string";
const initialState = {
    listDocQA: [],
    documentQA: {},
    messagesResponse: [],
    isLoading: false,
    histories: [],
    uploadDocQA: {}
};

export const uploadDoc = createAsyncThunk("doc/postDoc", async (data, thunkAPI) => {
    try {
        const dataGetListDoc = data[0]
        const dataPostDoc = data[1]
        const url = `upload`;
        //const response = await docQAService.postDoc(dataPostDoc);
        console.log(dataPostDoc?.file.length)
        if (dataPostDoc?.file.length <= 0) {
            toast.warning(`Please select the document you want to upload`)
            return;
        } else {
            const axiosClient = axios.create({
                baseURL: process.env.REACT_APP_URL_API,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': '*',
                },
                paramsSerializer: (params) => queryString.stringify(params),
            });
            const response = await axiosClient.post(url, dataPostDoc);

            thunkAPI.dispatch(getDoc(dataGetListDoc));
            if (response.data) {
                toast.success('uploaded successfully')
            }
            return response.data;
        }


    } catch (error) {
        console.log(error)
    }

});

export const getDoc = createAsyncThunk("doc/getDoc", async (data) => {
    try {
        const response = await docQAService.getDoc(data);
        return response.data;
    } catch (error) {
        console.log(error)
    }

});

export const getSingleDoc = createAsyncThunk("doc/getSingleDoc", async (data) => {
    try {
        const response = data;
        return response
    } catch (error) {
        console.log(error)
    }
});

export const chatDoc = createAsyncThunk("doc/chatDoc", async (data) => {
    try {
        const response = await docQAService.chatDoc(data);
        return response.data;
    } catch (error) {
        console.log(error)
    }
});

export const getHistoryChat = createAsyncThunk("doc/getHistoryChat", async (data) => {
    try {
        const response = await docQAService.getHistoryChat(data);
        return response.data;
    } catch (error) {
        console.log(error)
    }
});

export const deleteHistoryChat = createAsyncThunk("doc/deleteHistoryChat", async (id, thunkAPI) => {
    try {
        const data = { id: id, page: 1, limit: 10 }
        const response = await docQAService.deleteHistoryChat(id);
        thunkAPI.dispatch(getHistoryChat(data));
        return response.data;
    } catch (error) {
        console.log(error)
    }
});

const docSlice = createSlice({
    name: "docQA",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        /// upload document
        builder
            .addCase(uploadDoc.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(uploadDoc.fulfilled, (state, action) => {
                state.uploadDocQA = action.payload;
                state.isLoading = false;
                state.errors = null;
            })
            .addCase(uploadDoc.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = action.error.message;
            });
        ///get document
        builder
            .addCase(getDoc.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getDoc.fulfilled, (state, action) => {
                state.listDocQA = action.payload;
                state.isLoading = false;
                state.errors = null;
            })
            .addCase(getDoc.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = action.error.message;
            });
        /// get single document
        builder
            .addCase(getSingleDoc.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSingleDoc.fulfilled, (state, action) => {
                state.documentQA = action.payload;
                state.isLoading = false;
                state.errors = null;
            })
            .addCase(getSingleDoc.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = action.error.message;
            });
        /// chat with document
        builder
            .addCase(chatDoc.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(chatDoc.fulfilled, (state, action) => {
                state.messagesResponse = action.payload;
                state.isLoading = false;
                state.errors = null;
            })
            .addCase(chatDoc.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = action.error.message;
            });
        /// history chat document
        builder
            .addCase(getHistoryChat.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getHistoryChat.fulfilled, (state, action) => {
                state.histories = action.payload;
                state.isLoading = false;
                state.errors = null;
            })
            .addCase(getHistoryChat.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = action.error.message;
            });



    },
})
export const { } = docSlice.actions;
export default docSlice.reducer;
