import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface PriceChartProps {
  title: string;
  data?: any[];
}

const PriceChart = ({ title, data }: PriceChartProps) => {
  // Generate sample price history data
  const generatePriceData = () => {
    const now = new Date();
    const dataPoints = [];
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const basePrice = 0.65;
      const variation = (Math.random() - 0.5) * 0.1;
      const price = Math.max(0.1, Math.min(0.9, basePrice + variation));
      
      dataPoints.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        price: price,
        percentage: price * 100
      });
    }
    return dataPoints;
  };

  const chartData = data || generatePriceData();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title} Price History</h3>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Line
              type="monotone"
              dataKey="percentage"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Current:</span>
          <span className="ml-2 font-mono text-primary">
            {(chartData[chartData.length - 1]?.percentage || 65).toFixed(1)}%
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">24h High:</span>
          <span className="ml-2 font-mono text-success">
            {Math.max(...chartData.map(d => d.percentage)).toFixed(1)}%
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">24h Low:</span>
          <span className="ml-2 font-mono text-error">
            {Math.min(...chartData.map(d => d.percentage)).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceChart;