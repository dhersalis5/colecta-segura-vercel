import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, Loader2, Check, AlertTriangle } from 'lucide-react';
import { initializeProjects } from '@/scripts/initializeProjects';
import { supabase } from '@/lib/supabase';

const InitializeDatabase: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  // Verificar la conexión a Supabase al cargar
  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('projects').select('id').limit(1);
        
        if (error) {
          console.error('Error de conexión a Supabase:', error);
          setConnectionStatus('error');
        } else {
          setConnectionStatus('connected');
        }
      } catch (err) {
        console.error('Error al verificar conexión:', err);
        setConnectionStatus('error');
      }
    };
    
    checkConnection();
  }, []);

  const handleInitialize = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const result = await initializeProjects();
      
      if (result) {
        setSuccess(true);
      } else {
        setError('No se pudieron inicializar los proyectos. Verifica la consola para más detalles.');
      }
    } catch (err: any) {
      console.error('Error al inicializar proyectos:', err);
      setError(err.message || 'Error desconocido al inicializar proyectos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Inicialización de la Base de Datos
        </CardTitle>
        <CardDescription>
          Cargar proyectos de muestra en la base de datos Supabase
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {connectionStatus === 'checking' && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            Verificando conexión a Supabase...
          </div>
        )}
        
        {connectionStatus === 'connected' && (
          <div className="flex items-center gap-2 text-sm text-green-600 mb-4">
            <Check className="h-4 w-4" />
            Conectado correctamente a Supabase
          </div>
        )}
        
        {connectionStatus === 'error' && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Error de conexión a Supabase. Verifica las credenciales y la configuración.
            </AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-4 bg-green-50 border-green-200 text-green-700">
            <Check className="h-4 w-4" />
            <AlertDescription>
              ¡Proyectos de demostración cargados correctamente!
            </AlertDescription>
          </Alert>
        )}
        
        <p className="text-sm mb-4">
          Este proceso cargará 3 proyectos de demostración en tu base de datos de Supabase. 
          Esta acción solo tendrá efecto si la base de datos está vacía.
        </p>
        
        <p className="text-sm text-muted-foreground">
          <strong>Nota:</strong> Necesitas tener configuradas las credenciales de Supabase 
          correctamente en el archivo <code>.env</code>
        </p>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleInitialize} 
          disabled={isLoading || connectionStatus !== 'connected'}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Inicializando...
            </>
          ) : (
            'Inicializar Base de Datos'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InitializeDatabase; 