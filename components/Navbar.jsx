import React, {useEffect, useState} from 'react';
import styles from '../styles/navbar.module.scss'
import feuille from '../public/images/feuille.png'
import Image from "next/image";
import Link from "next/link";
import SignUp from "./SignUp";
import Login from "./Login";
import {FiLogOut} from "react-icons/fi";
import {CgProfile} from "react-icons/cg";
import {RiPencilRuler2Line} from "react-icons/ri";

const Navbar = () => {

    const initLayout = () => {
        return !!localStorage.getItem('token')
    }
    const [showSignup, setShowSignup] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [username, setUsername] = useState('Loading...');
    const [hasToken, setHasToken] = useState(() => initLayout);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [mouseOnMenu, setMouseOnMenu] = useState(false);
    const [mouseOnName, setMouseOnName] = useState(false);


    const getUsername = async () => {
        const result = await fetch(`/api/userInfo?token=${localStorage.getItem('token')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
        setUsername(result.username)
    }

    const logout = () => {
        localStorage.setItem('token', '')
        window.location.href = "/"
    }

    const delay = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    useEffect(() => {
        if (initLayout() && localStorage.getItem('token')) {
            getUsername()
        } else {
            setHasToken(() => false)
        }
    }, []);

    useEffect(() => {
        if (mouseOnName) {
            setShowProfileMenu(true)
        }

        if (!mouseOnName) {
            delay(100).then(() => !mouseOnMenu && setShowProfileMenu(false))
        }

    }, [mouseOnMenu, mouseOnName]);


    return (
        <>
            <nav className={styles.navbar}>
                <Link href={"/"}>
                    <span className={styles.title}>
                        World Task
                        <Image src={feuille} width={90} height={20} className={styles.image}/>
                    </span>
                </Link>

                <ul className={styles.ul}>
                    {!hasToken ? (
                        <>
                            <li className={styles.li}>
                                <span
                                    className={styles.login}
                                    onClick={() => setShowLogin(true)}
                                >
                                    Log In
                                </span>
                            </li>
                            <li className={styles.li}>
                                <span
                                    className={styles.signup}
                                    onClick={() => setShowSignup(true)}
                                >
                                    Sign Up
                                </span>
                            </li>
                        </>
                    ) : (
                        <>
                            <li
                                className={styles.li}
                                onMouseEnter={() => setMouseOnName(true)}
                                onMouseLeave={() => setMouseOnName(false)}
                            >
                                <span className={styles.username} >
                                    {username} <span className={styles.walletStatus}>(wallet not connected)</span>
                                </span>
                            </li>

                            <li className={styles.li}>
                                <Link href={"/create-mission"}>
                                    <span className={styles.element}>
                                        <RiPencilRuler2Line className={styles.pen}/>
                                        Create a task
                                    </span>
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>

            {showSignup && (
                <div>
                    <span className={styles.dark} onClick={() => setShowSignup(false)}></span>
                    <SignUp
                        token={(jwt) => {
                            localStorage.setItem('token', jwt)
                            setHasToken(() => true)
                        }}
                    />
                </div>
            )}

            {showLogin && (
                <div>
                    <span className={styles.dark} onClick={() => setShowLogin(false)}></span>
                    <Login
                        token={(jwt) => {
                            localStorage.setItem('token', jwt)
                            setHasToken(() => true)
                        }}
                    />
                </div>
            )}

            {showProfileMenu && (
                <div
                    className={styles.profileHover}
                    onMouseEnter={() => setMouseOnMenu(true)}
                    onMouseLeave={() => setMouseOnMenu(false)}
                >
                    <div className={styles.item}>
                        <CgProfile className={styles.profileLogo}/>
                        <Link href={"/profile"}>
                            <span className={styles.profileText}>
                                Profile
                            </span>
                        </Link>
                    </div>

                    <div className={styles.item}>
                        <FiLogOut className={styles.logoutLogo}/>
                        <span className={styles.logoutText} onClick={logout}>
                            Logout
                        </span>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
