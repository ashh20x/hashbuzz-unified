import { configureStore } from '@reduxjs/toolkit';
import miscellaneousStoreSlice from './miscellaneousStoreSlice';
import landingPageStoreSlice from '@/Ver2Designs/Pages/Landing/LandingV3/landingPageStoreSlice';
import authReducer from '@/Ver2Designs/Pages/AuthAndOnboard/authStoreSlice';

export const store = configureStore({
  reducer: {
    app: miscellaneousStoreSlice,
    landingPage: landingPageStoreSlice,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
