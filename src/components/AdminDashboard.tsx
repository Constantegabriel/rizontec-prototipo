
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
    <div className="space-y-6 admin-panel-fix">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'stats' | 'sales')}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Dashboard</h3>
          <TabsList>
            <TabsTrigger value="stats" className="flex items-center gap-1">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Atividades</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Fluxo de Caixa</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="stats" className="mt-0">
          <AdminStats cars={cars} onCarRestored={onCarRestored} />
        </TabsContent>

        <TabsContent value="sales" className="mt-0">
          <SalesStats />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
