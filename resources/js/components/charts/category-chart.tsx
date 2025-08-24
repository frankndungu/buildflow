'use client';

import { motion } from 'framer-motion';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

type Expense = {
    category: string;
    amount: number;
};

type CustomTooltipProps = {
    active?: boolean;
    payload?: Array<{
        name: string;
        value: number;
    }>;
};

export default function CategoryChart({ expenses }: { expenses: Expense[] }) {
    const grouped = expenses.reduce<Record<string, number>>((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
        return acc;
    }, {});

    const data = Object.entries(grouped).map(([category, total]) => ({
        name: category,
        value: total,
    }));

    // Enhanced color palette with gradients
    const COLORS = [
        '#6366F1', // Indigo
        '#06B6D4', // Cyan
        '#10B981', // Emerald
        '#8B5CF6', // Violet
        '#EC4899', // Pink
        '#F59E0B', // Amber
        '#EF4444', // Red
        '#84CC16', // Lime
    ];

    const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
        if (active && payload && payload.length) {
            const total = data.reduce((a, b) => a + b.value, 0);
            const percentage = ((payload[0].value / total) * 100).toFixed(1);

            return (
                <div className="rounded-xl border border-gray-200/50 bg-white/95 p-4 shadow-2xl backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-800/95">
                    <p className="font-bold text-gray-900 dark:text-white">{payload[0].name}</p>
                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">KES {payload[0].value.toLocaleString()}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{percentage}% of total expenses</p>
                </div>
            );
        }
        return null;
    };

    if (!data.length) {
        return (
            <div className="flex h-[300px] items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl">📊</div>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">No expense data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-6">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={120}
                            paddingAngle={2}
                            dataKey="value"
                            label={(props) => {
                                const { cx, cy, midAngle, innerRadius, outerRadius, value, name } = props;

                                // Check for undefined values and skip label if any are missing
                                if (
                                    cx === undefined ||
                                    cy === undefined ||
                                    midAngle === undefined ||
                                    innerRadius === undefined ||
                                    outerRadius === undefined ||
                                    value === undefined ||
                                    name === undefined
                                ) {
                                    return null;
                                }

                                const RADIAN = Math.PI / 180;
                                const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                const total = data.reduce((a, b) => a + b.value, 0);
                                const percentage = ((value / total) * 100).toFixed(0);

                                // Only show label if percentage is > 5% to avoid clutter
                                if (parseFloat(percentage) < 5) return null;

                                return (
                                    <text
                                        x={x}
                                        y={y}
                                        className="fill-gray-700 text-xs font-semibold dark:fill-gray-300"
                                        textAnchor={x > cx ? 'start' : 'end'}
                                        dominantBaseline="central"
                                    >
                                        {`${percentage}%`}
                                    </text>
                                );
                            }}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    className="transition-all duration-300 hover:scale-105 hover:opacity-80"
                                    stroke={COLORS[index % COLORS.length]}
                                    strokeWidth={2}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.map((entry, index) => {
                    const total = data.reduce((a, b) => a + b.value, 0);
                    const percentage = ((entry.value / total) * 100).toFixed(1);

                    return (
                        <motion.div
                            key={entry.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-center justify-between rounded-lg bg-gray-50/50 p-3 backdrop-blur-sm transition-all duration-200 hover:bg-gray-100/50 dark:bg-gray-700/30 dark:hover:bg-gray-600/30"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="h-4 w-4 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span className="font-medium text-gray-700 dark:text-gray-300">{entry.name}</span>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-gray-900 dark:text-white">{percentage}%</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">KES {entry.value.toLocaleString()}</div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Categories</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.length}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Amount</div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            KES {data.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg per Category</div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            KES {Math.round(data.reduce((sum, item) => sum + item.value, 0) / data.length).toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
