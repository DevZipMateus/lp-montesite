import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Schema de validação
const leadSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(8).max(20)
});

// Função para obter Access Token via OAuth2
async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
  console.log('Obtendo access token via OAuth2...');
  
  // Criar body no formato x-www-form-urlencoded
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials'
  });
  
  // Implementar retry para 5xx (502 intermitente do RD)
  for (let attempt = 1; attempt <= 3; attempt++) {
    const response = await fetch('https://api.rd.services/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: body
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Access token obtido com sucesso');
      return data.access_token;
    }

    const errorText = await response.text();
    console.error(`Falha ao obter token (tentativa ${attempt}/3):`, {
      status: response.status,
      body: errorText.substring(0, 200) // Limitar log
    });

    // Retry apenas em 5xx
    if (response.status >= 500 && attempt < 3) {
      const delay = attempt === 1 ? 250 : 750;
      console.log(`Aguardando ${delay}ms antes de tentar novamente...`);
      await new Promise(r => setTimeout(r, delay));
      continue;
    }

    // Falha definitiva
    throw new Error(`Falha na autenticação OAuth2 (${response.status})`);
  }
  
  throw new Error('Falha na autenticação OAuth2 após retries');
}

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

    // Configuração OAuth2 do RD Station
    const clientId = Deno.env.get('RD_STATION_CLIENT_ID');
    const clientSecret = Deno.env.get('RD_STATION_PRIVATE_TOKEN');
    
    if (!clientId || !clientSecret) {
      throw new Error('Credenciais OAuth2 não configuradas');
    }

    // Obter access token via OAuth2
    const accessToken = await getAccessToken(clientId, clientSecret);

    // Montar payload no formato de Events (API 2.0)
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

    console.log('Payload enviado:', JSON.stringify(payload, null, 2));

    // Chamar API do RD Station Events com OAuth2
    const apiUrl = 'https://api.rd.services/platform/events';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
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
      let errorMessage = 'Erro ao enviar dados para o RD Station';
      try {
        errorData = JSON.parse(responseText);
        // Concatenar múltiplos erros se existirem
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors
            .map((e: any) => `${e.path}: ${e.error_message}`)
            .join('; ');
        } else if (errorData.error_message) {
          errorMessage = errorData.error_message;
        }
      } catch {
        errorMessage = responseText || errorMessage;
      }
      
      return new Response(
        JSON.stringify({
          success: false,
          error: errorMessage
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
