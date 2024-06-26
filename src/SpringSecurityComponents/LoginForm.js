import React from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { NavLink, useNavigate } from 'react-router-dom';
import { generateToken, userProfile } from '../APIs/AuthServiceAPIs';
import { useUserContext } from './UserContext';
import '../CSS/LoginForm.css'

const LoginForm = () => {
    const [authRequest, setAuthRequest] = useState({ username: '', password: '' })
    const { handleLogin, handleSetUser } = useUserContext();
    const navigate = useNavigate()

    const submitHandle = async (e) => {
        e.preventDefault();
        let response = await generateToken(authRequest)
        let token = await response.data;
        console.log("Generate Token Response Data ::: ", token)
        if (response.status === 200) {
            console.log("Status code ::: 200");
            handleLogin(token); // Update context with the received JWT token
            toast.success("Login Success", {
                autoClose: 2000
            });
            sessionStorage.removeItem('SessionExpired');
            navigate('/')
            let response = await userProfile(token);
            let data = await response.data;
            handleSetUser(data);
        } else {
            console.log('login failed ', response.statusText);
        }
    }

    const onChangeInputHandle = (e) => {
        setAuthRequest({ ...authRequest, [e.target.name]: e.target.value })
    }

    return (
        <div className="container">
            <form className="form-signin" onSubmit={e => submitHandle(e)}>
                <h2 className="form-signin-heading">Please sign in</h2>
                <input type="text" id="username" name="username" className="form-control" value={authRequest.username} onChange={e => onChangeInputHandle(e)} placeholder="Username" required />
                <input type="password" id="password" name="password" className="form-control" value={authRequest.password} onChange={e => onChangeInputHandle(e)} placeholder="Password" required />
                <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
            </form>
            <div>
                <span>Don't you have account, please </span>
                <NavLink to='/auth/addNewUser' style={{ textDecoration: 'none', fontWeight: 'bold' }}><span>Sign-up</span></NavLink>
                <span> now.</span>
            </div>
        </div>
    );
}

export default LoginForm;
