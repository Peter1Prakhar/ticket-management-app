import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Note text is required'],
  },
  attachments: [
    {
      filename: String,
      path: String,
      mimetype: String,
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TicketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Closed'],
    default: 'Active',
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  notes: [NoteSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field when a new note is added
TicketSchema.pre('save', function (next) {
  if (this.isModified('notes')) {
    this.updatedAt = Date.now();
  }
  next();
});

const Ticket = mongoose.model('Ticket', TicketSchema);

export default Ticket;