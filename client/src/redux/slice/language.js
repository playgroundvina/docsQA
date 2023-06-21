import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    language: {},

};

const languageSlice = createSlice({
    name: "language",
    initialState,
    reducers: {
        setLanguage: (state, action) => {
            state.language = action.payload ?? {
                id: 2,
                icon: "https://touranh.com/wp-content/uploads/2022/07/uk.jpg",
                name: "English",
                contentWelcome: 'Hello, Can I help you!',
            };

        },
    },

});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
