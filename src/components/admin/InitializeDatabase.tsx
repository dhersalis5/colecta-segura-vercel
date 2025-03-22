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
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  // Verificar la conexión a Supabase al cargar
  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        // Intentar una consulta simple para verificar la conexión y los permisos
        const { data, error } = await supabase.from('projects').select('id').limit(1);
        
        if (error) {
          console.error('Error de conexión a Supabase:', error);
          setConnectionStatus('error');
          
          // Verificar si es un error de tabla inexistente
          if (error.message.includes('does not exist') || error.code === '42P01') {
            setErrorDetails('La tabla "projects" no existe. Ejecuta el script SQL para crear las tablas.');
          } else {
            setErrorDetails(`Error de conexión: ${error.message} (Código: ${error.code})`);
          }
        } else {
          setConnectionStatus('connected');
          setErrorDetails(null);
        }
      } catch (err: any) {
        console.error('Error al verificar conexión:', err);
        setConnectionStatus('error');
        setErrorDetails(`Error inesperado: ${err.message || 'Desconocido'}`);
      }
    };
    
    checkConnection();
  }, []);

  const handleInitialize = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setErrorDetails(null);
    
    try {
      const result = await initializeProjects();
      
      if (result) {
        setSuccess(true);
      } else {
        setError('No se pudieron inicializar los proyectos. Verifica la consola para más detalles.');
        setErrorDetails('El proceso de inicialización falló. Verifica que las políticas RLS permitan insertar datos sin autenticación.');
      }
    } catch (err: any) {
      console.error('Error al inicializar proyectos:', err);
      setError(err.message || 'Error desconocido al inicializar proyectos');
      setErrorDetails(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestRLS = async () => {
    setIsLoading(true);
    try {
      // Intentar insertar un registro de prueba
      const { data, error } = await supabase
        .from('projects')
        .insert([
          { 
            id: 'test_rls_' + Date.now(),
            title: 'Proyecto de prueba RLS',
            short_description: 'Este es un proyecto de prueba para verificar permisos RLS',
            full_description: 'Descripción completa de prueba',
            goal_amount: 1000,
            amount_raised: 0,
            is_active: true,
            location: 'Test',
            organizer_name: 'Tester',
            contact_email: 'test@example.com'
          }
        ])
        .select();
      
      if (error) {
        setError('Error de permisos. Las políticas RLS no permiten inserciones anónimas.');
        setErrorDetails(`Error específico: ${error.message} (Código: ${error.code})`);
      } else {
        setSuccess(true);
        setError(null);
        setErrorDetails('¡Prueba de RLS exitosa! Ahora puedes inicializar la base de datos.');
      }
    } catch (err: any) {
      setError('Error al probar permisos RLS');
      setErrorDetails(err.message || 'Error desconocido');
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
              {errorDetails && (
                <div className="mt-2 text-xs bg-red-50 p-2 rounded">
                  <strong>Detalles:</strong> {errorDetails}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              {error}
              {errorDetails && (
                <div className="mt-2 text-xs bg-red-50 p-2 rounded overflow-auto max-h-32">
                  <strong>Detalles técnicos:</strong> {errorDetails}
                </div>
              )}
            </AlertDescription>
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
        
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm mb-4">
          <strong>Pasos para configurar la base de datos:</strong>
          <ol className="mt-2 ml-4 list-decimal">
            <li className="mb-1">Ejecuta el script SQL para crear las tablas (supabase-schema.sql)</li>
            <li className="mb-1">Modifica las políticas RLS para permitir inserciones anónimas (fix_rls.sql)</li>
            <li className="mb-1">Usa el botón "Probar permisos RLS" para verificar la configuración</li>
            <li>Si la prueba es exitosa, usa "Inicializar Base de Datos" para cargar proyectos</li>
          </ol>
        </div>
        
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm mb-4">
          <strong>Importante:</strong> Si ves errores HTTP 401, necesitas modificar las políticas RLS.
          Ejecuta este código SQL en Supabase:
          <pre className="mt-2 bg-amber-100 p-2 rounded text-xs overflow-auto">
{`-- Modificar política para permitir que cualquiera pueda insertar proyectos temporalmente
DROP POLICY IF EXISTS "Solo autenticados pueden insertar proyectos" ON projects;
CREATE POLICY "Cualquiera puede insertar proyectos" ON projects
  FOR INSERT WITH CHECK (true);`}
          </pre>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-2">
        <Button 
          onClick={handleTestRLS} 
          disabled={isLoading || connectionStatus !== 'connected'}
          variant="outline"
          className="w-full mb-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Probando...
            </>
          ) : (
            'Probar permisos RLS'
          )}
        </Button>
        
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