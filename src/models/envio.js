import mongoose from 'mongoose';
const { Schema } = mongoose;

const envioSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  distancia: { type: Number, required: false },
  peso: { type: Number, required: false },
  tipo_articulo: { type: String, required: false },
  flete: { type: Number, required: false },
  proteccionEncomienda: { type: Number, required: false },
  subtotal: { type: Number, required: false },
  iva: { type: Number, required: false },
  franqueoPostal: { type: Number, required: false },
  totalAPagar: { type: Number, required: false },
  status: { type: String, required: true, default: 'En proceso' },
  trackingNumber: { type: String, required: true },
  ruteInitial: { type: String, required: false },
  ruteFinish: { type: String, required: false },
});

const Envio = mongoose.model('Envio', envioSchema);

export default Envio;
