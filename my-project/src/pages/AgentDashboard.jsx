import React, { useState } from "react";
import { useTickets } from "../hooks/useAgentTickets";

export default function AgentDashboard() {
  const { tickets, agents, loading, updateTicketStatus, assignTicket, updateTicket, deleteTicket } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editTicket, setEditTicket] = useState(null);
  const [saving, setSaving] = useState(false); // Loader state for save button

  const handleEditChange = (field, value) => {
    setEditTicket((prev) => ({ ...prev, [field]: value }));
  };

  const saveEditTicket = async () => {
    if (editTicket) {
      setSaving(true); // Show loader
      await updateTicket(editTicket.id, {
        title: editTicket.title,
        priority: editTicket.priority,
        status: editTicket.status,
      });
      setSaving(false); // Hide loader
      setEditTicket(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-center mb-6">Support Dashboard</h1>

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
                <th className="p-3 text-left">Priority</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Created By</th>
                <th className="p-3 text-left">Assigned To</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="border-b bg-gray-50">
                  <td className="p-3">{ticket.id}</td>
                  <td className="p-3">{ticket.title}</td>
                  <td className="p-3">{ticket.priority}</td>
                  <td className="p-3">
                    <select
                      className="border p-2 rounded"
                      value={ticket.status}
                      onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td className="p-3">{ticket.createdBy}</td>
                  <td className="p-3">
                    <select
                      className="border p-2 rounded"
                      value={ticket.assignedTo || ""}
                      onChange={(e) => assignTicket(ticket.id, e.target.value)}
                    >
                      <option value="">Unassigned</option>
                      {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button onClick={() => setSelectedTicket(ticket)} className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">
                      View
                    </button>
                    <button onClick={() => setEditTicket(ticket)} className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600">
                      Edit
                    </button>
                    <button onClick={() => deleteTicket(ticket.id)} className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editTicket && (
        <div onClick={() => setEditTicket(null)} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-md" onClick={(e) => e.stopPropagation()}>
            <input className="border p-2 w-full mb-2" value={editTicket.title} onChange={(e) => handleEditChange("title", e.target.value)} />
            <input className="border p-2 w-full mb-2" value={editTicket.priority} onChange={(e) => handleEditChange("priority", e.target.value)} />
            <button onClick={saveEditTicket} className="px-4 py-2 bg-green-500 text-white rounded">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
