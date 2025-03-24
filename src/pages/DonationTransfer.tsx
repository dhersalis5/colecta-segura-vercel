import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Landmark } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const DonationTransfer: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const amount = searchParams.get('amount');
  const projectTitle = searchParams.get('projectTitle');
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <div className="h-20 w-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Landmark className="h-10 w-10 text-primary" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">¡Donación registrada!</h1>
            <p className="text-muted-foreground mb-6">
              Gracias por tu intención de donar {amount ? `$${amount}` : ''} 
              {projectTitle ? ` al proyecto "${projectTitle}"` : ''}.
            </p>
            
            <div className="bg-muted p-6 rounded-lg text-left mb-6 space-y-3">
              <h3 className="font-semibold text-lg mb-4">Datos para la transferencia:</h3>
              <p><strong>Banco:</strong> Banco Nación Argentina</p>
              <p><strong>Titular:</strong> Fundación Ayuda Solidaria</p>
              <p><strong>CUIL:</strong> 30-71234567-8</p>
              <p><strong>CBU:</strong> 0110011230000123456789</p>
              <p><strong>Alias:</strong> AYUDA.SOLIDARIA.ARG</p>
              
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Importante:</strong> Una vez realizada la transferencia, nuestro equipo 
                  verificará el pago y actualizará el progreso de la campaña. Te enviaremos un 
                  correo electrónico cuando confirmemos la recepción.
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

export default DonationTransfer; 