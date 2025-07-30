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
    
    // Base prices for different tokens
    const basePrices = {
      'BTC': 60000,
      'ETH': 3250,
      'SOL': 110,
      'XRP': 0.65,
      'BNB': 300
    };
    
    const basePrice = basePrices[title as keyof typeof basePrices] || 0.65;
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const variation = (Math.random() - 0.5) * 0.1;
      const price = Math.max(basePrice * 0.8, Math.min(basePrice * 1.2, basePrice + (basePrice * variation)));
      
      dataPoints.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        price: price,
        percentage: title === 'XRP' ? price * 100 : ((price / basePrice) * 100) // XRP shows as cents, others as percentage
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
              domain={['dataMin - 5', 'dataMax + 5']}
              tickFormatter={(value) => title === 'XRP' ? `${value.toFixed(1)}¢` : `$${value.toFixed(0)}`}
            />
            <Line
              type="monotone"
              dataKey={title === 'XRP' ? "percentage" : "price"}
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
            {title === 'XRP' 
              ? `${(chartData[chartData.length - 1]?.percentage || 65).toFixed(1)}¢`
              : `$${(chartData[chartData.length - 1]?.price || 65).toFixed(0)}`
            }
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">24h High:</span>
          <span className="ml-2 font-mono text-success">
            {title === 'XRP' 
              ? `${Math.max(...chartData.map(d => d.percentage)).toFixed(1)}¢`
              : `$${Math.max(...chartData.map(d => d.price)).toFixed(0)}`
            }
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">24h Low:</span>
          <span className="ml-2 font-mono text-error">
            {title === 'XRP' 
              ? `${Math.min(...chartData.map(d => d.percentage)).toFixed(1)}¢`
              : `$${Math.min(...chartData.map(d => d.price)).toFixed(0)}`
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceChart;