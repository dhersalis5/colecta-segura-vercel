
import React, { useState } from 'react';
import { Project } from '@/data/projects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Image as ImageIcon } from 'lucide-react';

interface ProjectFormModalProps {
  project: Project;
  onSave: (project: Project) => void;
  onCancel: () => void;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  project,
  onSave,
  onCancel
}) => {
  const [form, setForm] = useState<Project>({...project});
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: parseFloat(value) || 0
    });
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setForm({
      ...form,
      featured: checked
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">
            {form.id ? "Editar Proyecto" : "Nuevo Proyecto"}
          </h3>
          <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título del Proyecto</Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                placeholder="Ej: Agua Limpia para San Miguel"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Describe brevemente el proyecto..."
                rows={3}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="fullDescription">Descripción Completa (HTML)</Label>
              <Textarea
                id="fullDescription"
                name="fullDescription"
                value={form.fullDescription || ''}
                onChange={handleInputChange}
                placeholder="<p>Descripción detallada con formato HTML...</p>"
                rows={6}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="image">URL de Imagen Principal</Label>
                <div className="flex gap-2">
                  <Input
                    id="image"
                    name="image"
                    value={form.image}
                    onChange={handleInputChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Input
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  placeholder="Ej: Educación, Salud, Medio Ambiente"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="currentAmount">Monto Actual ($)</Label>
                <Input
                  id="currentAmount"
                  name="currentAmount"
                  type="number"
                  value={form.currentAmount}
                  onChange={handleNumberChange}
                  min="0"
                  step="1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="targetAmount">Meta ($)</Label>
                <Input
                  id="targetAmount"
                  name="targetAmount"
                  type="number"
                  value={form.targetAmount}
                  onChange={handleNumberChange}
                  min="1"
                  step="1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="daysLeft">Días Restantes</Label>
                <Input
                  id="daysLeft"
                  name="daysLeft"
                  type="number"
                  value={form.daysLeft}
                  onChange={handleNumberChange}
                  min="1"
                  step="1"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  name="location"
                  value={form.location || ''}
                  onChange={handleInputChange}
                  placeholder="Ej: Ciudad de México"
                />
              </div>
              
              <div>
                <Label htmlFor="organizer">Organizador</Label>
                <Input
                  id="organizer"
                  name="organizer"
                  value={form.organizer || ''}
                  onChange={handleInputChange}
                  placeholder="Nombre de la organización o persona"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={form.featured}
                onCheckedChange={handleCheckboxChange}
              />
              <label
                htmlFor="featured"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Proyecto Destacado
              </label>
            </div>
            
            <div className="pt-4 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">
                Guardar Proyecto
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;
