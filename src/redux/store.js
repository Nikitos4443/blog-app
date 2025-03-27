import { configureStore } from '@reduxjs/toolkit'
import likeReducer from './reducers/likeReducer.js'
import commentReducer from "./reducers/commentReducer.js";
import userReducer from "./reducers/userReducer.js";
import postReducer from "./reducers/postReducer.js";
import authReducer from "./reducers/authReducer.js";

export const store = configureStore({
    reducer: {
        likes: likeReducer,
        comments: commentReducer,
        user: userReducer,
        posts: postReducer,
        auth: authReducer
    },
})