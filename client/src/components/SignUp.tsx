import { useRef } from "react"
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import useLoginHook from "./hooks/useLoginHook";

export default function SignUp() {

    const { registerUser } = useLoginHook()

    const emailRef = useRef<any>()
    const passwordRef = useRef<any>()

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        registerUser({ email: emailRef.current?.value, password: passwordRef.current?.value })

    };

    return (

        <div className="form-container">
            <form className="form" onSubmit={handleSubmit}>
                <h3>Signup</h3>
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
                        value={emailRef.current?.value}
                        required
                    />
                </div>
                <Button variant="dark" type="submit">Sign up</Button>
                <p>{`Already have an account?`} {<Link to='/login'> Login</Link>} </p>
            </form>
        </div>
    )
}
