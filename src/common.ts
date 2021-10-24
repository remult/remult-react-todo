import { Remult } from "remult";
import axios from 'axios';
import { AuthService } from "./AuthService";

axios.interceptors.request.use(config => {
    let token = AuthService.fromStorage();;
    if (token)
        config.headers!["Authorization"] = "Bearer " + token;
    return config;
});
export const remult = new Remult(axios);

export const auth = new AuthService(remult);
