// models/employee.js
import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name:  String,
  nic:       String,
  phone:     String,
  position:  String,
  email:     String,
  address:   String,
  dateofbirth:      String,
  dateofappointment:  String,
  dateofretirement:   String
});

export default mongoose.model('Employee', employeeSchema);

