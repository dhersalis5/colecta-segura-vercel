/**
 * SERVICIO DE MERCADOPAGO - IMPLEMENTACIÓN DIRECTA
 * ==============================================
 * 
 * IMPORTANTE: Este archivo es para entornos de DESARROLLO y PRUEBA ÚNICAMENTE.
 * Para producción, se debe implementar una solución backend que proteja el access token.
 * 
 * Opciones para producción:
 * 1. Serverless functions de Vercel (implementación actual)
 * 2. Backend Node.js (Express)
 * 3. Otras funciones serverless (Netlify, AWS Lambda, etc.)
 */

export interface PaymentRequestDirect {
  title: string;
  description: string;
  price: number;
  quantity: number;
  payer: {
    email: string;
    name?: string;
  };
}

// CONFIGURACIÓN DE MERCADOPAGO
// ============================
// Token de prueba - úsalo solo para testeo
const MERCADOPAGO_ACCESS_TOKEN = "TEST-3802957432501116-062816-ac4a26889b0ebb55a9b5d0bd6f8dbd15-265663532";

// Ajusta según tu país
// MXN: México, ARS: Argentina, CLP: Chile, COP: Colombia, PEN: Perú, BRL: Brasil
const CURRENCY_ID = "ARS";

/**
 * Crea una preferencia de pago directamente con MercadoPago
 */
export const createPreferenceDirect = async (paymentData: PaymentRequestDirect): Promise<string> => {
  try {
    console.log("Creando preferencia directamente con MercadoPago...");
    console.log("Datos:", {
      title: paymentData.title,
      price: paymentData.price,
      email: paymentData.payer.email
    });
    
    // Verificar que tenemos un token válido
    if (!MERCADOPAGO_ACCESS_TOKEN || MERCADOPAGO_ACCESS_TOKEN.trim() === "") {
      throw new Error("No hay token de MercadoPago configurado. Contacta al administrador.");
    }
    
    // Mostrar solo los primeros y últimos caracteres del token por seguridad
    const tokenStart = MERCADOPAGO_ACCESS_TOKEN.substring(0, 10);
    const tokenEnd = MERCADOPAGO_ACCESS_TOKEN.substring(MERCADOPAGO_ACCESS_TOKEN.length - 5);
    console.log(`Usando token: ${tokenStart}...${tokenEnd}`);
    
    // Preparar los datos para MercadoPago
    const mercadoPagoData = {
      items: [
        {
          title: paymentData.title,
          description: paymentData.description,
          quantity: paymentData.quantity,
          currency_id: CURRENCY_ID,
          unit_price: paymentData.price
        }
      ],
      payer: {
        email: paymentData.payer.email,
        name: paymentData.payer.name || "Usuario de prueba"
      },
      back_urls: {
        success: window.location.origin + "/donation-success",
        failure: window.location.origin + "/donation-failure",
        pending: window.location.origin + "/donation-pending"
      },
      auto_return: "approved",
      statement_descriptor: "Colecta Segura"
    };
    
    console.log("Enviando solicitud a MercadoPago...");
    
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
      },
      body: JSON.stringify(mercadoPagoData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error en la respuesta de MercadoPago:", response.status, errorText);
      
      // Mejorar el mensaje de error según el código de error
      if (response.status === 401) {
        throw new Error("Error de autenticación: El token de MercadoPago no es válido o expiró.");
      } else if (response.status === 400) {
        throw new Error(`Error en los datos enviados: ${errorText}`);
      } else {
        throw new Error(`Error de MercadoPago (${response.status}): ${errorText}`);
      }
    }

    const result = await response.json();
    console.log("Preferencia creada exitosamente:", result.id);

    // Usar sandbox_init_point para pruebas, init_point para producción
    const checkoutUrl = result.sandbox_init_point || result.init_point;
    console.log("URL de checkout:", checkoutUrl);
    
    if (!checkoutUrl) {
      throw new Error("No se recibió una URL de checkout válida");
    }
    
    return checkoutUrl;
    
  } catch (error) {
    console.error("Error detallado al crear preferencia:", error);
    // Re-lanzar el error para que se maneje en el componente
    throw error;
  }
};

/**
 * Procesa un pago mediante MercadoPago
 */
export const processPaymentDirect = async (
  projectTitle: string,
  amount: number,
  email: string,
  name?: string
): Promise<string> => {
  console.log(`Procesando donación de $${amount} para "${projectTitle}" - Usuario: ${email}`);
  
  const paymentData: PaymentRequestDirect = {
    title: `Donación: ${projectTitle}`,
    description: `Donación para el proyecto: ${projectTitle}`,
    price: amount,
    quantity: 1,
    payer: {
      email: email,
      name: name
    }
  };
  
  return await createPreferenceDirect(paymentData);
}; 