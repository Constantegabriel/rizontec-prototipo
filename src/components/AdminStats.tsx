
import React, { useState, useEffect } from 'react';
import { Car } from '@/data/cars';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronRight, ChevronDown, LineChart, Car as CarIcon, PlusCircle, MinusCircle, InfoIcon } from 'lucide-react';

type CarActivity = {
  id: number;
  carName: string;
  action: 'added' | 'deleted' | 'edited';
  timestamp: Date;
};

interface AdminStatsProps {
  cars: Car[];
}

const AdminStats: React.FC<AdminStatsProps> = ({ cars }) => {
  const [activityLog, setActivityLog] = useState<CarActivity[]>([]);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    'total': true,
    'recent': false
  });
  const [selectedActivity, setSelectedActivity] = useState<CarActivity | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Load activity log from localStorage on component mount
  useEffect(() => {
    const savedLog = localStorage.getItem('carActivityLog');
    if (savedLog) {
      try {
        // Convert string dates back to Date objects
        const parsedLog = JSON.parse(savedLog, (key, value) => {
          if (key === 'timestamp') return new Date(value);
          return value;
        });
        setActivityLog(parsedLog);
      } catch (error) {
        console.error('Error parsing activity log:', error);
        setActivityLog([]);
      }
    }
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'added': return 'text-green-500';
      case 'deleted': return 'text-red-500';
      case 'edited': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'added': return <PlusCircle className="h-4 w-4 text-green-500" />;
      case 'deleted': return <MinusCircle className="h-4 w-4 text-red-500" />;
      case 'edited': return <InfoIcon className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  const showActivityDetails = (activity: CarActivity) => {
    setSelectedActivity(activity);
    setIsDetailsOpen(true);
  };

  // Calculate statistics
  const totalCars = cars.length;
  const addedCars = activityLog.filter(log => log.action === 'added').length;
  const deletedCars = activityLog.filter(log => log.action === 'deleted').length;
  const editedCars = activityLog.filter(log => log.action === 'edited').length;
  
  // Get recent activity (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentActivity = activityLog
    .filter(activity => activity.timestamp > sevenDaysAgo)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Estatísticas do Estoque</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total no Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CarIcon className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">{totalCars}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Adicionados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <PlusCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold">{addedCars}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Excluídos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MinusCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-2xl font-bold">{deletedCars}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Editados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <InfoIcon className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">{editedCars}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader 
          className="cursor-pointer border-b"
          onClick={() => toggleSection('total')}
        >
          <div className="flex justify-between items-center">
            <CardTitle>Registro de Atividades</CardTitle>
            {expandedSections.total ? 
              <ChevronDown className="h-5 w-5" /> : 
              <ChevronRight className="h-5 w-5" />
            }
          </div>
        </CardHeader>
        {expandedSections.total && (
          <CardContent className="pt-6">
            {activityLog.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhuma atividade registrada</p>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {activityLog
                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                  .slice(0, 10)
                  .map((activity, index) => (
                    <div 
                      key={`${activity.id}-${index}`} 
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/30 transition-colors"
                      onClick={() => showActivityDetails(activity)}
                    >
                      <div className="flex items-center">
                        {getActionIcon(activity.action)}
                        <span className="ml-2">{activity.carName}</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`mr-3 font-medium ${getActionColor(activity.action)}`}>
                          {activity.action === 'added' ? 'Adicionado' : 
                           activity.action === 'deleted' ? 'Excluído' : 'Editado'}
                        </span>
                        <span className="text-sm text-gray-500">{formatDate(activity.timestamp)}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>
      
      <Card>
        <CardHeader 
          className="cursor-pointer border-b"
          onClick={() => toggleSection('recent')}
        >
          <div className="flex justify-between items-center">
            <CardTitle>Atividade Recente (Últimos 7 dias)</CardTitle>
            {expandedSections.recent ? 
              <ChevronDown className="h-5 w-5" /> : 
              <ChevronRight className="h-5 w-5" />
            }
          </div>
        </CardHeader>
        {expandedSections.recent && (
          <CardContent className="pt-6">
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhuma atividade recente</p>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {recentActivity.map((activity, index) => (
                  <div 
                    key={`recent-${activity.id}-${index}`} 
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/30 transition-colors"
                    onClick={() => showActivityDetails(activity)}
                  >
                    <div className="flex items-center">
                      {getActionIcon(activity.action)}
                      <span className="ml-2">{activity.carName}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`mr-3 font-medium ${getActionColor(activity.action)}`}>
                        {activity.action === 'added' ? 'Adicionado' : 
                         activity.action === 'deleted' ? 'Excluído' : 'Editado'}
                      </span>
                      <span className="text-sm text-gray-500">{formatDate(activity.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>
      
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Atividade</DialogTitle>
          </DialogHeader>
          
          {selectedActivity && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Veículo</p>
                  <p className="font-medium">{selectedActivity.carName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ação</p>
                  <p className={`font-medium ${getActionColor(selectedActivity.action)}`}>
                    {selectedActivity.action === 'added' ? 'Adicionado' : 
                     selectedActivity.action === 'deleted' ? 'Excluído' : 'Editado'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data/Hora</p>
                  <p className="font-medium">{formatDate(selectedActivity.timestamp)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ID</p>
                  <p className="font-medium">{selectedActivity.id}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStats;
