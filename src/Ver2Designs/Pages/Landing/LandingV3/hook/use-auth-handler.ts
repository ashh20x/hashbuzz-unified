
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../../Store/store";
import type { RootState } from "../../../../../Store/store";
import { useCallback, useMemo } from "react";

const useAuthHandler = () => {
    const navigate = useNavigate();
    
    // Get authentication state from Redux store
    const { wallet, auth, xAccount, token } = useAppSelector(
        (state: RootState) => state.auth.userAuthAndOnBoardSteps
    );
    // Check if user is fully authenticated and onboarded (memoized)
    const isFullyOnboarded = useMemo(() => 
        wallet.isPaired && 
        auth.isAuthenticated && 
        xAccount.isConnected && 
        token.allAssociated,
        [wallet.isPaired, auth.isAuthenticated, xAccount.isConnected, token.allAssociated]
    );

    // Memoized callback for auth button click handler
    const authBtnClickHandler = useCallback(() => {
        if (isFullyOnboarded) {
            navigate("/dashboard");
        } else {
            navigate("/auth");
        }
    }, [isFullyOnboarded, navigate]);

    return { 
        authBtnClickHandler, 
        isFullyOnboarded,
        authSteps: { wallet, auth, xAccount, token }
    };
};

export default useAuthHandler;
