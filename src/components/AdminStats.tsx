
import React, { useState, useEffect } from 'react';
import { Car } from '@/data/cars';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ChevronRight, ChevronDown, LineChart, Car as CarIcon, PlusCircle, MinusCircle, InfoIcon, RotateCcw, History } from 'lucide-react';
import { CarActivity, restoreDeletedCar } from '@/utils/activityLogger';

interface AdminStatsProps {
  cars: Car[];
  onCarRestored: () => void;
}

type ActivityFilter = 'all' | 'added' | 'deleted' | 'edited' | 'restored';

const AdminStats: React.FC<AdminStatsProps> = ({ cars, onCarRestored }) => {
  const [activityLog, setActivityLog] = useState<CarActivity[]>([]);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    'total': true,
    'recent': false,
    'deleted': false
  });
  const [selectedActivity, setSelectedActivity] = useState<CarActivity | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'7' | '15' | '30'>('7');
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>('all');

  useEffect(() => {
    loadActivityLog();
  }, []);

  const loadActivityLog = () => {
    const savedLog = localStorage.getItem('carActivityLog');
    if (savedLog) {
      try {
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
  };

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
      case 'restored': return 'text-amber-500';
      default: return 'text-gray-500';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'added': return <PlusCircle className="h-4 w-4 text-green-500" />;
      case 'deleted': return <MinusCircle className="h-4 w-4 text-red-500" />;
      case 'edited': return <InfoIcon className="h-4 w-4 text-blue-500" />;
      case 'restored': return <RotateCcw className="h-4 w-4 text-amber-500" />;
      default: return null;
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'added': return 'Adicionado';
      case 'deleted': return 'Excluído';
      case 'edited': return 'Editado';
      case 'restored': return 'Restaurado';
      default: return action;
    }
  };

  const showActivityDetails = (activity: CarActivity) => {
    setSelectedActivity(activity);
    setIsDetailsOpen(true);
  };

  const handleRestoreCar = () => {
    if (!selectedActivity) return;
    
    const restoredCar = restoreDeletedCar(selectedActivity.id);
    if (restoredCar) {
      toast.success(`Veículo ${restoredCar.name} ${restoredCar.version} restaurado com sucesso!`);
      loadActivityLog();
      onCarRestored();
    } else {
      toast.error('Não foi possível restaurar o veículo. Ele pode já ter sido restaurado ou os dados podem estar corrompidos.');
    }
    
    setIsRestoreDialogOpen(false);
    setIsDetailsOpen(false);
  };

  const openRestoreDialog = (activity: CarActivity) => {
    setSelectedActivity(activity);
    setIsRestoreDialogOpen(true);
  };

  const filterActivities = (activities: CarActivity[]) => {
    if (activityFilter === 'all') return activities;
    return activities.filter(activity => activity.action === activityFilter);
  };

  const handleStatCardClick = (filter: ActivityFilter) => {
    setActivityFilter(filter);
    setExpandedSections(prev => ({
      ...prev,
      total: true
    }));
  };

  const totalCars = cars.length;
  const addedCars = activityLog.filter(log => log.action === 'added').length;
  const deletedCars = activityLog.filter(log => log.action === 'deleted').length;
  const editedCars = activityLog.filter(log => log.action === 'edited').length;
  const restoredCars = activityLog.filter(log => log.action === 'restored').length;
  
  const getActivitiesByPeriod = (days: number) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return activityLog
      .filter(activity => activity.timestamp > cutoffDate)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };
  
  const deletedActivities = activityLog
    .filter(activity => activity.action === 'deleted' && activity.carData)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const recentActivities = getActivitiesByPeriod(parseInt(selectedPeriod));

  const filteredActivities = filterActivities(activityLog)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Estatísticas do Estoque</h3>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${activityFilter === 'all' ? 'ring-2 ring-primary' : ''}`} 
          onClick={() => handleStatCardClick('all')}
        >
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
        
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${activityFilter === 'added' ? 'ring-2 ring-green-500' : ''}`}
          onClick={() => handleStatCardClick('added')}
        >
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
        
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${activityFilter === 'deleted' ? 'ring-2 ring-red-500' : ''}`}
          onClick={() => handleStatCardClick('deleted')}
        >
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
        
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${activityFilter === 'edited' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => handleStatCardClick('edited')}
        >
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
        
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${activityFilter === 'restored' ? 'ring-2 ring-amber-500' : ''}`}
          onClick={() => handleStatCardClick('restored')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Restaurados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <RotateCcw className="h-5 w-5 text-amber-500 mr-2" />
              <span className="text-2xl font-bold">{restoredCars}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Activity logs - Reorganized to prevent horizontal scrolling */}
      <Card>
        <CardHeader 
          className="cursor-pointer border-b"
          onClick={() => toggleSection('total')}
        >
          <div className="flex justify-between items-center">
            <CardTitle>
              {activityFilter === 'all' 
                ? 'Registro de Atividades' 
                : `Atividades: ${getActionText(activityFilter)}`}
            </CardTitle>
            {expandedSections.total ? 
              <ChevronDown className="h-5 w-5" /> : 
              <ChevronRight className="h-5 w-5" />
            }
          </div>
        </CardHeader>
        {expandedSections.total && (
          <CardContent className="pt-6">
            {filteredActivities.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhuma atividade registrada</p>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {filteredActivities.slice(0, 20).map((activity, index) => (
                  <div 
                    key={`${activity.id}-${index}`} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer gap-2"
                    onClick={() => showActivityDetails(activity)}
                  >
                    <div className="flex items-center">
                      {getActionIcon(activity.action)}
                      <span className="ml-2 truncate">{activity.carName}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className={`font-medium ${getActionColor(activity.action)}`}>
                        {getActionText(activity.action)}
                      </span>
                      <span className="text-sm text-gray-500">{formatDate(activity.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activityFilter !== 'all' && (
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setActivityFilter('all')}
                >
                  Mostrar Todas as Atividades
                </Button>
              </div>
            )}
          </CardContent>
        )}
      </Card>
      
      {/* Recent Activity - Fixed tabs for mobile */}
      <Card>
        <CardHeader 
          className="cursor-pointer border-b"
          onClick={() => toggleSection('recent')}
        >
          <div className="flex justify-between items-center">
            <CardTitle>Atividade Recente</CardTitle>
            {expandedSections.recent ? 
              <ChevronDown className="h-5 w-5" /> : 
              <ChevronRight className="h-5 w-5" />
            }
          </div>
        </CardHeader>
        {expandedSections.recent && (
          <CardContent className="pt-6">
            <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as '7' | '15' | '30')}>
              <div className="overflow-x-auto pb-2">
                <TabsList className="mb-4 grid grid-cols-3 min-w-full">
                  <TabsTrigger value="7">7 dias</TabsTrigger>
                  <TabsTrigger value="15">15 dias</TabsTrigger>
                  <TabsTrigger value="30">30 dias</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value={selectedPeriod}>
                {recentActivities.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhuma atividade neste período</p>
                ) : (
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {recentActivities.map((activity, index) => (
                      <div 
                        key={`recent-${activity.id}-${index}`} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer gap-2"
                        onClick={() => showActivityDetails(activity)}
                      >
                        <div className="flex items-center">
                          {getActionIcon(activity.action)}
                          <span className="ml-2 truncate">{activity.carName}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <span className={`font-medium ${getActionColor(activity.action)}`}>
                            {getActionText(activity.action)}
                          </span>
                          <span className="text-sm text-gray-500">{formatDate(activity.timestamp)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        )}
      </Card>
      
      {/* Deleted vehicles section */}
      <Card>
        <CardHeader 
          className="cursor-pointer border-b"
          onClick={() => toggleSection('deleted')}
        >
          <div className="flex justify-between items-center">
            <CardTitle>Veículos Excluídos</CardTitle>
            {expandedSections.deleted ? 
              <ChevronDown className="h-5 w-5" /> : 
              <ChevronRight className="h-5 w-5" />
            }
          </div>
        </CardHeader>
        {expandedSections.deleted && (
          <CardContent className="pt-6">
            {deletedActivities.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum veículo excluído para restaurar</p>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {deletedActivities.map((activity, index) => (
                  <div 
                    key={`deleted-${activity.id}-${index}`} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:bg-secondary/30 transition-colors gap-2"
                  >
                    <div className="flex items-center">
                      <MinusCircle className="h-4 w-4 text-red-500" />
                      <span className="ml-2 truncate">{activity.carName}</span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
                      <span className="text-sm text-gray-500">{formatDate(activity.timestamp)}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openRestoreDialog(activity)}
                        className="flex items-center gap-1"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Restaurar
                      </Button>
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
            {selectedActivity && selectedActivity.action === 'deleted' && selectedActivity.carData && (
              <DialogDescription>
                Este veículo foi excluído mas pode ser restaurado.
              </DialogDescription>
            )}
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
                    {getActionText(selectedActivity.action)}
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
              
              {selectedActivity.action === 'deleted' && selectedActivity.carData && (
                <div className="pt-4 flex justify-end">
                  <Button 
                    onClick={() => openRestoreDialog(selectedActivity)}
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Restaurar Veículo
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restaurar Veículo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja restaurar o veículo {selectedActivity?.carName}?
              Este veículo será adicionado novamente ao seu estoque.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestoreCar}>
              Restaurar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminStats;
