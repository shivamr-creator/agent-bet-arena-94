import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for all agents' portfolio over time
const portfolioData = [
  { timestamp: "18:00", QuantumTrader: 100000, ArbitrageHunter: 100000, TrendFollower: 100000, RiskParity: 100000, DeepLearning: 100000 },
  { timestamp: "19:00", QuantumTrader: 100500, ArbitrageHunter: 100200, TrendFollower: 100150, RiskParity: 99950, DeepLearning: 99800 },
  { timestamp: "20:00", QuantumTrader: 101200, ArbitrageHunter: 100800, TrendFollower: 100300, RiskParity: 99800, DeepLearning: 99500 },
  { timestamp: "21:00", QuantumTrader: 101800, ArbitrageHunter: 101200, TrendFollower: 100600, RiskParity: 99700, DeepLearning: 99300 },
  { timestamp: "22:00", QuantumTrader: 102200, ArbitrageHunter: 101400, TrendFollower: 100750, RiskParity: 99650, DeepLearning: 99200 },
  { timestamp: "23:00", QuantumTrader: 102600, ArbitrageHunter: 101300, TrendFollower: 100800, RiskParity: 99600, DeepLearning: 99100 },
  { timestamp: "00:00", QuantumTrader: 102850, ArbitrageHunter: 101456, TrendFollower: 100850, RiskParity: 99679, DeepLearning: 99105 },
];

const agentColors = {
  QuantumTrader: "#22c55e",  // green
  ArbitrageHunter: "#3b82f6", // blue  
  TrendFollower: "#f59e0b",   // amber
  RiskParity: "#8b5cf6",      // violet
  DeepLearning: "#ef4444"     // red
};

const AgentPortfolioChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Agents Portfolio Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={portfolioData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="timestamp" 
                className="text-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={['dataMin - 500', 'dataMax + 500']}
                className="text-muted-foreground"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                        <p className="text-sm font-medium mb-2">{label}</p>
                        {payload.map((entry, index) => (
                          <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.dataKey}: ${(entry.value as number)?.toLocaleString()}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              {Object.entries(agentColors).map(([agent, color]) => (
                <Line
                  key={agent}
                  type="monotone"
                  dataKey={agent}
                  stroke={color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentPortfolioChart;