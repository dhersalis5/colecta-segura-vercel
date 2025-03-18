import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, ingresa tu email y contraseña');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      await login(email, password);
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al panel de administración",
      });
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      // Manejo de errores específicos de Firebase
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Credenciales incorrectas. Por favor verifica tu email y contraseña.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos fallidos. Por favor intenta más tarde o restablece tu contraseña.');
      } else {
        setError('Error al iniciar sesión. Por favor intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor, ingresa tu dirección de email');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      await resetPassword(email);
      toast({
        title: "Email enviado",
        description: "Se ha enviado un correo para restablecer tu contraseña",
      });
      setForgotPassword(false);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setError('No se encontró una cuenta con este email');
      } else {
        setError('Error al enviar el correo. Por favor intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {forgotPassword ? "Restablecer contraseña" : "Acceso administrador"}
          </CardTitle>
          <CardDescription className="text-center">
            {forgotPassword 
              ? "Ingresa tu correo electrónico para recibir un enlace de restablecimiento"
              : "Ingresa tus credenciales para acceder al panel de administración"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={forgotPassword ? handleResetPassword : handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="ejemplo@colectasegura.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              {!forgotPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Contraseña</Label>
                  </div>
                  <Input 
                    id="password"
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {forgotPassword ? "Enviando..." : "Iniciando sesión..."}
                  </>
                ) : (
                  forgotPassword ? "Enviar correo" : "Iniciar sesión"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        
        <CardFooter>
          <Button 
            variant="link" 
            className="w-full"
            onClick={() => {
              setForgotPassword(!forgotPassword);
              setError('');
            }}
          >
            {forgotPassword 
              ? "Volver al inicio de sesión" 
              : "¿Olvidaste tu contraseña?"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin; 