import axiosApi from "../../axiosApi";
import {push} from 'connected-react-router';

export const REGISTER_USER_REQUEST = 'REGISTER_USER_REQUEST';
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_FAILURE = 'REGISTER_USER_FAILURE';

export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';

export const LOGOUT_USER_REQUEST = 'LOGOUT_USER_REQUEST';
export const LOGOUT_USER_SUCCESS = 'LOGOUT_USER_SUCCESS';
export const LOGOUT_USER_ERROR = 'LOGOUT_USER_ERROR';

export const registerUserRequest = () => ({type: REGISTER_USER_REQUEST});
export const registerUserSuccess = () => ({type: REGISTER_USER_SUCCESS});
export const registerUserFailure = error => ({type: REGISTER_USER_FAILURE, error});

export const loginUserRequest = () => ({type: LOGIN_USER_REQUEST});
export const loginUserSuccess = user => ({type: LOGIN_USER_SUCCESS, user});
export const loginUserFailure = error => ({type: LOGIN_USER_FAILURE, error});

export const logoutUserRequest = () => ({type: LOGOUT_USER_REQUEST});
export const logoutUserSuccess = () => ({type: LOGOUT_USER_SUCCESS});
export const logoutUserFailure = error => ({type: LOGOUT_USER_ERROR, error});

export const registerUser = (userData, props) => {
    return async dispatch => {
        try {
            dispatch(registerUserRequest());
            await axiosApi.post('/users', userData);
            dispatch(registerUserSuccess(
                props && props.registerSuccess(),
            ));
            dispatch(push('/'));
        } catch (error) {
            if (error.response) {
                dispatch(registerUserFailure(error.response.data));
            } else {
                dispatch(registerUserFailure({global: 'Network error or no internet'}));
            }
        }
    }
};

export const loginUser = userData => {
    return async dispatch => {
        try {
            dispatch(loginUserRequest());
            const response = await axiosApi.post('/users/sessions', userData);
            dispatch(loginUserSuccess(response.data));
            dispatch(push('/'))
        } catch (error) {
            if (error.response) {
                dispatch(loginUserFailure(error.response.data));
            } else {
                dispatch(loginUserFailure({global: 'Network error or no internet'}));
            }
        }
    }
};

export const logoutUser = () => {
    return async (dispatch) => {
        try {
            dispatch(logoutUserRequest());
            await axiosApi.delete('/users/sessions');
            dispatch(logoutUserSuccess());
            dispatch(push('/'));
        } catch (error) {
            if (error.response) {
                dispatch(logoutUserFailure(error.response.data));
            } else {
                dispatch(logoutUserFailure({global: 'Network error or no internet'}));
            }
        }
    }
};