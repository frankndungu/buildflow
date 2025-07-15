'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export default function BudgetChart({ used, total }: { used: number; total: number }) {
    const data = [
        { name: 'Used', value: used },
        { name: 'Remaining', value: total - used },
    ];

    const COLORS = ['#2563eb', '#d1d5db']; // Blue + gray

    return (
        <div className="w-full">
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie data={data} innerRadius={60} outerRadius={80} dataKey="value" stroke="none">
                        {data.map((_, i) => (
                            <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 text-center text-sm text-gray-600">
                KES {used.toLocaleString()} used of KES {total.toLocaleString()}
            </div>
        </div>
    );
}
