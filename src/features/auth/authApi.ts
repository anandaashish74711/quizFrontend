import { apiSlice } from '../api/apiSlice';


export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation<{ token: string }, { email: string; password: string; isAdmin: boolean }>(
      {
        query: ({ email, password, isAdmin }) => ({
          url: isAdmin ? '/admin/login' : '/user/login',
          method: 'POST',
          body: { email, password },
        }),
      }
    ),
  }),
});

export const { useLoginUserMutation } = authApi;
