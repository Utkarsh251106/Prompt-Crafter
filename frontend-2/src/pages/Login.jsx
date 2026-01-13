import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <div className="center-container">
            <form className="card" onSubmit={handleLogin}>
                <h2>Login</h2>

                <label>Email</label>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Login</button>

                <p>{message}</p>
            </form>
        </div>
    );
}
