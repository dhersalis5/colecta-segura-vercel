import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar si ya está autenticado
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Autenticación hardcodeada para demo
    if (password === 'admin123') {
      // Guardar token en localStorage
      localStorage.setItem('adminToken', 'demo-token-123456');
      
      // Redireccionar al dashboard
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } else {
      setError('Contraseña incorrecta');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-muted/20">
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle className="text-xl">Panel de Administración</CardTitle>
          <CardDescription>
            Accede al panel para gestionar proyectos y donaciones
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-1">
                  Usuario
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  defaultValue="admin"
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Contraseña
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-foreground/60 mt-1">
                  Para demo, usa: admin123
                </p>
              </div>
              
              {error && (
                <div className="text-sm text-red-500 mt-2">
                  {error}
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Ingresar'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
