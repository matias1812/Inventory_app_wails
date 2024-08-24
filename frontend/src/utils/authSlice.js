import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    rol: null,
    id: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setRol: (state, action) => {
      state.rol = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    clearAuth: (state) => {
      state.token = null;
      state.rol = null;
      state.id = null
    },
  },
});

export const { setToken, setRol, setId, clearAuth } = authSlice.actions;
export default authSlice.reducer;
