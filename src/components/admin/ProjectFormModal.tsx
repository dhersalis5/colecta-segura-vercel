import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from '@/types/project';

interface ProjectFormModalProps {
  project: Project;
  onSave: (project: Project) => Promise<void>;
  onCancel: () => void;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  project,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = React.useState({
    ...project,
    targetAmount: project.targetAmount?.toString() || '',
    daysLeft: project.daysLeft?.toString() || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      ...formData,
      targetAmount: parseFloat(formData.targetAmount) || 0,
      daysLeft: parseInt(formData.daysLeft) || 30
    } as Project);
  };

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSwitchChange = (field: string) => (checked: boolean) => {
    setFormData({ ...formData, [field]: checked });
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {project.id ? 'Editar Proyecto' : 'Nuevo Proyecto'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={handleChange('title')}
              placeholder="Título del proyecto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Descripción del proyecto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">URL de la imagen</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={handleChange('image')}
              placeholder="URL de la imagen"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Meta de recaudación</Label>
              <Input
                id="targetAmount"
                type="number"
                value={formData.targetAmount}
                onChange={handleChange('targetAmount')}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="daysLeft">Días restantes</Label>
              <Input
                id="daysLeft"
                type="number"
                value={formData.daysLeft}
                onChange={handleChange('daysLeft')}
                placeholder="30"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select
              value={formData.category}
              onValueChange={handleSelectChange('category')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Educación">Educación</SelectItem>
                <SelectItem value="Salud">Salud</SelectItem>
                <SelectItem value="Medio Ambiente">Medio Ambiente</SelectItem>
                <SelectItem value="Tecnología">Tecnología</SelectItem>
                <SelectItem value="Deportes">Deportes</SelectItem>
                <SelectItem value="Arte y Cultura">Arte y Cultura</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={formData.status}
              onValueChange={handleSelectChange('status')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={handleSwitchChange('featured')}
            />
            <Label htmlFor="featured">Proyecto destacado</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {project.id ? 'Guardar cambios' : 'Crear proyecto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormModal;
