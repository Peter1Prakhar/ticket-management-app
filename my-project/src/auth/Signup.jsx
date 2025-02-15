import { React, useState } from "react";
import { TEInput } from "tw-elements-react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../firebase";

export default function Signup() {
    const auth = getAuth(app);
    const db = getFirestore(app); // Initialize Firestore

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Loader state

    const handleRegister = () => {
        setIsLoading(true); // Start loader
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                localStorage.setItem("user", user.uid);

                await setDoc(doc(db, "users", user.uid), {
                    role: "customer",
                    email: email,
                });

                console.log("User Registered:", user);
                window.location.href = "/";
            })
            .catch((error) => {
                console.error("Error signing up:", error);
                setIsLoading(false); // Stop loader on error
            });
    };

    return (
        <section className="h-screen">
            <div className="h-full flex items-center justify-center">
                <div className="w-96 p-8 bg-white shadow-lg rounded-lg">
                    <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

                    <TEInput
                        type="email"
                        label="Email address"
                        size="lg"
                        className="mb-4"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TEInput
                        type="password"
                        label="Password"
                        size="lg"
                        className="mb-4"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* Signup Button with Loader */}
                    <button
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg flex justify-center items-center hover:bg-blue-600 transition duration-300 disabled:bg-gray-400"
                        onClick={handleRegister}
                        disabled={isLoading} // Disable button when loading
                    >
                        {isLoading ? (
                            <div className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></div>
                        ) : (
                            "Sign Up"
                        )}
                    </button>

                    <p className="mt-4 text-sm text-center">
                        Already have an account?{" "}
                        <a href="./login" className="text-blue-600 hover:underline">
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}
