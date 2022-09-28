import {createContext, useContext, useReducer} from "react";
import reducer from "./reducer";
import {
    CLEAR_ALERT,
    DISPLAY_ALERT,
    SETUP_USER_BEGIN,
    SETUP_USER_SUCCESS,
    SETUP_USER_ERROR,
    TOGGLE_SIDEBAR,
    LOGOUT_USER,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_BEGIN,
    UPDATE_USER_ERROR,
    HANDLE_CHANGE,
    CLEAR_VALUES,
    CREATE_JOB_BEGIN,
    CREATE_JOB_SUCCESS,
    CREATE_JOB_ERROR,
    GET_JOBS_SUCCESS,
    GET_JOBS_BEGIN,
    SET_EDIT_JOB,
    DELETE_JOB_BEGIN,
    EDIT_JOB_BEGIN,
    EDIT_JOB_SUCCESS,
    EDIT_JOB_ERROR,
    SHOW_STATS_BEGIN,
    SHOW_STATS_SUCCESS, CLEAR_FILTERS
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
    showSidebar: false,
    isEditing: false,
    editJobId: '',
    position: '',
    company: '',
    jobLocation: userLocation || '',
    jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
    jobType: 'full-time',
    statusOptions: ['pending', 'interview', 'decline'],
    status: 'pending',
    jobs: [],
    totalJobs: 0,
    numOfPages: 1,
    page: 1,
    stats: {},
    monthlyApplications: [],
    search: '',
    searchStatus: 'all',
    searchType: 'all',
    sort: 'latest',
    sortOptions: ['latest', 'oldest', 'a-z', 'z-a']
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


    const handleChange = ({name, value}) => {
        dispatch({
            type: HANDLE_CHANGE,
            payload: {name, value}
        })
    }


    const createJob = async () => {
        dispatch({type: CREATE_JOB_BEGIN})
        try {
            const {position, company, jobLocation, jobType, status} = state

            await authFetch.post('/jobs', {
                company,
                position,
                jobLocation,
                jobType,
                status
            })
            dispatch({
                type: CREATE_JOB_SUCCESS
            })
            clearValues()
        } catch (e) {
            if (e.response.status === 401) return;
            dispatch({
                type: CREATE_JOB_ERROR,
                payload: {msg: e.response.data.msg}
            })
        }
        clearAlert();
    }

    const getJobs = async () => {
        const {search, searchStatus, searchType, sort} = state;

        let url = `/jobs?status=${searchStatus}&jobType=${searchType}&sort=${sort}`;

        if (search) {
            url = `${url}&search=${search}`
        }

        dispatch({type: GET_JOBS_BEGIN})

        try {
            const {data} = await authFetch(url);
            const {jobs, totalJobs, numOfPages} = data;
            dispatch({
                type: GET_JOBS_SUCCESS,
                payload: {
                    jobs,
                    totalJobs,
                    numOfPages
                }
            })
        } catch (e) {
            // logoutUser()
            console.log(e.response)
        }
        clearAlert();
    }

    const setEditJob = (id) => {
        dispatch({type: SET_EDIT_JOB, payload: {id}})
    }

    const editJob = async () => {
        dispatch({type: EDIT_JOB_BEGIN})
        try {
            const {position, company, jobLocation, jobType, status} = state;
            await authFetch.patch(`/jobs/${state.editJobId}`, {
                company,
                position,
                jobLocation,
                jobType,
                status
            })

            dispatch({
                type: EDIT_JOB_SUCCESS
            })

            dispatch({
                type: CLEAR_VALUES
            })

        } catch (e) {
            if (e.response.status === 401) return
            dispatch({
                type: EDIT_JOB_ERROR,
                payload: {msg: e.response.data.msg}
            })
        }
        clearAlert();
    }

    const deleteJob = async (jobId) => {
        dispatch({type: DELETE_JOB_BEGIN})
        try {
            await authFetch.delete(`/jobs/${jobId}`)
            getJobs();
        } catch (e) {
            logoutUser()
        }
    }


    const showStats = async () => {
        dispatch({type: SHOW_STATS_BEGIN})

        try {
            const {data} = await authFetch.get('/jobs/stats');
            dispatch({
                type: SHOW_STATS_SUCCESS,
                payload: {
                    stats: data.defaultStats,
                    monthlyApplications: data.monthlyApplications
                }
            })
        } catch (e) {
            console.log(e.response)
            // logoutUser();
        }
        clearAlert();
    }

    const clearFilters = () => {
        dispatch({type: CLEAR_FILTERS})
    }

    const clearValues = () => {
        dispatch({type: CLEAR_VALUES})
    }


    return (
        <AppContext.Provider
            value={{
                ...state,
                displayAlert,
                setUpUser,
                toggleSideBar,
                logoutUser,
                updateUser,
                handleChange,
                clearValues,
                createJob,
                getJobs,
                setEditJob,
                editJob,
                deleteJob,
                showStats,
                clearFilters
            }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
}

export {AppProvider}