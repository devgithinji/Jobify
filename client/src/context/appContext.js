import {createContext, useContext, useReducer} from "react";
import reducer from "./reducer";
import {
    CLEAR_ALERT,
    DISPLAY_ALERT,
    SETUP_USER_BEGIN,
    SETUP_USER_SUCCESS,
    SETUP_USER_ERROR, TOGGLE_SIDEBAR, LOGOUT_USER, UPDATE_USER_SUCCESS, UPDATE_USER_BEGIN, UPDATE_USER_ERROR
} from "./actions";
import axios from "axios";


//set default state
const token = localStorage.getItem('token')
const user = localStorage.getItem('user')
const userLocation = localStorage.getItem('location')


export const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user: user ? JSON.parse(user) : null,
    token: token,
    userLocation: userLocation || '',
    jobLocation: userLocation || '',
    showSidebar: false
}

const AppContext = createContext();
const AppProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    //axios instance
    const authFetch = axios.create({
        baseURL: '/api/v1'
    })

    //request
    authFetch.interceptors.request.use((config) => {
        config.headers.common['Authorization'] = `Bearer ${state.token}`
        return config;
    }, (error) => {
        return Promise.reject(error)
    })

    //response
    authFetch.interceptors.response.use((response) => {
        return response;
    }, (error) => {
        if (error.response.status === 401) {
            logoutUser();
        }
        return Promise.reject(error);
    })

    const displayAlert = () => {
        dispatch({type: DISPLAY_ALERT})
        clearAlert();
    }

    const clearAlert = () => {
        setTimeout(() => {
            dispatch({type: CLEAR_ALERT})
        }, 3000)
    }


    const setUpUser = async ({currentUser, endpoint, alertText}) => {
        dispatch({type: SETUP_USER_BEGIN})
        try {
            const {data} = await axios.post(`/api/v1/auth/${endpoint}`, currentUser)
            const {user, token, location} = data
            dispatch({
                type: SETUP_USER_SUCCESS, payload: {user, token, location, alertText}
            })
            addUserToLocalStorage({user, token, location})
        } catch (e) {
            if (e.response.status !== 401) {
                dispatch({
                    type: SETUP_USER_ERROR, payload: {msg: e.response.data.msg}
                })
            }
        }
        clearAlert();
    }

    const addUserToLocalStorage = ({user, token, location}) => {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        localStorage.setItem('location', location)
    }

    const removeUserFromLocalStorage = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('location')
    }

    const toggleSideBar = () => {
        dispatch({type: TOGGLE_SIDEBAR})
    }

    const logoutUser = () => {
        dispatch({type: LOGOUT_USER})
        removeUserFromLocalStorage();
    }

    const updateUser = async (currentUser) => {
        dispatch({
            type: UPDATE_USER_BEGIN
        })
        try {
            const {data} = await authFetch.patch('/auth/updateUser', currentUser);
            const {user, location, token} = data;

            dispatch({
                type: UPDATE_USER_SUCCESS,
                payload: {user, location, token}
            })

            addUserToLocalStorage({user, location, token})

        } catch (e) {
            dispatch({
                type: UPDATE_USER_ERROR,
                payload: {msg: e.response.data.msg}
            })
        }
        clearAlert();
    }

    return (
        <AppContext.Provider value={{...state, displayAlert, setUpUser, toggleSideBar, logoutUser, updateUser}}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
}

export {AppProvider}