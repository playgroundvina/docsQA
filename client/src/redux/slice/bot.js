import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import botService from "../../services/bot.service";
const initialState = {
    bot: {},
    isLoading: false,
    errors: {
        get: {},
    },
    theme: '#02b4d9',
};
export const getBot = createAsyncThunk("bot/getBot", async (id) => {
    // const response = await botService.getBot(id);
    // return response.data;
});
const botSlice = createSlice({
    name: "bot",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBot.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getBot.fulfilled, (state, action) => {
                state.bot = action.payload;
                state.theme = state?.bot?.color
                state.isLoading = false;
                state.errors = null;
            })
            .addCase(getBot.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = action.error.message;
            });
    },
})
export const { } = botSlice.actions;
export default botSlice.reducer;
