'use client';

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

type Expense = {
    category: string;
    amount: number;
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

    const COLORS = ['#2563eb', '#f59e0b', '#10b981', '#ef4444', '#6b7280'];

    return (
        <div className="w-full">
            <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 text-center text-sm text-gray-500">Expense breakdown by category</div>
        </div>
    );
}
