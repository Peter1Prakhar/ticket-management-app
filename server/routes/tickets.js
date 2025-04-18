import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticate, authorize } from '../middleware/auth.js';
import Ticket from '../models/Ticket.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Get all tickets (for agents and admins)
router.get('/', authenticate, async (req, res) => {
  try {
    let tickets;
    
    // Customers can only see their own tickets
    if (req.user.role === 'customer') {
      tickets = await Ticket.find({ customer: req.user._id })
        .populate('customer', 'name email')
        .populate('notes.createdBy', 'name role')
        .sort({ updatedAt: -1 });
    } else {
      // Agents and admins can see all tickets
      tickets = await Ticket.find()
        .populate('customer', 'name email')
        .populate('notes.createdBy', 'name role')
        .sort({ updatedAt: -1 });
    }
    
    res.status(200).json({ tickets });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single ticket by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('notes.createdBy', 'name role');
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Check if user has permission to view this ticket
    if (
      req.user.role === 'customer' &&
      ticket.customer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this ticket' });
    }
    
    res.status(200).json({ ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new ticket
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, initialNote } = req.body;
    
    const ticket = new Ticket({
      title,
      customer: req.user._id,
      notes: [{
        text: initialNote,
        createdBy: req.user._id,
      }],
    });
    
    await ticket.save();
    
    res.status(201).json({
      ticket: await Ticket.findById(ticket._id)
        .populate('customer', 'name email')
        .populate('notes.createdBy', 'name role'),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add note to ticket
router.post('/:id/notes', authenticate, upload.array('attachments', 5), async (req, res) => {
  try {
    const { text } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Check if user has permission to add note to this ticket
    if (
      req.user.role === 'customer' &&
      ticket.customer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to update this ticket' });
    }
    
    // Prepare attachments
    const attachments = req.files?.map(file => ({
      filename: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
    })) || [];
    
    // Add new note
    ticket.notes.push({
      text,
      attachments,
      createdBy: req.user._id,
    });
    
    // Update last updated time
    ticket.updatedAt = Date.now();
    
    await ticket.save();
    
    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('customer', 'name email')
      .populate('notes.createdBy', 'name role');
    
    res.status(200).json({ ticket: updatedTicket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update ticket status (agents and admins only)
router.patch('/:id/status', authenticate, authorize('agent', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Active', 'Pending', 'Closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    ticket.status = status;
    ticket.updatedAt = Date.now();
    
    await ticket.save();
    
    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('customer', 'name email')
      .populate('notes.createdBy', 'name role');
    
    res.status(200).json({ ticket: updatedTicket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;