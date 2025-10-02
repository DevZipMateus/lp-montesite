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

    // Configuração do RD Station - API Key Pública
    const apiKey = Deno.env.get('RD_STATION_PUBLIC_TOKEN');
    if (!apiKey) {
      throw new Error('RD_STATION_PUBLIC_TOKEN não configurado');
    }

    // Montar payload simplificado (sem event_type e event_family)
    const payload = {
      conversion_identifier: 'Conversão - Formulário LP MonteSite',
      name: validatedData.name,
      email: validatedData.email,
      personal_phone: validatedData.phone,
      cf_origem: 'Landing Page MonteSite'
    };

    console.log('Payload enviado:', JSON.stringify(payload, null, 2));

    // Chamar API do RD Station com API Key na URL
    const apiUrl = `https://api.rd.services/platform/conversions?api_key=${apiKey}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error('Erro da API RD Station:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText
      });
      
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { error_message: responseText };
      }
      
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
    console.log('Lead enviado com sucesso:', {
      status: response.status,
      data: responseData
    });

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
