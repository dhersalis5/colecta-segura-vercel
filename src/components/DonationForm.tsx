import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CreditCard, Landmark, Banknote, CheckCircle, AlertCircle } from 'lucide-react';
import { Project } from '@/types/project';
import MercadoPagoButton from './MercadoPagoButton';
import { createDonation } from '@/services/donationService';

// Esquema de validación
const donationSchema = z.object({
  amount: z.coerce.number().positive({ message: 'El monto debe ser mayor a cero' }),
  donorName: z.string().min(3, { message: 'Por favor ingresa tu nombre' }).optional(),
  donorEmail: z.string().email({ message: 'Email inválido' }),
  isAnonymous: z.boolean().default(false),
  message: z.string().max(200, { message: 'El mensaje no puede superar los 200 caracteres' }).optional(),
  paymentMethod: z.enum(['mercadoPago', 'bankTransfer', 'cash'], { 
    required_error: 'Por favor selecciona un método de pago' 
  })
});

type DonationFormValues = z.infer<typeof donationSchema>;

interface DonationFormProps {
  project: Project;
  onSuccess: () => void;
  onCancel: () => void;
}

const DonationForm: React.FC<DonationFormProps> = ({ project, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [suggestedAmounts] = useState([1000, 2500, 5000, 10000]);
  const [activeTab, setActiveTab] = useState('donacion');
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState({
    mercadoPago: true,
    bankTransfer: true, 
    cash: true
  });

  const getDefaultPaymentMethod = () => {
    if (availablePaymentMethods.mercadoPago) return 'mercadoPago';
    if (availablePaymentMethods.bankTransfer) return 'bankTransfer';
    if (availablePaymentMethods.cash) return 'cash';
    return 'mercadoPago';
  };

  // Inicializar react-hook-form
  const { register, handleSubmit: submitForm, setValue, watch, formState: { errors } } = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 0,
      isAnonymous: false,
      paymentMethod: getDefaultPaymentMethod()
    }
  });

  // Obtener valores actuales del formulario para reactividad
  const currentAmount = watch('amount');
  const currentPaymentMethod = watch('paymentMethod');
  const currentIsAnonymous = watch('isAnonymous');

  // Cargar métodos de pago desde el proyecto
  useEffect(() => {
    if (project.paymentMethods) {
      setAvailablePaymentMethods({
        mercadoPago: project.paymentMethods.mercadoPago,
        bankTransfer: project.paymentMethods.bankTransfer,
        cash: project.paymentMethods.cash
      });
    }
  }, [project]);

  const onSubmit = async (data: DonationFormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Si el método es MercadoPago, la donación se registra en el callback de éxito
      if (data.paymentMethod !== 'mercadoPago') {
        // Crear la donación para transferencia bancaria o efectivo
        await createDonation({
          projectId: project.id,
          amount: data.amount,
          donorName: data.isAnonymous ? 'Anónimo' : (data.donorName || 'Sin nombre'),
          donorEmail: data.donorEmail,
          isAnonymous: data.isAnonymous,
          paymentMethod: data.paymentMethod,
          message: data.message,
          status: 'pending'
        });

        setSuccess(true);
        // Mostrar pestaña de confirmación
        setActiveTab('confirmacion');
      }
    } catch (err) {
      console.error('Error al procesar la donación:', err);
      setError('Ocurrió un error al procesar tu donación. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar el éxito en MercadoPago
  const handleMercadoPagoSuccess = async () => {
    try {
      const formData = watch();
      
      // Registrar la donación como completada
      await createDonation({
        projectId: project.id,
        amount: formData.amount,
        donorName: formData.isAnonymous ? 'Anónimo' : (formData.donorName || 'Sin nombre'),
        donorEmail: formData.donorEmail,
        isAnonymous: formData.isAnonymous,
        paymentMethod: 'mercadoPago',
        message: formData.message,
        status: 'completed'
      });
      
      // Actualizar estado y mostrar confirmación
      setSuccess(true);
      setActiveTab('confirmacion');
    } catch (err) {
      console.error('Error al registrar el pago con MercadoPago:', err);
      setError('El pago se procesó correctamente, pero hubo un error al registrarlo. Por favor, contacta con el administrador.');
    }
  };

  // Manejar error en MercadoPago
  const handleMercadoPagoError = (errorMsg: string) => {
    setError(`Error con MercadoPago: ${errorMsg}`);
  };

  // Seleccionar un monto preestablecido
  const selectAmount = (amount: number) => {
    setValue('amount', amount);
  };

  // Comprobar si un método de pago está disponible
  const isPaymentMethodAvailable = (method: string) => {
    switch (method) {
      case 'mercadoPago':
        return availablePaymentMethods.mercadoPago;
      case 'bankTransfer':
        return availablePaymentMethods.bankTransfer;
      case 'cash':
        return availablePaymentMethods.cash;
      default:
        return false;
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={onCancel}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al proyecto
      </Button>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Apoya este proyecto</CardTitle>
          <CardDescription>
            Tu donación para: {project.title}
          </CardDescription>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="donacion" disabled={activeTab === 'confirmacion'}>Donar</TabsTrigger>
            <TabsTrigger value="confirmacion" disabled={!success}>Confirmación</TabsTrigger>
          </TabsList>

          <TabsContent value="donacion">
            <CardContent className="pt-6">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={submitForm(onSubmit)} className="space-y-6">
                {/* Sección de monto */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Monto a donar</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {suggestedAmounts.map((amount) => (
                      <Button
                        key={amount}
                        type="button"
                        variant={currentAmount === amount ? "default" : "outline"}
                        onClick={() => selectAmount(amount)}
                        className="w-full"
                      >
                        ${amount.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                  
                  <div>
                    <Label htmlFor="amount">Otro monto (en pesos)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Ingresa otro monto"
                      {...register('amount')}
                      className={errors.amount ? "border-red-500" : ""}
                    />
                    {errors.amount && (
                      <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
                    )}
                  </div>
                </div>

                {/* Sección de datos personales */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Tus datos</h3>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox 
                      id="isAnonymous" 
                      {...register('isAnonymous')}
                    />
                    <Label htmlFor="isAnonymous">Hacer donación anónima</Label>
                  </div>
                  
                  {!currentIsAnonymous && (
                    <div>
                      <Label htmlFor="donorName">Tu nombre</Label>
                      <Input
                        id="donorName"
                        placeholder="Nombre completo"
                        {...register('donorName')}
                        className={errors.donorName ? "border-red-500" : ""}
                      />
                      {errors.donorName && (
                        <p className="text-red-500 text-sm mt-1">{errors.donorName.message}</p>
                      )}
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="donorEmail">Email *</Label>
                    <Input
                      id="donorEmail"
                      type="email"
                      placeholder="tu@email.com"
                      {...register('donorEmail')}
                      className={errors.donorEmail ? "border-red-500" : ""}
                    />
                    {errors.donorEmail && (
                      <p className="text-red-500 text-sm mt-1">{errors.donorEmail.message}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Tu email no será compartido y sólo se usará para enviarte un recibo de tu donación.
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Mensaje (opcional)</Label>
                    <Textarea
                      id="message"
                      placeholder="Deja un mensaje de apoyo"
                      {...register('message')}
                      className={errors.message ? "border-red-500" : ""}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>
                </div>

                {/* Sección de método de pago */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Método de pago</h3>
                  <RadioGroup 
                    defaultValue={currentPaymentMethod}
                    onValueChange={(value) => setValue('paymentMethod', value as 'mercadoPago' | 'bankTransfer' | 'cash')}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="mercadoPago" id="mercadoPago" />
                      <Label htmlFor="mercadoPago" className="flex items-center cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pagar con MercadoPago
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="bankTransfer" id="bankTransfer" />
                      <Label htmlFor="bankTransfer" className="flex items-center cursor-pointer">
                        <Landmark className="mr-2 h-4 w-4" />
                        Transferencia Bancaria
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex items-center cursor-pointer">
                        <Banknote className="mr-2 h-4 w-4" />
                        Efectivo
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* Información específica según el método de pago */}
                  {currentPaymentMethod === 'bankTransfer' && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
                      <h4 className="font-medium">Datos para la transferencia:</h4>
                      <p>Banco: Banco Nación Argentina</p>
                      <p>Titular: Fundación Ayuda Solidaria</p>
                      <p>CUIL: 30-71234567-8</p>
                      <p>CBU: 0110011230000123456789</p>
                      <p>Alias: AYUDA.SOLIDARIA.ARG</p>
                      <p className="text-sm text-gray-600 mt-4">
                        Una vez realizada la transferencia, nuestro equipo verificará el pago y actualizará el progreso de la campaña.
                      </p>
                    </div>
                  )}

                  {currentPaymentMethod === 'cash' && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
                      <h4 className="font-medium">Donación en efectivo:</h4>
                      <p>Completa tus datos y nos pondremos en contacto contigo para coordinar la entrega.</p>
                      <Textarea
                        placeholder="¿Cuándo y dónde prefieres realizar la entrega? (opcional)"
                        className="mt-2"
                        {...register('message')}
                      />
                    </div>
                  )}
                </div>

                <CardFooter className="flex justify-between pt-6">
                  {currentPaymentMethod === 'mercadoPago' ? (
                    <MercadoPagoButton
                      projectTitle={project.title}
                      amount={currentAmount}
                      disabled={isSubmitting || !currentAmount}
                    />
                  ) : (
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Procesando...' : 'Confirmar donación'}
                    </Button>
                  )}
                </CardFooter>
              </form>
            </CardContent>
          </TabsContent>

          <TabsContent value="confirmacion">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">¡Gracias por tu donación!</h3>
              
              {currentPaymentMethod === 'mercadoPago' ? (
                <p>Tu pago ha sido procesado correctamente. El progreso de la campaña se actualizará en breve.</p>
              ) : currentPaymentMethod === 'bankTransfer' ? (
                <div className="space-y-4">
                  <p>Hemos registrado tu intención de donación por transferencia bancaria.</p>
                  <p>Por favor, realiza la transferencia usando los datos proporcionados y nuestro equipo verificará el pago.</p>
                  <p className="text-sm text-gray-600">Te enviaremos un correo cuando confirmemos la recepción.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p>Hemos registrado tu intención de donación en efectivo.</p>
                  <p>Nuestro equipo se pondrá en contacto contigo pronto para coordinar la entrega.</p>
                  <p className="text-sm text-gray-600">Revisa tu correo electrónico para más detalles.</p>
                </div>
              )}

              <Button 
                onClick={onSuccess} 
                className="mt-6"
              >
                Volver al proyecto
              </Button>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default DonationForm; 