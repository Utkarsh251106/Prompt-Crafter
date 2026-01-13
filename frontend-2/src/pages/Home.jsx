import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem("loggedIn");
        navigate("/");
    }

    return (
        <div className="center-container">
            <div className="card">
                <h1>Welcome!</h1>
                <p>You are successfully logged in.</p>

                <button onClick={() => navigate("/business")}>
                    Go to Business Details
                </button>

                <button onClick={logout}>Logout</button>
            </div>
        </div>
    );
}
