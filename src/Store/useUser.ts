import { useCallback, useEffect } from "react";
import { CurrentUser } from "../types";
import { useStore } from "./StoreProvider";
import { useCookies } from "react-cookie";


export const useUser = () => {
    const { dispatch } = useStore();
    const [cookies] = useCookies(["aSToken"]);

    const checkAndUpdateLoggedInUser = useCallback(() => {
        const localData = localStorage.getItem("user");
        if (localData) {
            const currentUser = JSON.parse(localData) as CurrentUser;
            const { aSToken } = cookies;
            dispatch({
                type: "UPDATE_STATE",
                payload: { currentUser, auth: { aSToken } },
            });
        }
    }, [dispatch]);

    useEffect(() => {
        checkAndUpdateLoggedInUser();
    }, [checkAndUpdateLoggedInUser]);

    return {
        checkAndUpdateLoggedInUser,
    };
};
