const mongoose = require('mongoose');

const horaSchema = new mongoose.Schema({
  inicio: { type: String, required: true },
  fin: { type: String, required: true }
});

const disponibilidadSchema = new mongoose.Schema({
  dia: { type: String, required: true },
  horas: [horaSchema]
});

const doctorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  especialidad: { type: String, required: true },
  disponibilidad: [disponibilidadSchema]
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
