# Ticket Detail Component

This React component displays detailed information about a support ticket, including its status, customer information, notes, and the ability to update the ticket status or add new notes.

## Features

- ✅ View ticket title, status, creation date, and customer details.
- 📝 View all notes associated with the ticket, including author and timestamp.
- 🔁 Add a new note using a form (text only for now).
- 🔄 Update the ticket's status (`Active`, `Pending`, or `Closed`) — only if the user is an agent.
- ⏳ Displays loading and error states during API operations.
- 🔐 Role-based actions depending on authentication context (agent vs customer).

---

## Technologies Used

- React 18+
- TypeScript
- React Router
- React Hook Form
- Date-fns
- React Hot Toast
- Tailwind CSS (or any utility-first CSS framework)
- Lucide React Icons

---

