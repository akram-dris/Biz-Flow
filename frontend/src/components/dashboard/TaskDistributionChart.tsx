import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';

const data = [
    { name: 'Completed', value: 45 },
    { name: 'In Progress', value: 25 },
    { name: 'Pending', value: 20 },
    { name: 'On Hold', value: 10 },
];

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444'];

export function TaskDistributionChart() {
    return (
        <div className="relative overflow-hidden rounded-2xl p-6 bg-card border border-default shadow-sm backdrop-blur-xl h-full">
            <h3 className="text-lg font-semibold text-foreground mb-1">Task Status</h3>
            <p className="text-sm text-foreground-muted mb-6">Distribution of tasks by status</p>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                                border: '1px solid rgba(148, 163, 184, 0.2)',
                                borderRadius: '8px',
                            }}
                            itemStyle={{ color: '#e2e8f0' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value) => <span style={{ color: '#94a3b8' }}>{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default TaskDistributionChart;
