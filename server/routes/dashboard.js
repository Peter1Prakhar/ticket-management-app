import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';

const router = express.Router();

// Get dashboard stats (admin only)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    // Count total tickets
    const totalTickets = await Ticket.countDocuments();
    
    // Count tickets by status
    const activeTickets = await Ticket.countDocuments({ status: 'Active' });
    const pendingTickets = await Ticket.countDocuments({ status: 'Pending' });
    const closedTickets = await Ticket.countDocuments({ status: 'Closed' });
    
    // Count total customers
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    
    // Count total agents
    const totalAgents = await User.countDocuments({ role: 'agent' });
    
    // Count total admins
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    
    // Get recent tickets
    const recentTickets = await Ticket.find()
      .populate('customer', 'name email')
      .sort({ updatedAt: -1 })
      .limit(5);
    
    res.status(200).json({
      stats: {
        totalTickets,
        activeTickets,
        pendingTickets,
        closedTickets,
        totalCustomers,
        totalAgents,
        totalAdmins,
      },
      recentTickets,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;