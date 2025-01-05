import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        setUser(state, action) {
            return action.payload; // Set the user data
        },
        clearUser(state) {
            return null; // Clear user data
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;