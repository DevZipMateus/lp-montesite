import { z } from 'zod';

// Schema de validação
const leadSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  email: z.string().trim().email('Email inválido').max(255, 'Email muito longo'),
  phone: z.string().trim().min(8, 'Telefone inválido').max(20, 'Telefone muito longo')
});

// Configuração do RD Station
const RD_STATION_CONFIG = {
  publicToken: '004614e99c43a7bca7b23af79bdcae34',
  privateToken: 'c55d9a443010ef5a233cdbe02983be35',
  conversionIdentifier: 'Conversão - Formulário LP MonteSite',
  apiUrl: 'https://api.rd.services/platform/conversions'
};

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

    // Montar payload da API
    const payload = {
      event_type: 'CONVERSION',
      event_family: 'CDP',
      payload: {
        conversion_identifier: RD_STATION_CONFIG.conversionIdentifier,
        name: validatedData.name,
        email: validatedData.email,
        personal_phone: validatedData.phone,
        cf_origem: 'Landing Page MonteSite'
      }
    };

    // Fazer requisição à API do RD Station
    const response = await fetch(RD_STATION_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RD_STATION_CONFIG.privateToken}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erro da API RD Station:', errorData);
      
      return {
        success: false,
        error: errorData.error_message || 'Erro ao enviar dados para o RD Station'
      };
    }

    const responseData = await response.json().catch(() => ({}));
    console.log('Lead enviado com sucesso ao RD Station:', responseData);

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
