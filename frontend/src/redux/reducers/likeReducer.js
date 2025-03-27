import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../../config/axiosConfig.js';
import {convertLikesToObject} from "../../utils/convertLikesToObject.js";
import {handler} from "../../utils/axiosErrorHandler.js";

export const fetchLikes = createAsyncThunk(
    'likes/fetchLikes',
    async function(_, {rejectWithValue}) {
        try {
            const response = await axiosInstance.get('/likes')
                .catch(error => {handler(error)})

            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const postLike = createAsyncThunk(
    'likes/postLike',
    async function({postId, authorId}, {rejectWithValue}) {
        try {
            const token = localStorage.getItem('token');

            await axiosInstance.post(
                `/likes/create`,
                {
                    postId: postId,
                    authorId: authorId
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            )
                .catch(error => {handler(error)})
        }catch(error) {
            return rejectWithValue(error.message);
        }
    }
)

export const deleteLike = createAsyncThunk(
    'likes/deleteLike',
    async function({postId, authorId}, {rejectWithValue}) {
        try {
            await axiosInstance.delete(`/likes/delete`, {
                params: {
                    postId: postId,
                    authorId: authorId
                },
            })
                .catch(error => {handler(error)})
        }catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

const setError = (state, action) => {
    state.status = 'rejected';
    state.error = action.payload;
}

const likeSlice = createSlice({
    name: 'likes',
    initialState: {
        likes: {},
        status: null,
        error: null
    },
    reducers: {
        likeToggle: (state, action) => {
            const postId = action.payload.postId;

            if (!state.likes[postId]) {
                state.likes[postId] = []
            }

            action.payload.isAdd ?
                state.likes[postId].push(action.payload.authorId):
                state.likes[postId].splice(state.likes[postId].indexOf(action.payload.authorId), 1);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLikes.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchLikes.fulfilled, (state, action) => {
                state.status = 'resolved';
                state.likes = convertLikesToObject(action.payload)
            })
            .addCase(fetchLikes.rejected, setError)
            .addCase(postLike.rejected, setError)
            .addCase(deleteLike.rejected, setError)
    }
})

export const {likeToggle } = likeSlice.actions
export default likeSlice.reducer;