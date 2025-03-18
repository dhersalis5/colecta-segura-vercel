import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from '@/types/project';
import * as projectService from '@/services/projectService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const DonationStats: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalRaised: 0,
    totalDonors: 0,
    activeProjects: 0,
    avgDonation: 0,
    mostFundedProject: null as Project | null
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const loadedProjects = await projectService.getAllProjects();
      setProjects(loadedProjects);
      
      // Calcular estadísticas
      if (loadedProjects.length > 0) {
        const totalRaised = loadedProjects.reduce((sum, project) => sum + project.amountRaised, 0);
        const totalDonors = loadedProjects.reduce((sum, project) => sum + project.donorsCount, 0);
        const activeProjects = loadedProjects.filter(project => project.isActive).length;
        const avgDonation = totalDonors > 0 ? totalRaised / totalDonors : 0;
        const mostFundedProject = [...loadedProjects].sort((a, b) => b.amountRaised - a.amountRaised)[0];
        
        setStats({
          totalRaised,
          totalDonors,
          activeProjects,
          avgDonation,
          mostFundedProject
        });
      }
    } catch (err) {
      setError('Error al cargar estadísticas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total recaudado</CardDescription>
            <CardTitle className="text-3xl font-bold text-primary">
              ${stats.totalRaised.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Proyectos activos</CardDescription>
            <CardTitle className="text-3xl font-bold text-primary">
              {stats.activeProjects}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total donantes</CardDescription>
            <CardTitle className="text-3xl font-bold text-primary">
              {stats.totalDonors}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Donación promedio</CardDescription>
            <CardTitle className="text-3xl font-bold text-primary">
              ${stats.avgDonation.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Proyecto más financiado */}
      {stats.mostFundedProject && (
        <Card>
          <CardHeader>
            <CardTitle>Proyecto más financiado</CardTitle>
            <CardDescription>
              El proyecto que ha recibido más donaciones hasta el momento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {stats.mostFundedProject.coverImage && (
                <div className="w-full md:w-1/3 h-48 overflow-hidden rounded-md">
                  <img 
                    src={stats.mostFundedProject.coverImage} 
                    alt={stats.mostFundedProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="w-full md:w-2/3">
                <h3 className="text-xl font-semibold mb-2">{stats.mostFundedProject.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{stats.mostFundedProject.shortDescription}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Recaudado</p>
                    <p className="text-lg font-medium">${stats.mostFundedProject.amountRaised.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Meta</p>
                    <p className="text-lg font-medium">${stats.mostFundedProject.goalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Donantes</p>
                    <p className="text-lg font-medium">{stats.mostFundedProject.donorsCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Porcentaje</p>
                    <p className="text-lg font-medium">
                      {((stats.mostFundedProject.amountRaised / stats.mostFundedProject.goalAmount) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de proyectos */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de proyectos</CardTitle>
          <CardDescription>Estado de financiación de todos los proyectos</CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">No hay proyectos para mostrar</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Proyecto</th>
                    <th className="text-left py-3 px-4">Estado</th>
                    <th className="text-right py-3 px-4">Meta</th>
                    <th className="text-right py-3 px-4">Recaudado</th>
                    <th className="text-right py-3 px-4">Progreso</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} className="border-b">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {project.coverImage && (
                            <div className="h-10 w-10 mr-3 rounded overflow-hidden flex-shrink-0">
                              <img 
                                src={project.coverImage} 
                                alt="" 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div className="truncate max-w-[200px]">{project.title}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          project.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {project.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">${project.goalAmount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">${project.amountRaised.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end">
                          <span className="mr-2">
                            {((project.amountRaised / project.goalAmount) * 100).toFixed(1)}%
                          </span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ 
                                width: `${Math.min(100, (project.amountRaised / project.goalAmount) * 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationStats; 