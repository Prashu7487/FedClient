import { AxiosInstance } from "axios"

export const createSession = async (
    api: AxiosInstance,
    session_data: {
        fed_info: any
    }
) => {
    return api.post('create-federated-session', session_data)
}

export const getAllSessions = (api: AxiosInstance) => {
    return api.get('get-all-federated-sessions')
}

export const getFederatedSession = (api: AxiosInstance, session_id) => {
    return api.get(`get-federated-session/${session_id}`)
}

export const respondToSession = (api: AxiosInstance, data: { session_id: number, decision: number }) => {
    return api.post('submit-client-federated-response', data)
}
