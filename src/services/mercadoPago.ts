/**
 * SERVICIO DE MERCADOPAGO - IMPLEMENTACIÓN SEGURA
 * ===============================================
 * 
 * Esta implementación se comunica con APIs serverless en Vercel
 * que protegen las credenciales de MercadoPago.
 * 
 * En modo desarrollo (TEST_MODE=true), se usa la implementación directa.
 * En producción (Vercel), se usan las APIs serverless automáticamente.
 */

export interface PaymentRequest {
  title: string;
  description: string;
  price: number;
  quantity: number;
  payer: {
    email: string;
    name?: string;
  };
}

export interface MercadoPagoResponse {
  id: string;
  init_point: string;
  sandbox_init_point: string;
  checkout_url?: string;
}

export interface PaymentStatus {
  payment_id: string;
  status: string;
  status_detail: string;
  payment_method_id: string;
  payment_type_id: string;
  transaction_amount: number;
  date_created: string;
  date_approved: string;
}

// URLs de las APIs
const API_BASE_URL = '/api';  // Vercel usa /api por defecto
const API_CREATE_PREFERENCE = `${API_BASE_URL}/mercadopago-create-preference`;
const API_CHECK_STATUS = `${API_BASE_URL}/mercadopago-check-status`;

/**
 * Crea una preferencia de pago segura usando la API de Vercel
 */
export const createPreference = async (paymentData: PaymentRequest): Promise<string> => {
  try {
    console.log("Iniciando creación de preferencia de pago segura...");
    console.log("Datos:", {
      title: paymentData.title,
      price: paymentData.price,
      email: paymentData.payer.email
    });
    
    const response = await fetch(API_CREATE_PREFERENCE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al crear preferencia:", response.status, errorText);
      throw new Error(`Error al crear preferencia: ${response.status} - ${errorText}`);
    }

    const result: MercadoPagoResponse = await response.json();
    console.log("Preferencia creada exitosamente:", result.id);

    // Usar la propiedad checkout_url si está disponible, de lo contrario buscar la apropiada
    const checkoutUrl = result.checkout_url || result.sandbox_init_point || result.init_point;
    
    if (!checkoutUrl) {
      throw new Error("No se recibió una URL de checkout válida desde la API");
    }
    
    console.log("URL de checkout:", checkoutUrl);
    
    return checkoutUrl;
    
  } catch (error) {
    console.error("Error detallado:", error);
    throw new Error(`Error al crear preferencia de pago: ${error.message || error}`);
  }
};

/**
 * Procesa un pago mediante la API de Vercel
 */
export const processPayment = async (
  projectTitle: string,
  amount: number,
  email: string,
  name?: string
): Promise<string> => {
  console.log(`Procesando donación de $${amount} para "${projectTitle}" - Usuario: ${email}`);
  
  const paymentData: PaymentRequest = {
    title: `Donación: ${projectTitle}`,
    description: `Donación para el proyecto: ${projectTitle}`,
    price: amount,
    quantity: 1,
    payer: {
      email: email,
      name: name
    }
  };
  
  return await createPreference(paymentData);
};

/**
 * Verifica el estado de un pago
 */
export const checkPaymentStatus = async (paymentId: string): Promise<PaymentStatus> => {
  try {
    console.log(`Verificando estado del pago ID: ${paymentId}`);
    
    const response = await fetch(`${API_CHECK_STATUS}?payment_id=${paymentId}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al verificar estado:", response.status, errorText);
      throw new Error(`Error al verificar estado: ${response.status} - ${errorText}`);
    }
    
    const status: PaymentStatus = await response.json();
    console.log(`Estado del pago ${paymentId}: ${status.status}`);
    
    return status;
    
  } catch (error) {
    console.error("Error al verificar estado:", error);
    throw new Error(`Error al verificar estado del pago: ${error.message || error}`);
  }
};
