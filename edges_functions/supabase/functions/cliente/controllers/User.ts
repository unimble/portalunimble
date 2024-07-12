import { response, isNumber } from "../../utils/utils.ts";
import * as service from "../service/User.ts";

export const addUser = async (params, body, user) => {
    const { data, error, msg, code } = await service.registerUser(user);

    if (error) return response(null, true, msg, code);

    return response(data);
}