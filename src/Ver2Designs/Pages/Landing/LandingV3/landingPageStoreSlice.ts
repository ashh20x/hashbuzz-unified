import { createSlice, PayloadAction } from '@reduxjs/toolkit';



interface LandingPageState {
    howItWorksModalOpen: boolean;
    // Add other modal or UI state properties as needed
}

const initialState: LandingPageState = {
    howItWorksModalOpen: false,
    // Initialize other properties here
};

const landingPageStoreSlice = createSlice({
    name: 'landingPage',
    initialState,
    reducers: {
        setHowItWorksModalOpen(state, action: PayloadAction<boolean>) {
            state.howItWorksModalOpen = action.payload;
        },
        // Add other reducers for additional state properties as needed
    },
});

export const { setHowItWorksModalOpen } = landingPageStoreSlice.actions;
export default landingPageStoreSlice.reducer;