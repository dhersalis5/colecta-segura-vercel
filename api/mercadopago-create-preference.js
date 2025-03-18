// API para crear preferencia de pago en MercadoPago
// Endpoint: /api/mercadopago-create-preference

export default async function handler(req, res) {
  // Manejar solicitudes OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Verificar método
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Obtener token desde variable de entorno
    const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!MERCADOPAGO_ACCESS_TOKEN) {
      console.error('Error: MERCADOPAGO_ACCESS_TOKEN no está configurado');
      throw new Error('Error de configuración: Token de MercadoPago no disponible');
    }

    // Obtener datos del cuerpo de la solicitud
    const { title, description, price, quantity, payer } = req.body;
    
    // Validar datos requeridos
    if (!title || !price || !payer || !payer.email) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    console.log('Creando preferencia en MercadoPago...', {
      title,
      price,
      email: payer.email
    });

    // Configurar moneda según el país
    const CURRENCY_ID = process.env.CURRENCY_ID || 'ARS';

    // Determinar URLs de retorno
    const origin = req.headers.origin || 'https://colecta-segura.vercel.app';
    
    // Mostrar información sobre el token (sin revelar el token completo)
    const tokenStart = MERCADOPAGO_ACCESS_TOKEN.substring(0, 8);
    const tokenEnd = MERCADOPAGO_ACCESS_TOKEN.substring(MERCADOPAGO_ACCESS_TOKEN.length - 4);
    console.log(`Usando token de producción: ${tokenStart}...${tokenEnd}`);
    
    // Crear preferencia en MercadoPago
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        items: [
          {
            title,
            description: description || title,
            quantity: quantity || 1,
            currency_id: CURRENCY_ID,
            unit_price: price
          }
        ],
        payer: {
          email: payer.email,
          name: payer.name || 'Usuario'
        },
        back_urls: {
          success: `${origin}/donation-success`,
          failure: `${origin}/donation-failure`,
          pending: `${origin}/donation-pending`
        },
        auto_return: 'approved',
        statement_descriptor: 'Colecta Segura'
      })
    });

    // Manejar respuesta
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error de MercadoPago:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `Error de MercadoPago: ${response.status}`,
        details: errorText
      });
    }

    // Devolver URL de pago
    const result = await response.json();
    console.log('Preferencia creada:', result.id);
    
    // En producción, usar init_point en lugar de sandbox_init_point
    const useProduction = !MERCADOPAGO_ACCESS_TOKEN.startsWith('TEST-');
    
    return res.status(200).json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
      // Proporcionar la URL apropiada según el entorno
      checkout_url: useProduction ? result.init_point : result.sandbox_init_point
    });

  } catch (error) {
    console.error('Error en servidor:', error);
    return res.status(500).json({ 
      error: 'Error del servidor', 
      message: error.message 
    });
  }
} 