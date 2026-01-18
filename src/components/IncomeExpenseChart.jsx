import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";

const COLORS = ["#10B981", "#EF4444"]; // Emerald (Success), Red (Danger)

export default function IncomeExpenseChart({ income, expense }) {
  const data = [
    { name: "Income", value: income },
    { name: "Expense", value: expense }
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Income vs Expense</CardTitle>
      </CardHeader>
      <CardContent>
        {income === 0 && expense === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-neutral-500">
            No data to display
          </div>
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
      </CardContent>
    </Card>
  );
}