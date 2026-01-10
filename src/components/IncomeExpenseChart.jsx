import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#22c55e", "#ef4444"]; // green, red

export default function IncomeExpenseChart({ income, expense }) {
  const data = [
    { name: "Income", value: income },
    { name: "Expense", value: expense }
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-sky-700 mb-4">
        Income vs Expense
      </h3>

      {income === 0 && expense === 0 ? (
        <p className="text-sm text-gray-500">No data to display</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}