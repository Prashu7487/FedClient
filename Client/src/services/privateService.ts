import { PrivateHTTPService } from "./config"

export const initializeModel = (data: {
    mondel_config: any,
    session_id: number,
}) => {
    return PrivateHTTPService.post('initiate-model', data)
}