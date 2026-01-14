import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(e) {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (data.success) {
                navigate("/business");
            } else {
                setError("Invalid credentials");
            }
        } catch (err) {
            setError("Could not connect to server");
        }
    }

    return (
        <div className="login-wrapper">
            {/* Background diamond */}
            <div className="diamond"></div>

            {/* Login form */}
            <form className="login-card" onSubmit={handleLogin}>
                <h2 style={{ textAlign: "center", marginBottom: "25px" }}>Login</h2>

                {/* EMAIL */}
                <div className="input-field">
                    <i className="fas fa-user"></i>
                    <input
                        type="text"
                        placeholder="Email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                {/* PASSWORD */}
                <div className="input-field">
                    <i className="fas fa-lock"></i>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* BUTTON */}
                <button className="login-btn" type="submit">
                    LOGIN
                </button>

                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}
