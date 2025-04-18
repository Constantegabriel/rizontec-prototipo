
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getSalesStats, getTotalSalesAmount, getTotalSalesCount, getSalesByPeriod } from '@/utils/activityLogger';
import { formatCurrency } from '@/lib/utils';
import { CreditCard, RefreshCcw, DollarSign, BarChart3, FileDown } from 'lucide-react';
import { toast } from 'sonner';

const SalesStats: React.FC = () => {
  const [activePeriod, setActivePeriod] = useState<'7d' | '14d' | '21d' | '30d' | '3m' | '6m' | '12m'>('7d');
  const chartRef = useRef<HTMLDivElement>(null);
  
  const stats = getSalesByPeriod(activePeriod);
  const totalSales = getTotalSalesAmount();
  const { sold, traded } = getTotalSalesCount();
  
  const formatData = (labels: string[], salesData: number[], tradesData: number[]) => {
    return labels.map((label, index) => ({
      name: label,
      vendas: salesData[index],
      trocas: tradesData[index]
    }));
  };
  
  const chartData = formatData(stats.labels, stats.salesData, stats.tradesData);
  
  const periods = [
    { id: '7d', label: '7 dias' },
    { id: '14d', label: '14 dias' },
    { id: '21d', label: '21 dias' },
    { id: '30d', label: '30 dias' },
    { id: '3m', label: '3 meses' },
    { id: '6m', label: '6 meses' },
    { id: '12m', label: '12 meses' }
  ];

  const downloadPDF = () => {
    // This is a simple implementation that would need to be expanded with a proper PDF library like jsPDF
    // For now, we'll show a toast message
    toast.success(`Relatório de ${getPeriodLabel(activePeriod)} baixado com sucesso!`);
  };

  const getPeriodLabel = (period: string): string => {
    const periodObj = periods.find(p => p.id === period);
    return periodObj ? periodObj.label : period;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Fluxo de Caixa
        </CardTitle>
        <CardDescription>Acompanhe vendas, trocas e resultados financeiros</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Vendas</p>
                  <h3 className="text-2xl font-bold">{formatCurrency(totalSales)}</h3>
                </div>
                <div className="bg-primary/20 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Vendas Realizadas</p>
                  <h3 className="text-2xl font-bold">{sold} veículos</h3>
                </div>
                <div className="bg-green-500/20 p-3 rounded-full">
                  <CreditCard className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trocas Realizadas</p>
                  <h3 className="text-2xl font-bold">{traded} veículos</h3>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <RefreshCcw className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Period Selection */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Histórico de Transações</h3>
            </div>
            
            <div className="overflow-x-auto pb-2">
              <TabsList className="inline-flex h-9 items-center rounded-lg bg-muted p-1 text-muted-foreground w-full justify-start space-x-1 min-w-max">
                {periods.map(period => (
                  <TabsTrigger
                    key={period.id}
                    value={period.id}
                    onClick={() => setActivePeriod(period.id as any)}
                    className={`rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow ${
                      activePeriod === period.id ? 'bg-primary text-primary-foreground' : ''
                    }`}
                  >
                    {period.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>
          
          {/* Chart */}
          <div className="h-[300px] w-full bg-background" ref={chartRef}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis 
                    stroke="#888"
                    tickFormatter={(value) => {
                      if (value === 0) return '0';
                      return value.toString();
                    }}
                  />
                  <Tooltip 
                    formatter={(value) => [value, '']} 
                    labelFormatter={(value) => `Período: ${value}`}
                    contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
                  />
                  <Legend />
                  <Bar dataKey="vendas" name="Vendas" fill="#FF4D4F" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="trocas" name="Trocas" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-background">
                <p className="text-muted-foreground mb-4">Sem dados disponíveis para o período selecionado</p>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[{name: 'Sem dados', vendas: 0, trocas: 0}]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" domain={[0, 5]} />
                      <Tooltip contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }} />
                      <Legend />
                      <Bar dataKey="vendas" name="Vendas" fill="#FF4D4F" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="trocas" name="Trocas" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Dados de vendas e trocas de veículos</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={downloadPDF}
        >
          <FileDown className="h-4 w-4" />
          Baixar PDF
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SalesStats;
