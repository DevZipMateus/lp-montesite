import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Schema de validação
const leadSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(8).max(20)
});

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validar dados recebidos
    const body = await req.json();
    const validatedData = leadSchema.parse(body);

    console.log('Enviando lead para RD Station:', { email: validatedData.email });

    // Configuração do RD Station
    const privateToken = Deno.env.get('RD_STATION_PRIVATE_TOKEN');
    if (!privateToken) {
      throw new Error('RD_STATION_PRIVATE_TOKEN não configurado');
    }

    // Montar payload da API
    const payload = {
      event_type: 'CONVERSION',
      event_family: 'CDP',
      payload: {
        conversion_identifier: 'Conversão - Formulário LP MonteSite',
        name: validatedData.name,
        email: validatedData.email,
        personal_phone: validatedData.phone,
        cf_origem: 'Landing Page MonteSite'
      }
    };

    // Chamar API do RD Station
    const response = await fetch('https://api.rd.services/platform/conversions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${privateToken}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erro da API RD Station:', response.status, errorData);
      
      return new Response(
        JSON.stringify({
          success: false,
          error: errorData.error_message || 'Erro ao enviar dados para o RD Station'
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const responseData = await response.json().catch(() => ({}));
    console.log('Lead enviado com sucesso:', responseData);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Lead cadastrado com sucesso!'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Erro no processamento:', error);

    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Dados inválidos. Verifique os campos.'
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Erro inesperado. Tente novamente.'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
