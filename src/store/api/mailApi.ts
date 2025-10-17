// User API endpoints using RTK Query
import { baseApi } from "./baseApi";


// mail API slice
export const mailApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Send OTP mutation
     sendOtp: builder.mutation<{ success: boolean; message: string }, {USER_ID?: string; EMAIL?: string; PHONE?: string; OTP_TYPE: string }>({
         query: (data) => ({
             url: '/mail/send-verification',
             method: 'POST',
             body: data,
         }),
     }),
    })
});

// Export hooks for components
export const {
    useSendOtpMutation
} = mailApi;

