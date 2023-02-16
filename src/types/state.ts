import { AuthCred, CurrentUser } from "./users";
import {Campaign} from "./campaign"

export interface AppState{
    currentUser?:CurrentUser,
    campaigns?: Campaign[],
    auth?:AuthCred
}