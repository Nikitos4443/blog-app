import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../../config/axiosConfig.js';
import {handler} from "../../utils/axiosErrorHandler.js";

export const fetchPosts = createAsyncThunk(
    'post/fetchPosts',
    async function({id}, {rejectWithValue}) {
        try {
            const response = await axiosInstance.get( `/posts/getByUser/${id}`)
                    .catch(error => {
                        handler(error)
                    })
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const fetchAllPosts = createAsyncThunk(
    'post/fetchAllPosts',
    async function(_, {rejectWithValue}) {
        try {
            const response = await axiosInstance.get(`/posts`)
                    .catch(error => {
                        handler(error)
                    })

            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const createPost = createAsyncThunk(
    'post/createPost',
    async function(post, {rejectWithValue,dispatch}) {
        try {
            const response = await axiosInstance.post(`/posts/create`, {
                title: post.title,
                content: post.content,
                media: post.media
            })
                .catch(error => {handler(error)})

            dispatch(_createPost(response.data));
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const updatePost = createAsyncThunk(
    'post/updatePost',
    async function(post, {rejectWithValue,dispatch}) {
        try {
            const response = await axiosInstance.put(`/posts/update/${post.id}`, {
                title: post.title,
                content: post.content,
                media: post.media
            })
                .catch(error => {handler(error)})

            dispatch(_updatePost(response.data));
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const deletePost = createAsyncThunk(
    'post/deletePost',
    async function(id, {rejectWithValue,dispatch}) {
        try {
            const response = await axiosInstance.delete(`/posts/delete/${id}`)
                .catch(error => {handler(error)})

            dispatch(_deletePost(response.data));
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

const setError = (state, action) => {
    state.status = 'rejected';
    state.error = action.payload;
}

const postSlice = createSlice({
    name: 'posts',
    initialState: {
        posts: [],
        status: null,
        error: null
    },
    reducers: {
        _updatePost: (state, action) => {
            for(let i = 0; i < state.posts.length; i++) {
                if(state.posts[i].id === action.payload.id) {
                    state.posts[i] = action.payload;
                }
            }
        },

        _createPost: (state, action) => {
            state.status = 'resolved'
            state.posts.unshift(action.payload);
        },

        _deletePost: (state, action) => {
            for(let i = 0; i < state.posts.length; i++) {
                if(state.posts[i].id === action.payload.id) {
                    state.posts.splice(i, 1);
                    return;
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'resolved';
                state.posts = action.payload;
            })
            .addCase(fetchAllPosts.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchAllPosts.fulfilled, (state, action) => {
                state.status = 'resolved';
                state.posts = action.payload;
            })
            .addCase(fetchPosts.rejected, setError)
            .addCase(fetchAllPosts.rejected, setError)
    }
})

const {_updatePost, _createPost, _deletePost} = postSlice.actions;
export default postSlice.reducer;