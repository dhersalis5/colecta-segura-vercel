// API para verificar estado de pago en MercadoPago
// Endpoint: /api/mercadopago-check-status

export default async function handler(req, res) {
  // Manejar solicitudes OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Verificar método
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Obtener token desde variable de entorno
    const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!MERCADOPAGO_ACCESS_TOKEN) {
      console.error('Error: MERCADOPAGO_ACCESS_TOKEN no está configurado');
      throw new Error('Error de configuración: Token de MercadoPago no disponible');
    }

    // Obtener payment_id de la consulta
    const { payment_id } = req.query;
    
    if (!payment_id) {
      return res.status(400).json({ error: 'Se requiere payment_id' });
    }

    console.log(`Verificando estado del pago ID: ${payment_id}`);
    
    // Mostrar información sobre el token (sin revelar el token completo)
    const tokenStart = MERCADOPAGO_ACCESS_TOKEN.substring(0, 8);
    const tokenEnd = MERCADOPAGO_ACCESS_TOKEN.substring(MERCADOPAGO_ACCESS_TOKEN.length - 4);
    console.log(`Usando token: ${tokenStart}...${tokenEnd}`);

    // Consultar estado del pago
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${payment_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
      }
    });

    // Manejar respuesta
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error al verificar pago:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `Error al verificar pago: ${response.status}`,
        details: errorText
      });
    }

    // Procesar resultado
    const paymentData = await response.json();
    console.log(`Estado del pago ${payment_id}: ${paymentData.status}`);
    
    return res.status(200).json({
      payment_id: paymentData.id,
      status: paymentData.status,
      status_detail: paymentData.status_detail,
      payment_method_id: paymentData.payment_method_id,
      payment_type_id: paymentData.payment_type_id,
      transaction_amount: paymentData.transaction_amount,
      date_created: paymentData.date_created,
      date_approved: paymentData.date_approved,
      is_production: !MERCADOPAGO_ACCESS_TOKEN.startsWith('TEST-')
    });

  } catch (error) {
    console.error('Error en servidor:', error);
    return res.status(500).json({ 
      error: 'Error del servidor', 
      message: error.message 
    });
  }
} 