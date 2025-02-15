import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

export function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      const ticketsCollection = collection(db, "tickets");
      const ticketSnapshot = await getDocs(ticketsCollection);
      setTickets(ticketSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    const fetchAgents = async () => {
      const agentsCollection = collection(db, "agents");
      const agentSnapshot = await getDocs(agentsCollection);
      setAgents(agentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    Promise.all([fetchTickets(), fetchAgents()]).then(() => setLoading(false));
  }, []);

  const updateTicketStatus = async (ticketId, newStatus) => {
    const ticketRef = doc(db, "tickets", ticketId);
    await updateDoc(ticketRef, { status: newStatus });

    setTickets((prevTickets) =>
      prevTickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket))
    );
  };

  const assignTicket = async (ticketId, newAgentId) => {
    const ticketRef = doc(db, "tickets", ticketId);
    await updateDoc(ticketRef, { assignedTo: newAgentId });

    setTickets((prevTickets) =>
      prevTickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, assignedTo: newAgentId } : ticket))
    );
  };

  const updateTicket = async (ticketId, updatedData) => {
    const ticketRef = doc(db, "tickets", ticketId);
    await updateDoc(ticketRef, updatedData);

    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, ...updatedData } : ticket
      )
    );
  };

  const deleteTicket = async (ticketId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this ticket?");
    if (confirmDelete) {
      await deleteDoc(doc(db, "tickets", ticketId));
      setTickets((prevTickets) => prevTickets.filter((ticket) => ticket.id !== ticketId));
    }
  };

  return {
    tickets,
    agents,
    loading,
    updateTicketStatus,
    assignTicket,
    updateTicket,
    deleteTicket,
  };
}
