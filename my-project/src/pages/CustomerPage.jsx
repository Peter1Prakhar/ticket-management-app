import React from "react";
import { useCustomerTickets } from "../hooks/useCustomerTickets";

export default function CustomerPage() {
  const { tickets, loading, deleteTicket } = useCustomerTickets();

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-center mb-6">Your Tickets</h1>

      {loading ? (
        <p className="text-gray-500 text-center">Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p className="text-gray-500 text-center">No tickets available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Ticket ID</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket, index) => (
                <tr key={ticket.id} className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                  <td className="p-3">{ticket.id}</td>
                  <td className="p-3">{ticket.title}</td>
                  <td className="p-3">{ticket.status}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => deleteTicket(ticket.id)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
