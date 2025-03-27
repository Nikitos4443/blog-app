import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../../config/axiosConfig.js';
import {handler} from "../../utils/axiosErrorHandler.js";

export const getUser = createAsyncThunk(
    'user/get',
    async function ({id}, {rejectWithValue}) {
        try {
            const response = await axiosInstance.get(`/users/getOne/${id}`)
                .catch(error => {
                    handler(error)
                })

            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const getUsers = createAsyncThunk(
    'users/get',
    async function ({id}, {getState, rejectWithValue}) {
        const {users} = getState().user;

        if (users.some(user => user.id === id)) {
            return null;
        }

        try {
            const response = await axiosInstance.get(`/users/getOne/${id}`)
                .catch(error => {
                    handler(error)
                })

            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async function ({user}, {rejectWithValue, dispatch}) {
        try {
            const response = await axiosInstance.put(`/users/update`, {
                name: user.name,
                description: user.description,
                password: user.password,
                avatar: user.avatar,
            })
                .catch(error => {
                    handler(error)
                })

            dispatch(updateUserReducer(response.data));
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    async function ({userId}, {rejectWithValue, dispatch}) {
        try {
            console.log(userId)
            const response = await axiosInstance.delete(`/users/delete/${userId}`)
                .catch(error => {
                    handler(error)
                })

            dispatch(deleteUserReducer(response.data));
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

const setError = (state, action) => {
    state.status = 'rejected';
    state.error = action.payload;
}

const userSlice = createSlice({
    name: 'user',
    initialState: {
        users: [],
        user: {},
        status: null,
        error: null
    },
    reducers: {
        updateUserReducer: (state, action) => {
            state.user = action.payload;
        },

        deleteUserReducer: (state, action) => {
            state.user = {};
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUser.pending, (state, action) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.status = 'resolved';
                state.user = action.payload;
            })
            .addCase(getUser.rejected, setError)
            .addCase(getUsers.pending, (state, action) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.status = 'resolved';
                if (action.payload) {
                    state.users.push(action.payload);
                }
            })
            .addCase(getUsers.rejected, setError)
    }
})

export default userSlice.reducer;

const {updateUserReducer, deleteUserReducer} = userSlice.actions;