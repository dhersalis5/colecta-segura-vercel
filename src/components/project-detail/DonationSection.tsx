import React, { useState } from 'react';
import { Project } from '@/data/projects';
import { DollarSign, CreditCard, Landmark, Banknote } from 'lucide-react';
import MercadoPagoButton from '@/components/MercadoPagoButton';
import AnimatedSection from '@/components/AnimatedSection';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface DonationSectionProps {
  project: Project;
  donationAmount: number | null;
  setDonationAmount: (amount: number) => void;
}

const DonationSection: React.FC<DonationSectionProps> = ({ 
  project, 
  donationAmount, 
  setDonationAmount 
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'mercadoPago' | 'bankTransfer' | 'cash'>('mercadoPago');
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleDonationSelect = (amount: number) => {
    setDonationAmount(amount);
  };

  const handleCustomDonation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setDonationAmount(value);
    } else {
      setDonationAmount(0);
    }
  };

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitDonation = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí manejarías la lógica para donaciones en efectivo o transferencia
    console.log('Donación enviada:', {
      amount: donationAmount,
      method: paymentMethod,
      contactInfo
    });
    // Mostrar mensaje de éxito
    alert('¡Gracias! Nos pondremos en contacto contigo pronto.');
  };

  return (
    <AnimatedSection delay={2}>
      <div className="sticky top-24" id="donation-section">
        <div className="glass-card rounded-xl p-6 mb-6">
          <h3 className="font-semibold mb-4">Hacer una Donación</h3>
          
          {project.donationLevels ? (
            <div className="space-y-3 mb-4">
              {project.donationLevels.map((level, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDonationSelect(level.amount)}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-300 ${
                    donationAmount === level.amount
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-primary/30"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{level.title}</span>
                    <span className="text-primary font-semibold">
                      ${level.amount.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/70">{level.description}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3 mb-4">
              {[100, 250, 500, 1000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleDonationSelect(amount)}
                  className={`w-full p-3 rounded-lg border transition-all duration-300 ${
                    donationAmount === amount
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-primary/30"
                  }`}
                >
                  <span className="font-medium">${amount.toLocaleString()}</span>
                </button>
              ))}
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Otra cantidad</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <DollarSign className="h-4 w-4 text-foreground/60" />
              </div>
              <input
                type="number"
                min="1"
                placeholder="Ingresa tu cantidad"
                onChange={handleCustomDonation}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
              />
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3">Método de pago</h4>
            <RadioGroup 
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as 'mercadoPago' | 'bankTransfer' | 'cash')}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="mercadoPago" id="mercadoPago" />
                <Label htmlFor="mercadoPago" className="flex items-center cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pagar con MercadoPago
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="bankTransfer" id="bankTransfer" />
                <Label htmlFor="bankTransfer" className="flex items-center cursor-pointer">
                  <Landmark className="mr-2 h-4 w-4" />
                  Transferencia Bancaria
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center cursor-pointer">
                  <Banknote className="mr-2 h-4 w-4" />
                  Efectivo
                </Label>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === 'mercadoPago' ? (
            <MercadoPagoButton 
              projectTitle={project.title}
              amount={donationAmount}
              disabled={!donationAmount}
            />
          ) : (
            <form onSubmit={handleSubmitDonation} className="space-y-4">
              <Input
                name="name"
                placeholder="Tu nombre"
                value={contactInfo.name}
                onChange={handleContactInfoChange}
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Tu email"
                value={contactInfo.email}
                onChange={handleContactInfoChange}
                required
              />
              <Input
                name="phone"
                type="tel"
                placeholder="Tu teléfono"
                value={contactInfo.phone}
                onChange={handleContactInfoChange}
                required
              />
              
              {paymentMethod === 'bankTransfer' && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
                  <h4 className="font-medium">Datos bancarios:</h4>
                  <p>Banco: Banco Nación Argentina</p>
                  <p>Titular: Fundación Ayuda Solidaria</p>
                  <p>CUIL: 30-71234567-8</p>
                  <p>CBU: 0110011230000123456789</p>
                  <p>Alias: AYUDA.SOLIDARIA.ARG</p>
                </div>
              )}

              {paymentMethod === 'cash' && (
                <Textarea
                  name="message"
                  placeholder="¿Cuándo y dónde prefieres realizar la entrega?"
                  value={contactInfo.message}
                  onChange={handleContactInfoChange}
                  required
                />
              )}

              <Button 
                type="submit" 
                className="w-full"
                disabled={!donationAmount}
              >
                Confirmar donación
              </Button>
            </form>
          )}
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold mb-4">Comparte este proyecto</h3>
          <div className="flex gap-2">
            <button className="flex-1 p-2 rounded-lg bg-[#1877F2] text-white">
              <span className="sr-only">Facebook</span>
              <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="flex-1 p-2 rounded-lg bg-[#1DA1F2] text-white">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </button>
            <button className="flex-1 p-2 rounded-lg bg-[#0A66C2] text-white">
              <span className="sr-only">LinkedIn</span>
              <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19.7 3H4.3A1.3 1.3 0 003 4.3v15.4A1.3 1.3 0 004.3 21h15.4a1.3 1.3 0 001.3-1.3V4.3A1.3 1.3 0 0019.7 3zM8.339 18.338H5.667v-8.59h2.672v8.59zM7.004 8.574a1.548 1.548 0 11-.002-3.096 1.548 1.548 0 01.002 3.096zm11.335 9.764H15.67v-4.177c0-.996-.017-2.278-1.387-2.278-1.389 0-1.601 1.086-1.601 2.206v4.249h-2.667v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.779 3.203 4.092v4.711z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="flex-1 p-2 rounded-lg bg-[#25D366] text-white">
              <span className="sr-only">WhatsApp</span>
              <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M20.11 3.89C17.96 1.74 15.08 0.5 12 0.5C5.5 0.5 0.23 5.77 0.23 12.27C0.23 14.47 0.81 16.6 1.91 18.47L0.102 24L5.73 22.22C7.55 23.22 9.63 23.75 11.77 23.75H11.78C18.28 23.75 23.5 18.48 23.5 11.98C23.5 8.9 22.26 6.02 20.11 3.89ZM12 21.82C10.13 21.82 8.28 21.3 6.67 20.3L6.34 20.1L2.89 21.18L4 17.82L3.8 17.47C2.71 15.82 2.14 13.87 2.14 11.87C2.14 6.83 6.5 2.67 12 2.67C14.63 2.67 17.07 3.72 18.91 5.56C20.75 7.4 21.82 9.84 21.82 12.47C21.82 17.52 17.05 21.82 12 21.82ZM17.23 14.67C16.92 14.51 15.55 13.83 15.27 13.73C14.99 13.62 14.78 13.57 14.57 13.89C14.36 14.21 13.83 14.82 13.64 15.03C13.46 15.23 13.27 15.25 12.97 15.09C11.3 14.25 10.2 13.59 9.09 11.71C8.81 11.26 9.28 11.29 9.72 10.4C9.82 10.19 9.77 10.02 9.7 9.86C9.63 9.7 9.18 8.33 8.92 7.7C8.67 7.09 8.42 7.17 8.22 7.16C8.04 7.15 7.83 7.15 7.62 7.15C7.41 7.15 7.08 7.22 6.8 7.54C6.51 7.85 5.87 8.54 5.87 9.9C5.87 11.27 6.85 12.59 6.97 12.8C7.1 13.01 9.16 16.11 12.23 17.3C14.31 18.13 15.09 18.16 16.1 18.01C16.73 17.92 17.86 17.31 18.12 16.58C18.38 15.85 18.38 15.22 18.31 15.09C18.24 14.95 18.03 14.88 17.73 14.72L17.23 14.67Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default DonationSection;
