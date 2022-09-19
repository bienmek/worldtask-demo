import React, {useEffect, useState} from 'react';
import styles from '../styles/login.module.scss'
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import {useForm} from "react-hook-form";

const Login = ({token}) => {
    const [seePassword, setSeePassword] = useState(false);
    const [inputType, setInputType] = useState("password");
    const [backendError, setBackendError] = useState(null);
    const {register, handleSubmit, formState: {errors}} = useForm()

    const onSubmit = async (data) => {
        const username = data.username
        const password = data.password

        const result = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        }).then((res) => res.json())

        if(result.status === 'ok'){
            token(result.token)
            window.location.href = "/profile"
        } else {
            setBackendError(result.error)
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <h1 className={styles.title}>Log In</h1>
            {(backendError) && (<div style={{color: "rgb(239 68 68)", fontSize: "12px"}}>{backendError}</div>)}
            <div className={styles.box}>
                <label htmlFor="text">Username</label>
                <input
                    type="text"
                    placeholder={"Enter Email"}
                    className={styles.input}
                    {...register("username")}
                />
            </div>

            <div className={styles.box}>
                <label htmlFor="Password">Password</label>
                <div>
                    <input
                        type={inputType}
                        placeholder={"Enter Password"}
                        className={styles.input}
                        {...register("password")}
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
            </div>

            <div className={styles.box}>
                <button className={styles.button}>Log In</button>
            </div>
        </form>
    );
};

export default Login;
