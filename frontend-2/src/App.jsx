import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Business from "./pages/Business";

function ProtectedRoute({ children }) {
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    return loggedIn ? children : <Navigate to="/" />;
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />

            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/business"
                element={
                    <ProtectedRoute>
                        <Business />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}
