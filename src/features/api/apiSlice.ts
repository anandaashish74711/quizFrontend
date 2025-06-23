import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Admin login
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: '/admin/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // User login
    userLogin: builder.mutation({
      query: (identifier) => ({
        url: '/user/login',
        method: 'POST',
        body: identifier,
      }),
    }),
    // Get all responses
getAllResponses: builder.query({
  query: () => '/admin/responses',
}),


    // Get active question for user
    getActiveQuestion: builder.query({
      query: () => '/user/active-question',
    }),
      setActiveQuestion: builder.mutation({
      query: (body) => ({
        url: '/admin/setactive',
        method: 'POST',
        body,
      }),
      }),
        getResponses: builder.query({
    query: () => '/admin/responses',
  }),
    // Submit response for user
    submitResponse: builder.mutation({
      query: (data) => ({
        url: '/user/submit-response',
        method: 'POST',
        body: data,
      }),
    }),

    // Get all questions (admin)
    getQuestions: builder.query({
      query: () => '/admin/questions',
    }),

    // Create new question (admin)
    createQuestion: builder.mutation({
      query: (data) => ({
        url: '/admin/questions',
        method: 'POST',
        body: data,
      }),
    }),
   deleteQuestion: builder.mutation<void, string>({
  query: (id) => ({
    url: `/admin/deletequestions/${id}`,
    method: 'DELETE',
  }),
}),

   

  
  }),
});

export const {
  useAdminLoginMutation,
  useUserLoginMutation,
  useGetActiveQuestionQuery,
  useSubmitResponseMutation,
  useGetQuestionsQuery,
  useCreateQuestionMutation,
  useSetActiveQuestionMutation,
  useGetAllResponsesQuery,
  useGetResponsesQuery,
  useDeleteQuestionMutation,
} = apiSlice;
