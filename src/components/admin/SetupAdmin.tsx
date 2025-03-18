import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, ShieldAlert } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const SetupAdmin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const SETUP_SECRET = 'colecta-segura-2023'; // Esto debería estar en una variable de entorno

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validaciones básicas
    if (!email || !password || !confirmPassword || !secretKey) {
      setError('Por favor, completa todos los campos');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    if (secretKey !== SETUP_SECRET) {
      setError('La clave secreta es incorrecta');
      return;
    }
    
    try {
      setIsLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Ya existe una cuenta con este email');
      } else if (err.code === 'auth/invalid-email') {
        setError('El formato del email es inválido');
      } else {
        setError('Error al crear la cuenta: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
              <CheckCircle className="h-6 w-6 mr-2 text-green-500" />
              Configuración exitosa
            </CardTitle>
            <CardDescription className="text-center">
              La cuenta de administrador ha sido creada correctamente
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              Ya puedes iniciar sesión con tu email y contraseña en el panel de administración.
            </p>
            <Button onClick={() => window.location.href = '/admin/login'}>
              Ir al inicio de sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <ShieldAlert className="h-6 w-6 mr-2 text-amber-500" />
            Configuración inicial
          </CardTitle>
          <CardDescription className="text-center">
            Crea una cuenta de administrador para acceder al panel
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSetup}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email de administrador</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="admin@colectasegura.com.ar" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password"
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Mínimo 6 caracteres
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input 
                  id="confirmPassword"
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secretKey">Clave secreta</Label>
                <Input 
                  id="secretKey"
                  type="password" 
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Para esta demo, usa: colecta-segura-2023
                </p>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  'Crear cuenta de administrador'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="text-center text-sm text-muted-foreground">
          Esta página solo está disponible durante la configuración inicial
        </CardFooter>
      </Card>
    </div>
  );
};

export default SetupAdmin; 