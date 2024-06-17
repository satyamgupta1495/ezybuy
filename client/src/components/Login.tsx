import React, { useRef } from "react";
import { Link } from "react-router-dom";
import useLoginHook from "./hooks/useLoginHook";
import { Button } from "react-bootstrap";

export default function Login() {

    const { loginUser } = useLoginHook()

    const emailRef = useRef<any>()
    const passwordRef = useRef<any>()

    const handleLogin = (event: React.FormEvent) => {
        event.preventDefault();
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;
        loginUser({ email, password })
    };

    return (
        <>
            <div className="form-container ">
                <form className="form" onSubmit={handleLogin}>
                    <div className="flex gap-5">
                        <h3>Login</h3>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            ref={emailRef}
                            value={emailRef.current?.value}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="text"
                            id="password"
                            name="password"
                            ref={passwordRef}
                            value={passwordRef.current?.value}
                            required
                        />
                    </div>
                    <Button variant="outline-dark my-3" type="submit">Login</Button>
                    <p>{`Don't have an account yet?`}{<Link to='/signup'> Sign up</Link>} </p>
                </form>
            </div>
        </>
    )
}
