import Service from '../models/Service.js';
import { sendServiceConfirmationEmail } from "../utils/emailservice.js";

export const submitServiceForm = async (req, res) => {
  try {
    const { type } = req.params;
    const formData = req.body;
    const files = req.files?.map(file => ({
      filename: file.originalname,
      /*url: `/uploads/${file.filename}`,*/
    })) || [];

    const service = await Service.create({
      serviceType: type,
      formData,
      files,
      user: req.user._id,
    });

    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: 'Error submitting form', error: err.message });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate('user', 'email');
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching services' });
  }
};
