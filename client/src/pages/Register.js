import React, {useEffect, useState} from 'react';
import {Alert, FormRow, Logo} from '../components'
import Wrapper from '../assets/wrappers/RegisterPage'
import {useAppContext} from "../context/appContext";
import {useNavigate} from "react-router-dom";

const initialState = {
    name: '', email: '', password: '', isMember: true,

}

const Register = () => {
    const [values, setValues] = useState(initialState)
    const {isLoading, showAlert, displayAlert, user, setUpUser} = useAppContext()
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setTimeout(() => {
                navigate('/')
            }, 3000)
        }
    }, [user, navigate])

    const toggleMember = () => {
        setValues({...values, isMember: !values.isMember})
    }

    const handleChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value})
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const {name, email, password, isMember} = values
        if (!email || !password || (!isMember && !name)) {
            displayAlert();
            return;
        }

        const currentUser = {name, email, password}

        if (isMember) {
            setUpUser({currentUser, endpoint: 'login', alertText: 'Login Successful! Redirecting'})
        } else {
            setUpUser({currentUser, endpoint: 'register', alertText: 'User Created! Redirecting'})
        }
    }

    return (
        <Wrapper className='full-page'>
            <form className='form' onSubmit={onSubmit}>
                <Logo/>
                <h3>{values.isMember ? 'Login' : 'Register'}</h3>
                {showAlert && <Alert/>}
                {!values.isMember &&
                    <FormRow type='text' name='name' value={values.name} handleChange={handleChange} labelText='name'/>}
                <FormRow type='email' name='email' value={values.email} handleChange={handleChange} labelText='email'/>
                <FormRow type='password' name='password' value={values.password} handleChange={handleChange}
                         labelText='password'/>
                <button type='submit' className='btn btn-block' disabled={isLoading}>
                    submit
                </button>
                <p>
                    {values.isMember ? 'Not a member yet?' : 'Already a member'}
                    <button type='button' onClick={toggleMember} className='member-btn'>
                        {values.isMember ? 'Register' : 'Login'}
                    </button>
                </p>
            </form>
        </Wrapper>
    );
};

export default Register;