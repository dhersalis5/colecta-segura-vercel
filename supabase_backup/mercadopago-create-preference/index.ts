import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

// Definición del objeto request para MercadoPago
interface MercadoPagoRequest {
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

// Función principal
serve(async (req: Request) => {
  try {
    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Verificar método
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Obtener datos del request
    const requestData: MercadoPagoRequest = await req.json();

    // Validar datos requeridos
    if (!requestData.title || !requestData.price || !requestData.payer.email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Acceder a variables de entorno en Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Obtener las credenciales de MercadoPago desde la base de datos
    const { data, error } = await supabaseClient
      .from('secrets')
      .select('value')
      .eq('name', 'MERCADOPAGO_ACCESS_TOKEN')
      .single();

    if (error || !data) {
      console.error('Error fetching MercadoPago credentials:', error);
      return new Response(
        JSON.stringify({ error: 'Error accessing payment provider credentials' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const accessToken = data.value;

    // Crear preferencia de pago en MercadoPago
    const mercadoPagoResponse = await fetch(
      'https://api.mercadopago.com/checkout/preferences',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          items: [
            {
              title: requestData.title,
              description: requestData.description,
              quantity: requestData.quantity,
              currency_id: requestData.currency_id,
              unit_price: requestData.price,
            },
          ],
          payer: requestData.payer,
          back_urls: requestData.back_urls,
          auto_return: requestData.auto_return,
          statement_descriptor: requestData.statement_descriptor,
        }),
      }
    );

    const mercadoPagoData = await mercadoPagoResponse.json();

    if (!mercadoPagoResponse.ok) {
      console.error('MercadoPago API error:', mercadoPagoData);
      return new Response(
        JSON.stringify({ error: 'Error creating payment preference' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Devolver la URL de checkout
    return new Response(
      JSON.stringify({
        checkout_url: Deno.env.get('DENO_ENV') === 'production'
          ? mercadoPagoData.init_point
          : mercadoPagoData.sandbox_init_point,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}); 