import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    return response.json();
});

const initialState = {
    data: [],
    filteredData: [],
    filter: { name: '', username: '', email: '', phone: '' },
    status: 'idle',
    error: null,
    isFilterActive: false,
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setFilter: (state, action) => {
            state.filter = action.payload;
        },
        clearFilter: (state) => {
            state.filter = { name: '', username: '', email: '', phone: '' };
        },
        toggleFilter: (state) => {
            state.isFilterActive = !state.isFilterActive;
        },
        filterUsers: (state) => {
            const { name, username, email, phone } = state.filter;
            state.filteredData = state.data.filter(profile =>
                (name === '' || profile.name.toLowerCase().startsWith(name.toLowerCase())) &&
                (username === '' || profile.username.toLowerCase().startsWith(username.toLowerCase())) &&
                (email === '' || profile.email.toLowerCase().startsWith(email.toLowerCase())) &&
                (phone === '' || profile.phone.replace(/\D/g, '').startsWith(phone.replace(/\D/g, '')))
            );
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
                state.filteredData = [...state.data];
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { setFilter, clearFilter, toggleFilter, filterUsers } = userSlice.actions;

export default userSlice.reducer;
