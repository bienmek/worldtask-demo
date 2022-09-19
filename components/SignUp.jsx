import React, {useEffect, useState} from 'react';
import styles from '../styles/signup.module.scss'
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import {useForm} from "react-hook-form";

const SignUp = ({token}) => {
    const [seePassword, setSeePassword] = useState(false);
    const [inputType, setInputType] = useState("password");
    const [backendError, setBackendError] = useState(null);
    const {register, handleSubmit, formState: {errors}} = useForm()

    const onSubmit = async (data) => {
        const username = data.username
        const email = data.email
        const password = data.password

        const result = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        }).then((res) => res.json())

        if (result.status === 'ok') {
            console.log(result.token)
            token(result.token)
            window.location.href = "/profile"
        } else {
            setBackendError(result.error)
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <h1 className={styles.title}>Sign Up</h1>

            <div className={styles.box}>
                <label htmlFor="Text">Username</label>
                <input
                    type="text"
                    placeholder={"Enter a username"}
                    className={styles.input}
                    {...register("username", {required: "You have to enter a username", minLength: {value: 4, message: "Usernames need at least 4 characters"}})}
                />
                {errors.username && (<div style={{color: "rgb(239 68 68)", fontSize: "12px"}}>{errors.username.message}</div>)}
                {(backendError) && (<div style={{color: "rgb(239 68 68)", fontSize: "12px"}}>{backendError}</div>)}
            </div>

            <div className={styles.box}>
                <label htmlFor="Email">Email</label>
                <input
                    type="email"
                    placeholder={"Enter an email"}
                    className={styles.input}
                    {...register("email", {required: "You have to enter an email"})}
                />
                {errors.email && (<div style={{color: "rgb(239 68 68)", fontSize: "12px"}}>{errors.email.message}</div>)}
            </div>

            <div className={styles.box}>
                <label htmlFor="Password">Password</label>
                <div>
                    <input
                        type={inputType}
                        placeholder={"Enter Password"}
                        className={styles.input}
                        {...register("password", {required: "You have to enter a password", minLength: {value: 6, message: "Passwords need at least 6 characters"}})}
                    />
                    {seePassword ? (
                        <div onClick={() => {
                            setSeePassword(false)
                            setInputType("password")
                        }} className={styles.eye}>
                            <AiFillEye size={35} color={"#A5AFC2FF"}/>
                        </div>
                    ) : (
                        <div onClick={() => {
                            setSeePassword(true)
                            setInputType("text")
                        }} className={styles.eye}>
                            <AiFillEyeInvisible size={35} color={"#A5AFC2FF"}/>
                        </div>
                    )}
                </div>
                {errors.password && (<div style={{color: "rgb(239 68 68)", fontSize: "12px"}}>{errors.password.message}</div>)}
            </div>

            <div className={styles.box}>
                <button className={styles.button}>Create an account</button>
            </div>
        </form>
    );
};

export default SignUp;
