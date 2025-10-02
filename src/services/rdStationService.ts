import { z } from 'zod';

// Schema de validação
const leadSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  email: z.string().trim().email('Email inválido').max(255, 'Email muito longo'),
  phone: z.string().trim().min(8, 'Telefone inválido').max(20, 'Telefone muito longo')
});

// URL da Edge Function
const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rd-conversion`;

export interface LeadData {
  name: string;
  email: string;
  phone: string;
}

export interface ConversionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Envia dados de conversão para o RD Station Marketing
 */
export async function sendConversion(data: LeadData): Promise<ConversionResponse> {
  try {
    // Validar dados com Zod
    const validatedData = leadSchema.parse(data);

    // Fazer requisição à Edge Function
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
      },
      body: JSON.stringify(validatedData)
    });

    const responseData = await response.json();

    if (!response.ok || !responseData.success) {
      console.error('Erro ao enviar lead:', responseData);
      
      return {
        success: false,
        error: responseData.error || 'Erro ao enviar dados'
      };
    }

    console.log('Lead enviado com sucesso:', responseData);

    return {
      success: true,
      message: 'Lead cadastrado com sucesso!'
    };

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Erro de validação:', error.errors);
      return {
        success: false,
        error: 'Dados inválidos. Verifique os campos.'
      };
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Erro de rede:', error);
      return {
        success: false,
        error: 'Erro de conexão. Verifique sua internet.'
      };
    }

    console.error('Erro ao enviar conversão:', error);
    return {
      success: false,
      error: 'Erro inesperado. Tente novamente.'
    };
  }
}
