
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getSalesStats, getTotalSalesAmount } from '@/utils/activityLogger';
import { formatCurrency } from '@/lib/utils';

const SalesStats: React.FC = () => {
  const [activePeriod, setActivePeriod] = useState<'7d' | '15d' | '30d' | '6m' | '1y'>('7d');
  
  const stats = getSalesStats(activePeriod);
  const totalSales = getTotalSalesAmount();
  
  const formatData = (labels: string[], data: number[]) => {
    return labels.map((label, index) => ({
      name: label,
      value: data[index]
    }));
  };
  
  const chartData = formatData(stats.labels, stats.data);
  
  const periods = [
    { id: '7d', label: '7 dias' },
    { id: '15d', label: '15 dias' },
    { id: '30d', label: '30 dias' },
    { id: '6m', label: '6 meses' },
    { id: '1y', label: '1 ano' }
  ];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Vendas e Negociações</CardTitle>
        <CardDescription>Acompanhe os resultados financeiros</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total de Vendas</p>
              <h3 className="text-2xl font-bold">{formatCurrency(totalSales)}</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {periods.map(period => (
                <Button
                  key={period.id}
                  size="sm"
                  variant={activePeriod === period.id ? "default" : "outline"}
                  onClick={() => setActivePeriod(period.id as any)}
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) => {
                      if (value >= 1000000) {
                        return `${(value / 1000000).toFixed(1)}M`;
                      } else if (value >= 1000) {
                        return `${(value / 1000).toFixed(1)}K`;
                      }
                      return value.toString();
                    }}
                  />
                  <Tooltip formatter={(value) => [`${formatCurrency(value as number)}`, 'Valor']} />
                  <Bar dataKey="value" fill="#FF4D4F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">Sem dados disponíveis para o período selecionado</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">Dados de vendas e trocas</p>
      </CardFooter>
    </Card>
  );
};

export default SalesStats;
