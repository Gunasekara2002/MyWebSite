import Programme from '../models/programme.js';

export const createProgramme = async (req, res) => {
  try {
    const programme = new Programme(req.body);
    await programme.save();
    res.status(201).json(programme);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllProgrammes = async (req, res) => {
  try {
    const programmes = await Programme.find().sort({ createdAt: -1 });
    res.status(200).json(programmes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
