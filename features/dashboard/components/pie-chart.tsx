'use client';

import { TrendingUp } from 'lucide-react';
import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export const description = 'A donut chart with text';

// We can define base colors or mapping, but for simplicity let's use chart vars
// Ideally we would map statuses to specific colors
const chartConfig = {
  value: {
    label: 'Count',
  },
  developing: {
    label: 'Developing',
    color: 'var(--chart-1)',
  },
  completed: {
    label: 'Completed',
    color: 'var(--chart-2)',
  },
  planning: {
    label: 'Planning',
    color: 'var(--chart-3)',
  },
  maintenance: {
    label: 'Maintenance',
    color: 'var(--chart-4)',
  },
  archived: {
    label: 'Archived',
    color: 'var(--chart-5)',
  },
  deployed: {
    label: 'Deployed',
    color: 'var(--chart-1)', // Reusing color if needed or add more
  },
} satisfies ChartConfig;

interface DistributionChartProps {
  data: {
    name: string;
    value: number;
    fill?: string;
  }[];
}

export function DistributionChart({ data }: DistributionChartProps) {
  const processedData = React.useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      fill: `var(--chart-${(index % 5) + 1})`,
    }));
  }, [data]);

  const totalProjects = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0);
  }, [data]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Project Status</CardTitle>
        <CardDescription>Distribution by Status</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={processedData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {totalProjects.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Projects
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Current project landscape <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Showing distribution across all projects</div>
      </CardFooter>
    </Card>
  );
}

export default DistributionChart;
