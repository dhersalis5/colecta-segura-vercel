
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import { setupScrollAnimation } from '@/utils/animation';
import { Mail, Phone, MapPin, Send, AlertCircle, Check } from 'lucide-react';
import { toast } from "sonner";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const observer = setupScrollAnimation();
    return () => observer.disconnect();
  }, []);

  const validateForm = () => {
    let formErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      formErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      formErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = 'El correo electrónico no es válido';
    }
    
    if (!formData.subject.trim()) {
      formErrors.subject = 'El asunto es requerido';
    }
    
    if (!formData.message.trim()) {
      formErrors.message = 'El mensaje es requerido';
    } else if (formData.message.length < 10) {
      formErrors.message = 'El mensaje debe tener al menos 10 caracteres';
    }
    
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("¡Mensaje enviado! Gracias por contactarnos.", {
        description: "Te responderemos lo más pronto posible.",
      });
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center max-w-3xl mx-auto">
                <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-xs font-medium text-secondary-foreground mb-4">
                  Estamos para Ayudarte
                </span>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Contacta con <span className="text-primary">Nosotros</span>
                </h1>
                <p className="text-foreground/70 mb-6">
                  ¿Tienes preguntas o sugerencias? Nuestro equipo está listo para
                  escucharte y brindarte la mejor asistencia posible.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Contact Info & Form Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <AnimatedSection>
                <div>
                  <h2 className="text-2xl font-bold mb-6">Información de Contacto</h2>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Dirección</h3>
                        <p className="text-foreground/70">
                          Av. Revolución 123, Col. Centro<br />
                          Ciudad de México, CP 06000, México
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Correo Electrónico</h3>
                        <a href="mailto:info@colectasegura.com" className="text-foreground/70 hover:text-primary transition-colors duration-300">
                          info@colectasegura.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Teléfono</h3>
                        <a href="tel:+5255123456789" className="text-foreground/70 hover:text-primary transition-colors duration-300">
                          +52 55 1234 5678
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-blue-50 rounded-xl">
                    <h3 className="font-semibold mb-2">Horario de Atención</h3>
                    <p className="text-foreground/70 mb-4">
                      Lunes a Viernes: 9:00 AM - 6:00 PM<br />
                      Sábados: 10:00 AM - 2:00 PM<br />
                      Domingos: Cerrado
                    </p>
                    <p className="text-sm text-foreground/70">
                      Nuestro tiempo de respuesta promedio es de 24 horas en días hábiles.
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              {/* Contact Form */}
              <AnimatedSection delay={2}>
                <div className="glass-card p-8 rounded-xl">
                  <h2 className="text-2xl font-bold mb-6">Envíanos un Mensaje</h2>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Nombre Completo
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.name ? 'border-red-500' : 'border-gray-200'
                        } focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300`}
                        placeholder="Ingresa tu nombre"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.name}
                        </p>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Correo Electrónico
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.email ? 'border-red-500' : 'border-gray-200'
                        } focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300`}
                        placeholder="tu@correo.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Asunto
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.subject ? 'border-red-500' : 'border-gray-200'
                        } focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300`}
                      >
                        <option value="">Selecciona un asunto</option>
                        <option value="Información General">Información General</option>
                        <option value="Donaciones">Donaciones</option>
                        <option value="Proyectos">Proyectos</option>
                        <option value="Colaboraciones">Colaboraciones</option>
                        <option value="Soporte Técnico">Soporte Técnico</option>
                        <option value="Otro">Otro</option>
                      </select>
                      {errors.subject && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.subject}
                        </p>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Mensaje
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.message ? 'border-red-500' : 'border-gray-200'
                        } focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300`}
                        placeholder="¿En qué podemos ayudarte?"
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.message}
                        </p>
                      )}
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full button-primary flex items-center justify-center ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Mensaje
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">Encuéntranos</h2>
              </div>
            </AnimatedSection>
            
            <AnimatedSection>
              <div className="rounded-xl overflow-hidden h-[400px] shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30110.23429465326!2d-99.18755290652628!3d19.432608812819946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff574e08b87d%3A0xc79fe63c87c4c0f9!2sZona%20Rosa%2C%20Mexico%20City%2C%20Mexico!5e0!3m2!1sen!2sus!4v1658234250784!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de ColectaSegura"
                ></iframe>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-12">
                <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-xs font-medium text-secondary-foreground mb-4">
                  Preguntas Frecuentes
                </span>
                <h2 className="text-2xl font-bold mb-4">
                  Respuestas Rápidas a <span className="text-primary">Tus Dudas</span>
                </h2>
                <p className="text-foreground/70 max-w-2xl mx-auto">
                  Antes de contactarnos, revisa estas preguntas comunes sobre nuestro servicio.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={2}>
              <div className="max-w-3xl mx-auto space-y-4">
                <div className="glass-card p-5 rounded-xl">
                  <h3 className="font-semibold mb-2">¿Cuál es el tiempo promedio de respuesta?</h3>
                  <p className="text-foreground/70 text-sm">
                    Respondemos la mayoría de las consultas en un plazo de 24 horas durante días hábiles.
                    Para consultas urgentes, puedes llamarnos directamente.
                  </p>
                </div>
                
                <div className="glass-card p-5 rounded-xl">
                  <h3 className="font-semibold mb-2">¿Puedo visitar sus oficinas personalmente?</h3>
                  <p className="text-foreground/70 text-sm">
                    Sí, nuestras oficinas están abiertas durante el horario de atención indicado.
                    Te recomendamos agendar una cita previa para asegurar que podamos atenderte adecuadamente.
                  </p>
                </div>
                
                <div className="glass-card p-5 rounded-xl">
                  <h3 className="font-semibold mb-2">¿Cómo puedo proponer un proyecto para ser financiado?</h3>
                  <p className="text-foreground/70 text-sm">
                    Para proponer un proyecto, contáctanos a través del formulario seleccionando "Proyectos" como asunto,
                    o envía un correo directo a proyectos@colectasegura.com con toda la información relevante.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
