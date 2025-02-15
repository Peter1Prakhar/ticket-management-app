import { useState, useEffect } from "react";
import { getDocs, collection, query, where, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase"; // Firebase config

export function useCustomerTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = localStorage.getItem("user"); // Get user UID from localStorage

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const q = query(collection(db, "tickets"), where("createdBy", "==", user));
        const querySnapshot = await getDocs(q);
        const ticketsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTickets(ticketsList);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  const deleteTicket = async (ticketId) => {
    try {
      const ticketRef = doc(db, "tickets", ticketId);
      await deleteDoc(ticketRef);
      setTickets((prevTickets) => prevTickets.filter((ticket) => ticket.id !== ticketId));
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  return { tickets, loading, deleteTicket };
}
