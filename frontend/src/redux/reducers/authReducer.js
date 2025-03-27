import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../../config/axiosConfig.js';
import {handler} from "../../utils/axiosErrorHandler.js";

export const getMe = createAsyncThunk(
    'auth/login',
    async function (_, {rejectWithValue}) {
        try {
            const response = await axiosInstance.get(`/users/getMe`)
                .catch(error => {
                    handler(error)
                })

            if (response.headers.authorization) {
                localStorage.setItem('token', response.headers.authorization);
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

const setError = (state, action) => {
    state.status = 'rejected';
    state.error = action.payload;
}

const authSlice = createSlice({
    name: "auth",
    initialState: {
        userData: {},
        status: null,
    },
    reducers: {
        _logout: (state) => {
            document.cookie = "refreshToken=; Max-Age=0; path=/;";

            localStorage.removeItem("token");

            state.userData = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMe.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.status = 'resolved';
                state.userData = action.payload;
            })
            .addCase(getMe.rejected, setError)
    }
})

export default authSlice.reducer;

export const {_logout} = authSlice.actions;
