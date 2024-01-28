import express from 'express';
import Envio from '../models/envio.js';


const router = express.Router();

function calcular_costo_envio(distancia, peso, tipo_articulo) {
  let costo_por_km = 0.003;

  if (peso <= 15) {
    costo_por_km += 0.03;
  } else if (peso > 15 && peso <= 50) {
    costo_por_km += 0.05;
  } else if (peso > 50 && peso <= 100) {
    costo_por_km += 0.1;
  } else {
    costo_por_km += 0.15;
  }

  let recargo = 0;
  if (tipo_articulo === 'Mercancia') {
    recargo = 12.0;
  } else if (tipo_articulo === 'Documentos') {
    recargo = 8.0;
  }

  const costo_total = distancia * costo_por_km + recargo * 2;
  return costo_total;
}

router.post('/calcularEnvio', async (req, res) => {
  const { distancia, peso, tipo_articulo, valorDeclarado } = req.body;

  const flete = calcular_costo_envio(distancia, peso, tipo_articulo);

 
  const porcentajeProteccion = 0.01; 
  let proteccionEncomienda = valorDeclarado * porcentajeProteccion;
  const proteccionMinima = 5.0; 
  proteccionEncomienda = Math.max(proteccionEncomienda, proteccionMinima);

  const subtotal = flete + proteccionEncomienda;
  const iva = subtotal * 0.16; 
  const franqueoPostal = 2.0; 
  const totalAPagar = subtotal + iva + franqueoPostal;

  const nuevoEnvio = new Envio({
    distancia,
    peso,
    tipo_articulo,
    valorDeclarado,
    flete,
    proteccionEncomienda,
    subtotal,
    iva,
    franqueoPostal,
    totalAPagar,
  });
 ;

  res.json(nuevoEnvio);
});

router.post('/crearOrdenEnvio', async (req, res) => {
  const { usuarioId, datosEnvio, ruteInitial, ruteFinish  } = req.body;


  const trackingNumber = 'ENV' + Date.now(); 

  
  const nuevaOrdenEnvio = new Envio({
    ...datosEnvio,
    user: usuarioId, 
    trackingNumber,
    status: 'En proceso',
    ruteInitial,
    ruteFinish,
  });

  try {
    await nuevaOrdenEnvio.save();
    res.status(201).json({
      mensaje: 'Orden de envío creada con éxito',
      orden: nuevaOrdenEnvio
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear la orden de envío');
  }
});

router.post('/actualizarEstadoOrden', async (req, res) => {
  const { ordenId, nuevoEstado } = req.body;

  try {

    const ordenActualizada = await Envio.findByIdAndUpdate(
      ordenId,
      { status: nuevoEstado },
      { new: true } 
    );

    if (!ordenActualizada) {
      return res.status(404).send('Orden de envío no encontrada');
    }

    res.json({
      mensaje: 'Estado de la orden actualizado con éxito',
      orden: ordenActualizada
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar el estado de la orden');
  }
});

router.get('/ordenesEnvio', async (req, res) => {
  try {
    const ordenesEnvio = await Envio.find()
      .populate('user')
      .exec();

    res.json(ordenesEnvio);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener las órdenes de envío');
  }
});

router.get('/ordenesEnvioPorUsuario/:userId', async (req, res) => {
  try {
    const ordenesEnvio = await Envio.find({ user: req.params.userId })
      .populate('user')
      .exec();

    if (!ordenesEnvio || ordenesEnvio.length === 0) {
      return res.status(404).send('No se encontraron órdenes de envío para el usuario');
    }

    res.json(ordenesEnvio);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener las órdenes de envío del usuario');
  }
});




export default router;
