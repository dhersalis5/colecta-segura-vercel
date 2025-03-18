import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { processPayment } from '@/services/mercadoPago';
import { processPaymentDirect } from '@/services/mercadoPagoDirectTest';
import { Loader2, AlertCircle } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface MercadoPagoButtonProps {
  projectTitle: string;
  amount: number | null;
  disabled?: boolean;
}

// Para desarrollo local, usa true. Para producción en Vercel, cambia a false
const TEST_MODE = import.meta.env.MODE === 'production' ? false : true;

const formSchema = z.object({
  email: z.string().email("Por favor ingresa un email válido"),
  name: z.string().min(2, "Por favor ingresa tu nombre").optional(),
});

const MercadoPagoButton: React.FC<MercadoPagoButtonProps> = ({
  projectTitle,
  amount,
  disabled = false
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });
  
  const validateAmount = () => {
    if (!amount) {
      toast({
        title: "Monto requerido",
        description: "Por favor selecciona un monto para donar",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };
  
  const handleOpenDialog = () => {
    if (validateAmount()) {
      setError(null);
      setShowDialog(true);
    }
  };
  
  const handleDonation = async (values: z.infer<typeof formSchema>) => {
    if (!validateAmount()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("Iniciando proceso de donación...");
      console.log("Proyecto:", projectTitle);
      console.log("Monto:", amount);
      console.log("Modo de prueba:", TEST_MODE ? "Activo (directo)" : "Inactivo (Vercel API)");
      
      let checkoutUrl;
      
      // Iniciar la creación de preferencia
      if (TEST_MODE) {
        console.log("Usando implementación directa (TEST_MODE=true)");
        checkoutUrl = await processPaymentDirect(
          projectTitle, 
          amount as number, 
          values.email,
          values.name
        );
      } else {
        console.log("Usando implementación de Vercel (TEST_MODE=false)");
        checkoutUrl = await processPayment(
          projectTitle, 
          amount as number, 
          values.email,
          values.name
        );
      }
      
      if (!checkoutUrl) {
        throw new Error("No se obtuvo una URL de pago válida");
      }
      
      console.log("URL de checkout recibida:", checkoutUrl);
      
      toast({
        title: "Redireccionando a MercadoPago",
        description: "Serás redirigido a la página de pago seguro de MercadoPago",
      });
      
      // Redirigir al usuario a la página de checkout de MercadoPago
      window.location.href = checkoutUrl;
      
    } catch (error) {
      setLoading(false);
      
      // Extraer el mensaje de error
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      
      console.error("Error al procesar el pago:", error);
      console.error("Mensaje de error:", errorMessage);
      
      // Mensaje de error más específico para el usuario
      let userMessage = "Hubo un problema al conectar con MercadoPago. Por favor intenta de nuevo.";
      let errorDetail = "";
      
      if (errorMessage.includes("fetch") || errorMessage.includes("Failed to fetch")) {
        userMessage = "Error de conexión con el servidor. Verifica tu conexión a internet e intenta nuevamente.";
        if (!TEST_MODE) {
          errorDetail = "Las API de Vercel no están disponibles localmente. Intenta ejecutar 'vercel dev' o cambia a TEST_MODE=true.";
        }
      } else if (errorMessage.includes("401") || errorMessage.includes("autenticación")) {
        userMessage = "Error de autenticación con MercadoPago. El token podría no ser válido.";
        errorDetail = "Verifica que el token de acceso esté configurado correctamente.";
      } else if (errorMessage.includes("400") || errorMessage.includes("datos enviados")) {
        userMessage = "Error en los datos enviados a MercadoPago.";
        errorDetail = errorMessage;
      } else if (errorMessage.includes("500")) {
        userMessage = "Error en el servidor de pagos. Por favor intenta más tarde.";
      } else if (errorMessage.includes("checkout_url") || errorMessage.includes("URL de checkout")) {
        userMessage = "Error al generar el enlace de pago. Por favor contacta al administrador.";
      }
      
      // Establecer el error detallado
      setError(`${userMessage}${errorDetail ? '\n\nDetalle: ' + errorDetail : ''}`);
      
      toast({
        title: "Error al procesar el pago",
        description: userMessage,
        variant: "destructive",
      });
    }
  };
  
  return (
    <>
      <Button
        onClick={handleOpenDialog}
        disabled={disabled || loading || !amount}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            Donar ${amount?.toLocaleString() || "0"}
          </>
        )}
      </Button>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Completar información</DialogTitle>
            <DialogDescription>
              Ingresa tus datos para procesar la donación de ${amount?.toLocaleString() || "0"} para {projectTitle}
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <div className="bg-destructive/10 p-3 rounded-md flex items-start mb-4">
              <AlertCircle className="h-5 w-5 text-destructive mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-destructive">
                {error.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < error.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleDonation)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="tumail@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4 flex justify-end space-x-2">
                <DialogClose asChild>
                  <Button variant="outline" type="button" onClick={() => form.reset()}>
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Proceder al pago"
                  )}
                </Button>
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                <p>Al continuar, serás redirigido a MercadoPago para completar tu donación de forma segura.</p>
                <p className="mt-1">Tus datos están protegidos y no serán compartidos con terceros.</p>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MercadoPagoButton;
