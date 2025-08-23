import { createSlice } from '@reduxjs/toolkit';
import { getLocalStorageUser } from '../../components/imports/utility.tsx';

const initialState = {
    username: '',
    email: '',
    user_id: 0,
    profilePic: '',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserFromLocalStorage: (state) => {
            const user = getLocalStorageUser();
            if (user) {
                state.username = user.username;
                state.email = user.email;
                state.user_id = user.user_id;
                state.profilePic = user.profilepic;
            }
        },
    },
});

export const { setUserFromLocalStorage } = userSlice.actions;
export default userSlice.reducer;
