import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  token: string | null;
  role: 'user' | 'admin' | null;
}

const initialState: AuthState = {
  token: null,
  role: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; role: 'user' | 'admin' }>
    ) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
    },

    logout: (state) => {
      state.token = null;
      state.role = null;
    },

    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },

    setRole: (state, action: PayloadAction<'user' | 'admin' | null>) => {
      state.role = action.payload;
    },
  },
});

export const { loginSuccess, logout, setToken, setRole } = authSlice.actions;
export default authSlice.reducer;
