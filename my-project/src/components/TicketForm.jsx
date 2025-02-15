import { useState } from "react";
import { setDoc, doc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MdClose } from "react-icons/md";

const TicketForm = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !priority || !category || !email || !phone) {
      setError("All fields are required");
      return;
    }

    const ticketId = `ticket_${new Date().getTime()}`;
    const user = localStorage.getItem("user");
    try {
      await setDoc(doc(db, "tickets", ticketId), {
        title,
        description,
        priority,
        category,
        email,
        phone,
        status: "Open",
        createdBy: user,
        createdAt: new Date(),
      });

      alert("Ticket submitted successfully!");
      setIsFormOpen(false);
      setTitle("");
      setDescription("");
      setPriority("");
      setCategory("");
      setEmail("");
      setPhone("");
      setError("");
    } catch (error) {
      console.error("Error submitting ticket: ", error);
      setError("Failed to submit ticket. Try again.");
    }
  };
  return (
    <div>
      <div className="fixed top-4 right-4">
        <button
          onClick={() => setIsFormOpen(true)}
          className="p-3 bg-gray-200 rounded-lg hover:bg-blue-500 hover:text-white transition"
        >
          Submit Ticket
        </button>
      </div>
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Submit a Ticket</h2>
              <button onClick={() => setIsFormOpen(false)} className="p-2 bg-gray-200 hover:bg-gray-300">
                <MdClose size={24} />
              </button>
            </div>
            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" required />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border rounded" rows="3" required />
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full p-2 border rounded" required>
                <option value="">Select Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded" required>
                <option value="">Select Category</option>
                <option value="Technical">AC</option>
                <option value="Billing">AC(Seater)</option>
                <option value="General">Non-AC</option>
                <option value="General">Non-AC(Seater)</option>
              </select>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Contact Email" className="w-full p-2 border rounded" required />
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="w-full p-2 border rounded" required />
              <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default TicketForm;
