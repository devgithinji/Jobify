import {createContext, useContext, useReducer} from "react";
import reducer from "./reducer";
import {
    CLEAR_ALERT,
    DISPLAY_ALERT,
    // REGISTER_USER_BEGIN,
    // REGISTER_USER_SUCCESS,
    // REGISTER_USER_ERROR,
    // LOGIN_USER_BEGIN,
    // LOGIN_USER_SUCCESS,
    // LOGIN_USER_ERROR,
    SETUP_USER_BEGIN,
    SETUP_USER_SUCCESS,
    SETUP_USER_ERROR, TOGGLE_SIDEBAR, LOGOUT_USER
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

    const displayAlert = () => {
        dispatch({type: DISPLAY_ALERT})
        clearAlert();
    }

    const clearAlert = () => {
        setTimeout(() => {
            dispatch({type: CLEAR_ALERT})
        }, 3000)
    }

    // const registerUser = async (currentUser) => {
    //     dispatch({type: REGISTER_USER_BEGIN})
    //     try {
    //         const response = await axios.post('/api/v1/auth/register', currentUser);
    //         const {user, token, location} = response.data;
    //         dispatch({
    //             type: REGISTER_USER_SUCCESS, payload: {
    //                 user, token, location
    //             }
    //         })
    //
    //         //store user in localstorage
    //         addUserToLocalStorage({user, token, location})
    //
    //     } catch (e) {
    //         dispatch({type: REGISTER_USER_ERROR, payload: {msg: e.response.data.msg}})
    //     }
    //     clearAlert();
    // }

    // const loginUser = async (currentUser) => {
    //     dispatch({type: LOGIN_USER_BEGIN})
    //     try {
    //         const {data} = await axios.post('/api/v1/auth/login', currentUser)
    //         const {user, token, location} = data
    //         dispatch({
    //             type: LOGIN_USER_SUCCESS, payload: {user, token, location}
    //         })
    //         addUserToLocalStorage({user, token, location})
    //     } catch (e) {
    //         dispatch({
    //             type: LOGIN_USER_ERROR, payload: {msg: e.response.data.msg}
    //         })
    //     }
    //     clearAlert();
    // }

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
            dispatch({
                type: SETUP_USER_ERROR, payload: {msg: e.response.data.msg}
            })
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

    return (
        <AppContext.Provider value={{...state, displayAlert, setUpUser, toggleSideBar, logoutUser}}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
}

export {AppProvider}