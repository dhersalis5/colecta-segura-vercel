
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const MERCADOPAGO_ACCESS_TOKEN = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN") || "";

serve(async (req) => {
  // Verificar método de solicitud
  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Verificar token de acceso
    if (!MERCADOPAGO_ACCESS_TOKEN) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN no configurado en las variables de entorno");
    }

    // Obtener el ID del pago de la URL
    const url = new URL(req.url);
    const paymentId = url.searchParams.get("payment_id");
    
    if (!paymentId) {
      throw new Error("payment_id es requerido");
    }

    // Llamar a la API de MercadoPago para verificar el estado del pago
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
      }
    });

    // Manejar respuesta
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error en la respuesta de MercadoPago:", errorData);
      throw new Error(`Error ${response.status}: ${errorData.message || "Error al verificar el pago"}`);
    }

    const paymentData = await response.json();
    
    return new Response(
      JSON.stringify({ 
        status: paymentData.status,
        status_detail: paymentData.status_detail,
        id: paymentData.id
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error.message);
    
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
