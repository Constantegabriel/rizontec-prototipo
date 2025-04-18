
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminStats from './AdminStats';
import SalesStats from './SalesStats';
import { Car } from '@/data/cars';
import { Car as CarIcon, DollarSign, BarChart3, History } from 'lucide-react';

interface AdminDashboardProps {
  cars: Car[];
  onCarRestored: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ cars, onCarRestored }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'sales'>('stats');

  return (
    <div className="space-y-4 p-4">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'stats' | 'sales')}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-xl font-semibold">Dashboard</h3>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="stats" className="flex-1 sm:flex-initial flex items-center gap-1">
              <History className="h-4 w-4" />
              <span>Atividades</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex-1 sm:flex-initial flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span>Fluxo de Caixa</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="stats" className="mt-0 space-y-4">
          <AdminStats cars={cars} onCarRestored={onCarRestored} />
        </TabsContent>

        <TabsContent value="sales" className="mt-0 space-y-4">
          <SalesStats />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
