'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export default function BudgetChart({ used, total }: { used: number; total: number }) {
    const remaining = total - used;
    const usedPercentage = ((used / total) * 100).toFixed(1);
    const remainingPercentage = ((remaining / total) * 100).toFixed(1);

    const data = [
        {
            name: 'Budget Used',
            value: used,
            percentage: usedPercentage,
            displayValue: `KES ${used.toLocaleString()}`,
        },
        {
            name: 'Budget Remaining',
            value: remaining,
            percentage: remainingPercentage,
            displayValue: `KES ${remaining.toLocaleString()}`,
        },
    ];

    // Enterprise color scheme matching dashboard
    const COLORS = {
        used: '#3b82f6', // Blue-500 (matches dashboard primary)
        remaining: '#e5e7eb', // Gray-200 (neutral background)
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-600 dark:bg-gray-800">
                    <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: payload[0].color }} />
                        <span className="font-medium text-gray-900 dark:text-white">{data.name}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {data.displayValue} ({data.percentage}%)
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex h-full w-full flex-col space-y-4">
            {/* Chart Container with Center Label */}
            <div className="relative min-h-[200px] flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                            <Cell fill={COLORS.used} />
                            <Cell fill={COLORS.remaining} />
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Label - Budget Utilization */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{usedPercentage}%</div>
                        <div className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">Utilized</div>
                    </div>
                </div>
            </div>

            {/* Custom Legend */}
            <div className="flex justify-center space-x-6">
                {data.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: index === 0 ? COLORS.used : COLORS.remaining }} />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{entry.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">({entry.percentage}%)</span>
                    </div>
                ))}
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            <span className="text-xs font-medium tracking-wide text-blue-700 uppercase dark:text-blue-400">Used</span>
                        </div>
                        <span className="text-xs text-blue-600 dark:text-blue-300">{usedPercentage}%</span>
                    </div>
                    <div className="mt-1 text-sm font-semibold text-blue-900 dark:text-blue-100">KES {used.toLocaleString()}</div>
                </div>

                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                            <span className="text-xs font-medium tracking-wide text-gray-600 uppercase dark:text-gray-300">Available</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{remainingPercentage}%</span>
                    </div>
                    <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">KES {remaining.toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
}
