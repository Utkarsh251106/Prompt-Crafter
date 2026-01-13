import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleLogin(e) {
        e.preventDefault();

        const res = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: email, password }),
        });

        const data = await res.json();

        if (data.success) {
            localStorage.setItem("loggedIn", "true");
            navigate("/home");
        } else {
            setMessage("Invalid login!");
        }
    }

    return (
        <div className="login-wrapper">

            {/* Background diamond */}
            <div className="diamond"></div>

            {/* Login box */}
            <form className="login-card" onSubmit={handleLogin}>

                {/* Email Input */}
                <div className="input-field">
                    <i className="fa fa-user"></i>
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* Password Input */}
                <div className="input-field">
                    <i className="fa fa-lock"></i>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit" className="login-btn">
                    LOGIN
                </button>

                <p style={{ color: "salmon", marginTop: "10px", textAlign: "center" }}>
                    {message}
                </p>
            </form>
        </div>
    );
}
