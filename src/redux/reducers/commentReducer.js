import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../../config/axiosConfig.js';
import {handler} from "../../utils/axiosErrorHandler.js";

export const fetchComments = createAsyncThunk(
    'comments/fetchComments',
    async function() {
        const response = await axiosInstance.get('/comments')

        return response.data;
    }
)

export const addNewComment = createAsyncThunk(
    'comments/addNewComment',
    async function({text, postId, authorId}, {rejectWithValue, dispatch}) {
        try {
            const response = await axiosInstance.post(`/comments/create`, {
                text,
                postId,
            })
                .catch(error => {handler(error)})

            dispatch(addComment(response.data))
        }catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const updateCommentText = createAsyncThunk(
    'comments/updateCommentText',
    async function({newText, id}, {rejectWithValue, dispatch}) {
        try{
            const response = await axiosInstance.put(`/comments/update/${id}`, {
                text: newText,
            })
                .catch(error => {handler(error)})

            dispatch(updateComment({res: response.data, id}))
        }catch(error) {
            return rejectWithValue(error.message);
        }
    }
)

export const removeComment = createAsyncThunk(
    'comments/removeComment',
    async function({id}, {rejectWithValue, dispatch}) {
        try {
            const response = await axiosInstance.delete(`/comments/delete/${id}`)
                .catch(error => {handler(error)})

            dispatch(deleteComment(response.data))
        }catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

const setError = (state, action) => {
    state.status = 'rejected';
    state.error = action.payload;
}

const commentSlice = createSlice({
    name: 'comments',
    initialState: {
        comments: [],
        status: null,
        error: null
    },
    reducers: {
        addComment: (state, action) => {
            state.comments.push(action.payload);
        },

        updateComment: (state, action) => {
            for(let i = 0; i < state.comments.length; i++) {
                if(state.comments[i].id === action.payload.id) {
                    state.comments[i] = action.payload.res;
                }
            }
        },

        deleteComment: (state, action) => {
            for(let i = 0; i < state.comments.length; i++) {
                if(state.comments[i].id === action.payload.id) {
                    state.comments.splice(i, 1);
                    return;
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.pending, (state, action) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.status = 'resolved';
                state.comments = action.payload;
            })
            .addCase(fetchComments.rejected, setError)
    }
})

const { addComment, updateComment, deleteComment } = commentSlice.actions
export default commentSlice.reducer;