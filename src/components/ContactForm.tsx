import React, { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
}

interface ContactFormProps {
  onSubmit?: (data: FormData) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit?.(formData);
      // Reset form after successful submission
      setFormData({ name: '', email: '', phone: '' });
      setErrors({});
      alert('Formulário enviado com sucesso! Entraremos em contato em breve.');
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
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-4">
        <label 
          htmlFor="name"
          className="block w-[466px] text-[#596780] text-base font-normal leading-6 tracking-[-0.32px] mb-2 max-md:w-[90%] max-md:max-w-[400px] max-sm:w-[95%]"
        >
          Nome
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={handleInputChange('name')}
          className={`w-[473px] h-[46px] rounded border bg-[#F6F6F6] border-solid px-4 max-md:w-[90%] max-md:max-w-[400px] max-sm:w-[95%] focus:outline-none focus:ring-2 focus:ring-[#0084FF] ${
            errors.name ? 'border-red-500' : 'border-[#97A0B0]'
          }`}
          placeholder="Digite seu nome"
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <span id="name-error" className="text-red-500 text-sm mt-1 block" role="alert">
            {errors.name}
          </span>
        )}
      </div>

      <div className="mb-4">
        <label 
          htmlFor="email"
          className="block w-[466px] text-[#596780] text-base font-normal leading-6 tracking-[-0.32px] mb-2 max-md:w-[90%] max-md:max-w-[400px] max-sm:w-[95%]"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          className={`w-[473px] h-[46px] rounded border bg-[#F6F6F6] border-solid px-4 max-md:w-[90%] max-md:max-w-[400px] max-sm:w-[95%] focus:outline-none focus:ring-2 focus:ring-[#0084FF] ${
            errors.email ? 'border-red-500' : 'border-[#97A0B0]'
          }`}
          placeholder="Digite seu email"
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" className="text-red-500 text-sm mt-1 block" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      <div className="mb-6">
        <label 
          htmlFor="phone"
          className="block w-[466px] text-[#596780] text-base font-normal leading-6 tracking-[-0.32px] mb-2 max-md:w-[90%] max-md:max-w-[400px] max-sm:w-[95%]"
        >
          Telefone
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={handleInputChange('phone')}
          className={`w-[473px] h-[46px] rounded border bg-[#F6F6F6] border-solid px-4 max-md:w-[90%] max-md:max-w-[400px] max-sm:w-[95%] focus:outline-none focus:ring-2 focus:ring-[#0084FF] ${
            errors.phone ? 'border-red-500' : 'border-[#97A0B0]'
          }`}
          placeholder="Digite seu telefone"
          aria-describedby={errors.phone ? 'phone-error' : undefined}
        />
        {errors.phone && (
          <span id="phone-error" className="text-red-500 text-sm mt-1 block" role="alert">
            {errors.phone}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="w-[471px] h-[52px] bg-gradient-to-r from-[#0084FF] to-[#0066CC] text-white text-center text-base font-semibold leading-6 tracking-[-0.32px] rounded-[30px] cursor-pointer transition-all duration-200 hover:from-[#0066CC] hover:to-[#0052A3] focus:outline-none focus:ring-2 focus:ring-[#0084FF] focus:ring-offset-2 max-md:w-[90%] max-md:max-w-[400px] max-sm:w-[95%]"
        aria-label="Solicitar contato"
      >
        Solicitar contato
      </button>
    </form>
  );
};

export default ContactForm;
