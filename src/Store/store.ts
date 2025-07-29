import { configureStore } from '@reduxjs/toolkit';

// Configure Redux store using the slice reducer
import miscellaneousStoreSlice from './miscellaneousStoreSlice';
import landingPageStoreSlice from '../Ver2Designs/Pages/Landing/LandingV3/landingPageStoreSlice';

export const store = configureStore({
  reducer: {
    miscellaneous: miscellaneousStoreSlice,
    landingPage: landingPageStoreSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
