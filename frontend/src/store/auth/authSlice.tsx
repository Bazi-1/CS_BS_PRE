import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import LoginService from '../../services/LoginServices.tsx';
import { setLocalStorageUser } from '../../utils/localStorageUtils.tsx';
import ProfileService from '../../services/ProfileServices.tsx';


interface AuthState {
    user: any;
    loading: boolean;
    error: string[] | null;
    message: string;
}

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (formData: { username: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await LoginService.login(formData);
            const authenticatedUser = {
                ...response.data.user,
                token: response.data.token,
            };
            setLocalStorageUser(authenticatedUser);
            return authenticatedUser;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Login failed');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await LoginService.register(formData);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.errors || [err.response?.data?.message || 'Registration failed']);
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'auth/updateUserProfile',
    async (userData: any, { rejectWithValue }) => {
        try {
            const { user_id, username, email, password, oldUser } = userData;
            let messages: string[] = [];

            if (username !== oldUser.username) {
                await ProfileService.updateUsername(user_id, username);
                messages.push('Username');
            }

            if (email !== oldUser.email) {
                await ProfileService.updateEmail(user_id, email);
                messages.push('Email');
            }

            if (password !== oldUser.password) {
                await ProfileService.updatePassword(user_id, password);
                messages.push('Password');
            }

            const updatedUser = { ...oldUser, username, email, password };
            setLocalStorageUser(updatedUser);
            return { updatedUser, message: messages.join(' and ') + ' updated successfully.' };
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Update failed');
        }
    }
);

export const uploadProfilePic = createAsyncThunk(
    'auth/uploadProfilePic',
    async (file: File, { getState, rejectWithValue }) => {
        try {
            const res = await ProfileService.uploadProfilePic(file);
            if (res.status === 200) {
                const { user }: any = (getState() as any).auth;
                const updatedUser = { ...user, profilepic: file.name };
                setLocalStorageUser(updatedUser);
                return { updatedUser, newPicUrl: URL.createObjectURL(file) };
            }
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Upload failed');
        }
    }
);

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    message: '',
};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.message = '';
        },
        clearMessage(state) {
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = '';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.message = 'Login successful';
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = Array.isArray(action.payload)
                    ? action.payload
                    : [action.payload as string];
                state.message = action.payload as string;
            })

            // register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = '';
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message || 'Registered successfully!';
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = Array.isArray(action.payload)
                    ? action.payload
                    : [action.payload as string];
            })
            //profile
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.user = action.payload.updatedUser;
                state.message = action.payload.message;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.message = action.payload as string;
            })

            .addCase(uploadProfilePic.fulfilled, (state, action) => {
                if (action.payload) {
                    state.user = action.payload.updatedUser;
                    state.message = 'Profile picture updated successfully.';
                }
            })
            .addCase(uploadProfilePic.rejected, (state, action) => {
                state.message = action.payload as string;
            });


    },
});

export const { logout, clearMessage } = authSlice.actions;
export default authSlice.reducer;
