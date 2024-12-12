import { PrivateHTTPService } from "./config"

export const initializeModel = (data: {
    mondel_config: any,
    session_id: number,
}) => {
    PrivateHTTPService.post('initiate-model', data)
}