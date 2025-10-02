import React, { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
}

interface ContactFormProps {
  onSubmit?: (data: FormData) => Promise<void>;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Chama a função onSubmit que virá do HeroSection
        await onSubmit?.(formData);
        
        // Reset form after successful submission
        setFormData({ name: '', email: '', phone: '' });
        setErrors({});
      } catch (error) {
        // Erros serão tratados no HeroSection
        console.error('Erro ao submeter formulário:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-full">
      <div className="mb-3 sm:mb-4">
        <label 
          htmlFor="name"
          className="block text-[#596780] text-sm sm:text-base font-normal leading-6 tracking-tight mb-2"
        >
          Nome
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={handleInputChange('name')}
          className={`w-full h-11 sm:h-12 rounded border bg-[#F6F6F6] border-solid px-3 sm:px-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#0084FF] transition-all ${
            errors.name ? 'border-red-500' : 'border-[#97A0B0]'
          }`}
          placeholder="Digite seu nome"
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <span id="name-error" className="text-red-500 text-xs sm:text-sm mt-1 block" role="alert">
            {errors.name}
          </span>
        )}
      </div>

      <div className="mb-3 sm:mb-4">
        <label 
          htmlFor="email"
          className="block text-[#596780] text-sm sm:text-base font-normal leading-6 tracking-tight mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          className={`w-full h-11 sm:h-12 rounded border bg-[#F6F6F6] border-solid px-3 sm:px-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#0084FF] transition-all ${
            errors.email ? 'border-red-500' : 'border-[#97A0B0]'
          }`}
          placeholder="Digite seu email"
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" className="text-red-500 text-xs sm:text-sm mt-1 block" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      <div className="mb-5 sm:mb-6">
        <label 
          htmlFor="phone"
          className="block text-[#596780] text-sm sm:text-base font-normal leading-6 tracking-tight mb-2"
        >
          Telefone
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={handleInputChange('phone')}
          className={`w-full h-11 sm:h-12 rounded border bg-[#F6F6F6] border-solid px-3 sm:px-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#0084FF] transition-all ${
            errors.phone ? 'border-red-500' : 'border-[#97A0B0]'
          }`}
          placeholder="Digite seu telefone"
          aria-describedby={errors.phone ? 'phone-error' : undefined}
        />
        {errors.phone && (
          <span id="phone-error" className="text-red-500 text-xs sm:text-sm mt-1 block" role="alert">
            {errors.phone}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 sm:h-14 bg-gradient-to-r from-[#0084FF] to-[#0066CC] text-white text-center text-sm sm:text-base font-semibold leading-6 tracking-tight rounded-full cursor-pointer transition-all duration-200 hover:from-[#0066CC] hover:to-[#0052A3] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#0084FF] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#0084FF] disabled:hover:to-[#0066CC] flex items-center justify-center gap-2"
        aria-label="Solicitar contato"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          'Solicitar contato'
        )}
      </button>
    </form>
  );
};

export default ContactForm;
