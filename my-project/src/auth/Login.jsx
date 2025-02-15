import { useState } from "react";
import { TEInput } from "tw-elements-react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const auth = getAuth(app);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true); // Start loading

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                localStorage.setItem("user", userCredential.user.uid);
                console.log("User logged in:", userCredential.user);
                navigate("/");
            })
            .catch(() => {
                setError("Invalid email or password. Please try again.");
                setIsLoading(false); // Stop loading on error
            });
    };

    return (
        <section className="h-screen">
            <div className="h-full flex items-center justify-center">
                <div className="w-96 p-8 bg-white shadow-lg rounded-lg">
                    <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <TEInput
                        type="email"
                        label="Email address"
                        size="lg"
                        className="mb-4"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TEInput
                        type="password"
                        label="Password"
                        size="lg"
                        className="mb-4"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* Login Button with Loader */}
                    <button
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded flex justify-center items-center hover:bg-blue-600 transition duration-300 disabled:bg-gray-400"
                        onClick={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></div>
                        ) : (
                            "Login"
                        )}
                    </button>

                    <p className="mt-4 text-sm text-center">
                        Don't have an account?{" "}
                        <a href="./signup" className="text-blue-600 hover:underline">
                            Sign Up
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}
