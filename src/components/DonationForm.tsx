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
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<DonationFormValues>({
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

  const handleSubmit = async (data: DonationFormValues) => {
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

              <form onSubmit={handleSubmit(handleSubmit)} className="space-y-6">
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

                {/* Sección de métodos de pago */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Método de pago</h3>
                  
                  <RadioGroup 
                    defaultValue={getDefaultPaymentMethod()} 
                    value={currentPaymentMethod}
                    onValueChange={(value) => setValue('paymentMethod', value as any)}
                    className="space-y-3"
                  >
                    {isPaymentMethodAvailable('mercadoPago') && (
                      <div className="flex items-center space-x-3 rounded-md border p-3">
                        <RadioGroupItem value="mercadoPago" id="mercadoPago" />
                        <Label htmlFor="mercadoPago" className="flex items-center cursor-pointer">
                          <CreditCard className="mr-2 h-5 w-5 text-blue-600" />
                          <div>
                            <span className="font-medium">MercadoPago</span>
                            <p className="text-sm text-gray-500">Tarjeta de crédito/débito, transferencia</p>
                          </div>
                        </Label>
                      </div>
                    )}
                    
                    {isPaymentMethodAvailable('bankTransfer') && (
                      <div className="flex items-center space-x-3 rounded-md border p-3">
                        <RadioGroupItem value="bankTransfer" id="bankTransfer" />
                        <Label htmlFor="bankTransfer" className="flex items-center cursor-pointer">
                          <Landmark className="mr-2 h-5 w-5 text-green-600" />
                          <div>
                            <span className="font-medium">Transferencia Bancaria</span>
                            <p className="text-sm text-gray-500">Transferir desde tu banco</p>
                          </div>
                        </Label>
                      </div>
                    )}
                    
                    {isPaymentMethodAvailable('cash') && (
                      <div className="flex items-center space-x-3 rounded-md border p-3">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex items-center cursor-pointer">
                          <Banknote className="mr-2 h-5 w-5 text-amber-600" />
                          <div>
                            <span className="font-medium">Efectivo</span>
                            <p className="text-sm text-gray-500">Coordinar entrega en persona</p>
                          </div>
                        </Label>
                      </div>
                    )}
                  </RadioGroup>
                  
                  {errors.paymentMethod && (
                    <p className="text-red-500 text-sm">{errors.paymentMethod.message}</p>
                  )}
                </div>

                {/* Botones de pago */}
                <div className="pt-4 border-t">
                  {currentPaymentMethod === 'mercadoPago' ? (
                    <MercadoPagoButton 
                      price={currentAmount || 0}
                      title={`Donación: ${project.title}`}
                      description={`Donación para el proyecto: ${project.title}`}
                      onSuccess={handleMercadoPagoSuccess}
                      onError={handleMercadoPagoError}
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
                </div>
              </form>
            </CardContent>
          </TabsContent>

          <TabsContent value="confirmacion">
            <CardContent className="pt-6 text-center">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">¡Gracias por tu donación!</h3>
                <p className="text-gray-600 mb-6">
                  {currentPaymentMethod === 'mercadoPago' 
                    ? 'Tu pago ha sido procesado correctamente.' 
                    : currentPaymentMethod === 'bankTransfer'
                      ? 'Te hemos enviado los datos bancarios a tu correo electrónico.'
                      : 'Te contactaremos pronto para coordinar la entrega.'
                  }
                </p>
                
                <div className="bg-gray-50 w-full max-w-md rounded-lg p-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Proyecto:</span>
                    <span className="font-medium">{project.title}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Monto:</span>
                    <span className="font-medium">${currentAmount?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Método:</span>
                    <span className="font-medium">
                      {currentPaymentMethod === 'mercadoPago' 
                        ? 'MercadoPago' 
                        : currentPaymentMethod === 'bankTransfer'
                          ? 'Transferencia Bancaria'
                          : 'Efectivo'
                      }
                    </span>
                  </div>
                </div>
                
                {currentPaymentMethod === 'bankTransfer' && project.bankInfo && (
                  <div className="bg-blue-50 w-full max-w-md rounded-lg p-4 mb-6 text-left">
                    <h4 className="font-medium text-blue-800 mb-2">Datos para la transferencia:</h4>
                    <ul className="space-y-1 text-sm">
                      <li><span className="text-blue-700">Banco:</span> {project.bankInfo.bankName}</li>
                      <li><span className="text-blue-700">Titular:</span> {project.bankInfo.accountName}</li>
                      <li><span className="text-blue-700">CBU:</span> {project.bankInfo.cbu}</li>
                      <li><span className="text-blue-700">Alias:</span> {project.bankInfo.alias}</li>
                    </ul>
                  </div>
                )}
                
                <Button 
                  onClick={onSuccess}
                  className="w-full max-w-md"
                >
                  Volver al proyecto
                </Button>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default DonationForm; 