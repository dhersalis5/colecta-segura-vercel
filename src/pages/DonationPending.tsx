import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { checkPaymentStatus } from '@/services/mercadoPago';
import { Loader2, Clock } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const DonationPending: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const location = useLocation();
  
  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        // Obtener el ID de pago de los query params
        const params = new URLSearchParams(location.search);
        const paymentId = params.get('payment_id');
        
        if (paymentId) {
          // Verificar el estado del pago
          const status = await checkPaymentStatus(paymentId);
          setPaymentInfo({
            id: paymentId,
            status: status
          });
        }
      } catch (error) {
        console.error('Error al verificar el estado del pago:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaymentStatus();
  }, [location]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-lg">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
              <p className="text-center text-lg">Verificando tu donación...</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="h-20 w-20 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-10 w-10 text-warning" />
              </div>
              
              <h1 className="text-2xl font-bold mb-2">Donación en procesamiento</h1>
              <p className="text-muted-foreground mb-6">
                Tu donación está siendo procesada. Esto puede tomar unos minutos. Recibirás una 
                confirmación cuando se complete.
              </p>
              
              {paymentInfo && (
                <div className="bg-muted p-4 rounded-md text-left mb-6">
                  <p><strong>ID de pago:</strong> {paymentInfo.id}</p>
                  <p><strong>Estado:</strong> {paymentInfo.status}</p>
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <Link to="/projects">
                  <Button variant="default" className="w-full">Ver más proyectos</Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" className="w-full">Volver al inicio</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DonationPending; 