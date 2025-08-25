'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

type DetailedExpense = {
    id: number;
    description: string;
    amount: number;
    category: string;
    spent_at: string;
    receipt_path: string;
    uploader?: {
        name: string;
    };
};

type SimpleCategoryExpense = {
    category: string;
    amount: number;
};

type CategoryChartProps = {
    expenses: DetailedExpense[] | SimpleCategoryExpense[];
};

export default function CategoryChart({ expenses }: CategoryChartProps) {
    const categoryTotals = expenses.reduce(
        (acc, expense) => {
            const category = expense.category;
            acc[category] = (acc[category] || 0) + Number(expense.amount);
            return acc;
        },
        {} as Record<string, number>,
    );

    const totalAmount = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

    const data = Object.entries(categoryTotals).map(([category, amount]) => ({
        name: category,
        value: amount,
        percentage: ((amount / totalAmount) * 100).toFixed(1),
        displayValue: `KES ${amount.toLocaleString()}`,
    }));

    // Professional color scheme matching the budget chart
    const COLORS = {
        material: '#3b82f6', // Blue-500
        labor: '#10b981', // Emerald-500
        logistics: '#f59e0b', // Amber-500
        misc: '#8b5cf6', // Violet-500
    };

    const getColor = (category: string) => {
        return COLORS[category.toLowerCase() as keyof typeof COLORS] || '#6b7280'; // Gray-500 fallback
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-600 dark:bg-gray-800">
                    <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: payload[0].color }} />
                        <span className="font-medium text-gray-900 capitalize dark:text-white">{data.name}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {data.displayValue} ({data.percentage}%)
                    </div>
                </div>
            );
        }
        return null;
    };

    if (data.length === 0) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">
                    <div className="text-2xl font-bold text-gray-400">No Data</div>
                    <div className="text-sm text-gray-500">No expenses recorded yet</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full flex-col space-y-4">
            {/* Chart Container */}
            <div className="relative min-h-[200px] flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div className="flex flex-wrap justify-center gap-4">
                {data.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: getColor(entry.name) }} />
                        <span className="text-sm font-medium text-gray-700 capitalize dark:text-gray-300">{entry.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">({entry.percentage}%)</span>
                    </div>
                ))}
            </div>

            {/* Summary Statistics */}
            <div className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700/50">
                <div className="flex items-center justify-between text-sm">
                    <div className="text-center">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{data.length}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Categories</div>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold text-blue-600 dark:text-blue-400">KES {(totalAmount / 1000000).toFixed(1)}M</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                            KES {(Math.round(totalAmount / data.length) / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Avg/Category</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
