
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const MERCADOPAGO_ACCESS_TOKEN = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN") || "";
const MERCADOPAGO_API_URL = "https://api.mercadopago.com/checkout/preferences";

interface RequestBody {
  title: string;
  description: string;
  price: number;
  quantity: number;
  currency_id: string;
  payer: {
    email: string;
    name?: string;
    surname?: string;
  };
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return: string;
  statement_descriptor: string;
}

serve(async (req) => {
  // Verificar método de solicitud
  if (req.method !== "POST") {
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

    // Obtener y validar datos de la solicitud
    const requestData: RequestBody = await req.json();
    
    // Configurar el cuerpo de la solicitud para MercadoPago
    const mercadoPagoBody = {
      items: [
        {
          title: requestData.title,
          description: requestData.description,
          quantity: requestData.quantity,
          unit_price: requestData.price,
          currency_id: requestData.currency_id
        }
      ],
      payer: requestData.payer,
      back_urls: requestData.back_urls,
      auto_return: requestData.auto_return,
      statement_descriptor: requestData.statement_descriptor
    };

    // Llamar a la API de MercadoPago
    const response = await fetch(MERCADOPAGO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
      },
      body: JSON.stringify(mercadoPagoBody)
    });

    // Manejar respuesta
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error en la respuesta de MercadoPago:", errorData);
      throw new Error(`Error ${response.status}: ${errorData.message || "Error al crear la preferencia"}`);
    }

    const data = await response.json();
    
    // En producción, siempre usar init_point
    return new Response(
      JSON.stringify({ checkout_url: data.init_point, id: data.id }),
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
