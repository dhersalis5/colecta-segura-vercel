import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { X, Plus, Image } from 'lucide-react';
import { Project } from '@/types/project';

// Esquema de validación
const projectSchema = z.object({
  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres' }),
  shortDescription: z.string().min(10, { message: 'La descripción corta debe tener al menos 10 caracteres' }),
  fullDescription: z.string().min(50, { message: 'La descripción completa debe tener al menos 50 caracteres' }),
  goalAmount: z.coerce.number().positive({ message: 'El monto debe ser positivo' }),
  location: z.string().min(2, { message: 'La ubicación es requerida' }),
  isActive: z.boolean().default(true),
  organizerName: z.string().min(3, { message: 'El nombre del organizador es requerido' }),
  contactEmail: z.string().email({ message: 'Email inválido' }),
  coverImage: z.string().url({ message: 'URL de imagen inválida' }).optional(),
  bankInfo: z.object({
    accountName: z.string().min(3, { message: 'El nombre de la cuenta es requerido' }).optional(),
    bankName: z.string().min(3, { message: 'El nombre del banco es requerido' }).optional(),
    cbu: z.string().min(20, { message: 'CBU inválido' }).optional(),
    alias: z.string().min(6, { message: 'Alias inválido' }).optional()
  }).optional()
});

interface ProjectEditorProps {
  project: Project | null;
  onSave: (projectData: any) => void;
  onCancel: () => void;
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({ project, onSave, onCancel }) => {
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Inicializar react-hook-form con valores por defecto o datos del proyecto
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: project || {
      title: '',
      shortDescription: '',
      fullDescription: '',
      goalAmount: 0,
      location: '',
      isActive: true,
      organizerName: '',
      contactEmail: '',
      coverImage: '',
      bankInfo: {
        accountName: '',
        bankName: '',
        cbu: '',
        alias: ''
      }
    }
  });

  // Cargar imágenes adicionales si el proyecto existe
  useEffect(() => {
    if (project && project.additionalImages) {
      setAdditionalImages(project.additionalImages);
    } else {
      setAdditionalImages([]);
    }
    
    // Reiniciar el formulario cuando cambia el proyecto
    if (project) {
      reset(project);
    }
  }, [project, reset]);

  const addImage = () => {
    if (newImageUrl && !additionalImages.includes(newImageUrl)) {
      setAdditionalImages([...additionalImages, newImageUrl]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...additionalImages];
    newImages.splice(index, 1);
    setAdditionalImages(newImages);
  };

  const onSubmit = (data: any) => {
    // Combinar datos del formulario con imágenes adicionales
    const projectData = {
      ...data,
      additionalImages
    };
    
    onSave(projectData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Información básica */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información básica</h3>
        
        <div>
          <Label htmlFor="title">Título del proyecto *</Label>
          <Input 
            id="title" 
            {...register('title')} 
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message as string}</p>}
        </div>
        
        <div>
          <Label htmlFor="shortDescription">Descripción corta *</Label>
          <Input 
            id="shortDescription" 
            {...register('shortDescription')}
            className={errors.shortDescription ? 'border-red-500' : ''}
          />
          {errors.shortDescription && <p className="text-red-500 text-sm mt-1">{errors.shortDescription.message as string}</p>}
        </div>
        
        <div>
          <Label htmlFor="fullDescription">Descripción completa *</Label>
          <Textarea 
            id="fullDescription" 
            {...register('fullDescription')}
            rows={5}
            className={errors.fullDescription ? 'border-red-500' : ''}
          />
          {errors.fullDescription && <p className="text-red-500 text-sm mt-1">{errors.fullDescription.message as string}</p>}
        </div>
        
        <div>
          <Label htmlFor="goalAmount">Monto objetivo (en pesos) *</Label>
          <Input 
            id="goalAmount" 
            type="number" 
            {...register('goalAmount')}
            className={errors.goalAmount ? 'border-red-500' : ''}
          />
          {errors.goalAmount && <p className="text-red-500 text-sm mt-1">{errors.goalAmount.message as string}</p>}
        </div>
        
        <div>
          <Label htmlFor="location">Ubicación *</Label>
          <Input 
            id="location" 
            {...register('location')}
            className={errors.location ? 'border-red-500' : ''}
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message as string}</p>}
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="isActive" 
            {...register('isActive')}
          />
          <Label htmlFor="isActive">Proyecto activo</Label>
        </div>
      </div>
      
      {/* Organizador */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium">Información de contacto</h3>
        
        <div>
          <Label htmlFor="organizerName">Nombre del organizador *</Label>
          <Input 
            id="organizerName" 
            {...register('organizerName')}
            className={errors.organizerName ? 'border-red-500' : ''}
          />
          {errors.organizerName && <p className="text-red-500 text-sm mt-1">{errors.organizerName.message as string}</p>}
        </div>
        
        <div>
          <Label htmlFor="contactEmail">Email de contacto *</Label>
          <Input 
            id="contactEmail" 
            type="email"
            {...register('contactEmail')}
            className={errors.contactEmail ? 'border-red-500' : ''}
          />
          {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail.message as string}</p>}
        </div>
      </div>
      
      {/* Imágenes */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium">Imágenes</h3>
        
        <div>
          <Label htmlFor="coverImage">URL de imagen de portada</Label>
          <Input 
            id="coverImage" 
            {...register('coverImage')}
            placeholder="https://ejemplo.com/imagen.jpg"
            className={errors.coverImage ? 'border-red-500' : ''}
          />
          {errors.coverImage && <p className="text-red-500 text-sm mt-1">{errors.coverImage.message as string}</p>}
          
          {watch('coverImage') && (
            <div className="mt-2 relative w-full h-40 rounded-md overflow-hidden border">
              <img 
                src={watch('coverImage')} 
                alt="Portada" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/640x360?text=Imagen+no+disponible';
                }}
              />
            </div>
          )}
        </div>
        
        <div>
          <Label htmlFor="additionalImage">Imágenes adicionales</Label>
          <div className="flex">
            <Input 
              id="additionalImage" 
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="flex-grow"
            />
            <Button 
              type="button"
              onClick={addImage}
              disabled={!newImageUrl}
              className="ml-2"
            >
              <Plus className="h-4 w-4" />
              Añadir
            </Button>
          </div>
          
          {additionalImages.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {additionalImages.map((img, index) => (
                <div key={index} className="relative group h-32 rounded-md overflow-hidden border">
                  <img 
                    src={img} 
                    alt={`Imagen adicional ${index + 1}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Datos bancarios */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium">Datos bancarios (para transferencias)</h3>
        
        <div>
          <Label htmlFor="accountName">Nombre de la cuenta</Label>
          <Input 
            id="accountName" 
            {...register('bankInfo.accountName')}
          />
        </div>
        
        <div>
          <Label htmlFor="bankName">Banco</Label>
          <Input 
            id="bankName" 
            {...register('bankInfo.bankName')}
          />
        </div>
        
        <div>
          <Label htmlFor="cbu">CBU</Label>
          <Input 
            id="cbu" 
            {...register('bankInfo.cbu')}
          />
        </div>
        
        <div>
          <Label htmlFor="alias">Alias</Label>
          <Input 
            id="alias" 
            {...register('bankInfo.alias')}
          />
        </div>
      </div>
      
      {/* Botones */}
      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : (project ? 'Actualizar proyecto' : 'Crear proyecto')}
        </Button>
      </div>
    </form>
  );
};

export { ProjectEditor }; 