import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Banknote, PhoneCall, Mail } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const DonationCash: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const amount = searchParams.get('amount');
  const projectTitle = searchParams.get('projectTitle');
  const donorEmail = searchParams.get('email');
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <div className="h-20 w-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Banknote className="h-10 w-10 text-primary" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">¡Donación registrada!</h1>
            <p className="text-muted-foreground mb-6">
              Gracias por tu intención de donar {amount ? `$${amount}` : ''} 
              {projectTitle ? ` al proyecto "${projectTitle}"` : ''}.
            </p>
            
            <div className="bg-muted p-6 rounded-lg text-left mb-6">
              <h3 className="font-semibold text-lg mb-4">Próximos pasos:</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <PhoneCall className="h-5 w-5 text-primary mt-1" />
                  <p>
                    Nuestro equipo se pondrá en contacto contigo pronto para coordinar 
                    la entrega del efectivo en un lugar seguro y conveniente.
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <p>
                    Te enviaremos un correo a <strong>{donorEmail}</strong> con los 
                    detalles de la coordinación.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Importante:</strong> Por tu seguridad, solo coordinaremos la 
                  entrega a través del correo electrónico registrado y en lugares seguros 
                  durante horarios diurnos.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Link to="/projects">
                <Button variant="default" className="w-full">Ver más proyectos</Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full">Volver al inicio</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DonationCash; 