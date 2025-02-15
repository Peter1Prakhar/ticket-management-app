import { useState, useEffect, useRef } from "react";
import { FiMenu } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import TicketForm from "../components/TicketForm";
import { db } from "../firebase"; // Ensure Firebase setup
import { doc, getDoc } from "firebase/firestore";
import Landing from "../components/Landing";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const sidebarRef = useRef(null);
  const uid = localStorage.getItem("user"); // Get logged-in user UID

  useEffect(() => {
    const getDocument = async () => {
      if (!uid) return; // If no UID, do nothing
      
      const docRef = doc(db, "users", uid);
      const snap = await getDoc(docRef);
      
      if (snap.exists()) {
        setUserRole(snap.data().role); // Assuming role is stored in Firestore
      } else {
        console.log("No such document!");
      }
    };

    getDocument();
  }, [uid]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    }

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Show sidebar only if user is logged in */}
      {uid && (
        <>
          {/* Sidebar */}
          <div
            ref={sidebarRef}
            className={`fixed inset-y-0 left-0 bg-white w-64 p-5 shadow-lg transform ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 z-50 rounded-r-lg`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-700">TailAdmin</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
              >
                <MdClose size={24} className="text-gray-600" />
              </button>
            </div>

            <nav className="space-y-3">
              {userRole === "customer" && (
                <button
                  onClick={() => (window.location.href = "/customer")}
                  className="w-full p-3 text-left text-gray-700 font-medium bg-gray-100 rounded-lg hover:bg-blue-500 hover:text-white transition"
                >
                  Customer
                </button>
              )}
              {userRole === "agent" && (
                <button
                  onClick={() => (window.location.href = "/agent")}
                  className="w-full p-3 text-left text-gray-700 font-medium bg-gray-100 rounded-lg hover:bg-blue-500 hover:text-white transition"
                >
                  All Customers
                </button>
              )}
              <button
                onClick={handleLogout}
                className="w-full p-3 text-left text-gray-700 font-medium bg-gray-100 rounded-lg hover:bg-blue-500 hover:text-white transition"
              >
                Logout
              </button>
            </nav>
          </div>

          {/* Overlay to close sidebar */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          {/* Show sidebar toggle button only if user is logged in */}
          {uid && (
            <button
              className="p-2 bg-white shadow rounded"
              onClick={() => setIsSidebarOpen(true)}
            >
              <FiMenu size={24} />
            </button>
          )}
        </div>

        {/* Show TicketForm if user is a customer, otherwise show login button */}
        {uid ? (
          userRole === "customer" ? (
            <TicketForm />
          ) : null // If the user is an agent, show nothing here
        ) : (
          <div className="fixed top-4 right-4 mb-4">
        <button
          onClick={() => (window.location.href = "/login")}
          className="p-3 bg-gray-200 rounded-lg hover:bg-blue-500 hover:text-white transition"
        >
          Login
        </button>
      </div>
        )}
        <Landing />
      </div>
    </div>
  );
}
