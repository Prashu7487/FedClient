import { createContext, useContext, useState, useEffect, useCallback, useDebugValue } from 'react';
import { refreshAccessToken, logout as logsTheOut } from '../services/authService';
import axios from 'axios';
import { BASE_URL, WS_BASE_URL } from '../services/config';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { initializeModel } from '../services/privateService';

const AuthContext = createContext();

const REFRESH_INTERVAL = 1000 * 60 * 15;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [eventSource, setEventSource] = useState(null);
    const navigate = useNavigate()
    const location = useLocation()
    let refreshTimeout;

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        if (savedUser) {
            setUser(savedUser);
            scheduleTokenRefresh()
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        const initializeEventSource = () => {
            if (user && user.access_token) {
                const notification_path = `${BASE_URL}/notifications?token=${user.access_token}`
                axios.get(notification_path, { timeout: 10 })
                    .then((response) => {
                        // removeUserData()
                    })
                    .catch((error) => {
                        if (error.code == "ECONNABORTED") { // When the Request has timed out
                            const source = new EventSource(notification_path);

                            // Listen for messages
                            source.onmessage = (event) => {
                                const data = JSON.parse(event.data);
                                handleNotification(data)
                            };

                            let reconnectDelay = 1000;
                            // Handle errors and attempt reconnection
                            source.onerror = (a, b, c) => {
                                console.error('EventSource disconnected. Attempting to reconnect...', a, b, c);
                                source.close(); // Close the current connection
                                setTimeout(() => {
                                    reconnectDelay = Math.min(reconnectDelay * 2, 30000); // Cap delay at 30 seconds
                                    initializeEventSource();
                                }, reconnectDelay);
                            };

                            // Save the EventSource instance
                            setEventSource(source);
                        }
                        else {
                            removeUserData()
                        }
                    })
            }
        };

        // Initialize the connection
        initializeEventSource();

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [user]);

    const login = (userData) => {
        setUser(userData);

        localStorage.setItem('user', JSON.stringify(userData));

        scheduleTokenRefresh()
    };

    const logout = () => {
        logsTheOut(api)
            .catch(console.error)
            .finally(removeUserData)
    };

    const removeUserData = () => {
        setUser(null);
        localStorage.removeItem('user');
        clearTimeout(refreshTimeout)
    }

    const scheduleTokenRefresh = () => {
        // Clear existing refresh to avoid duplicate timers
        clearTimeout(refreshTimeout);

        refreshTimeout = setTimeout(updateTokens, REFRESH_INTERVAL);
    };

    const updateTokens = () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.refresh_token)
            refreshAccessToken(api, userData.refresh_token)
                .then(response => {
                    setUser(response.data)
                    localStorage.setItem('user', JSON.stringify(response.data));
                    scheduleTokenRefresh()
                })
                .catch(error => {
                    console.error("Failed to refresh access token:", error);
                    logout()
                })
    }

    const handleNotification = ({ type, message, data, session_id }) => {
        if (type == 'new-session') {
            // if (location.pathname === '/TrainingStatus') {
            //     // window.location.reload();
            //     navigate('/TrainingStatus')
            // }

            toast.info(message, {
                onClick: () => {
                    navigate(`/TrainingStatus/details/${session_id}`)
                }
            })
        }
        else if (type == "get_model_parameters_start_background_process") {
            console.log("Config before initialising: ", data, session_id);

            console.log("building model on client side...");
            setUpModel(data, session_id); // Function to initialize training
        }
    }

    const api = axios.create({
        baseURL: BASE_URL,
        timeout: 50000,
        headers: {
            "Content-Type": "application/json",
            // 'Authorization': `Bearer ${user ? user.access_token : ''}` // Add the token
        },
    });

    api.interceptors.request.use(
        (config) => {
            //   const token = localStorage.getItem('token'); // Retrieve token from local storage
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                config.headers['Authorization'] = `Bearer ${user.access_token ?? ''}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
        (response) => {
            // Any status code within the range of 2xx will trigger this function
            return response;
        },
        (error) => {
            // Any status codes outside the range of 2xx will trigger this function
            if (error.response) {
                // Server responded with a status code outside the range of 2xx
                console.error('Error response:', error.response);

                // Handle specific status codes as needed
                if (error.response.status === 401) {
                    alert("Unauthorized access - please log in again.");
                    removeUserData()
                    // Optionally, log the user out, redirect to login, or refresh the token
                } else if (error.response.status === 403) {
                    alert("Access denied - you do not have permission.");
                } else if (error.response.status === 500) {
                    alert("Internal server error - please try again later.");
                }
            } else if (error.request) {
                // No response was received from the server
                console.error('Error request:', error.request);
                alert("Network error - please check your internet connection.");
            } else {
                // Error occurred in setting up the request
                console.error('Error message:', error.message);
                alert("An error occurred - please try again.");
            }
            return Promise.reject(error);  // Optionally, you can also return a custom error message here
        }
    );

    return (
        <AuthContext.Provider value={{ user, login, logout, api }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

const setUpModel = async (config, sessionId) => {
    console.log("config received by setUpModel: ", config);

    const data = {
        model_config: config,
        session_id: sessionId,
        // client_id: clientToken,
    };

    initializeModel(data)
        .then(({ data }) => {
            console.log(data.message)

            const status_four_data = {
                session_id: sessionId,
                decision: 1,
                local_model_id: data.local_model_id
            };
        })
    const res = await axios.post(private_server_model_initiate_url, data);
    if (res.status === 200) {
        console.log(res.data.message);

        const status_four_data = {
            client_id: clientToken,
            session_id: sessionId,
            decision: 1,
        };
        const response = await axios.post(
            server_status_four_update_Url,
            status_four_data
        );
        if (response.status === 200) {
            console.log(response.message);
        } else {
            console.error("Failed to update the client status", response);
        }
    } else {
        console.error("Failed to send model config to private server", res);
    }
};
