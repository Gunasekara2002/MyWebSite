// server/controllers/leaveController.js
/*import Leave from '../models/leaveModel.js';

export const createLeave = async (req, res) => {
  try {
    const leave = new Leave(req.body);
    await leave.save();
    res.status(201).json(leave);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Delete leave by ID
exports.deleteLeave = async (req, res) => {
  try {
    await Leave.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Leave deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting leave' });
  }
};
// Update leave by ID
exports.updateLeave = async (req, res) => {
  try {
    const updatedLeave = await Leave.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedLeave);
  } catch (err) {
    res.status(500).json({ error: 'Error updating leave' });
  }
};
*/
import Leave from '../models/leaveModel.js';

// Create Leave
export const createLeave = async (req, res) => {
  try {
    const leave = new Leave(req.body);
    await leave.save();
    res.status(201).json(leave);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all Leaves
export const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Leave by ID
export const deleteLeave = async (req, res) => {
  try {
    await Leave.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Leave deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting leave' });
  }
};

// Update Leave by ID
export const updateLeave = async (req, res) => {
  try {
    const updatedLeave = await Leave.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedLeave);
  } catch (err) {
    res.status(500).json({ error: 'Error updating leave' });
  }
};


