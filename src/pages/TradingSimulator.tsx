import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { TrendingUp, TrendingDown, Bot, Eye, DollarSign, Timer } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import SimpleBuyModal from "@/components/SimpleBuyModal";
import AgentPortfolioChart from "@/components/AgentPortfolioChart";
import PortfolioHistory from "@/components/PortfolioHistory";

interface Agent {
  id: string;
  name: string;
  pnl: number;
  pnlPercent: number;
  status: "Active" | "Liquidated" | "Stopped";
  portfolio: number;
  winRate: number;
  volume: number;
  strategy: string;
  positions: {
    BTC: { amount: number; pnl: number };
    SOL: { amount: number; pnl: number };
    ETH: { amount: number; pnl: number };
  };
}

const agents: Agent[] = [
  {
    id: "1",
    name: "QuantumTrader AI",
    pnl: 2850.75,
    pnlPercent: 2.85,
    status: "Active",
    portfolio: 100000,
    winRate: 72.3,
    volume: 285430.50,
    strategy: "Technical Analysis + Mean Reversion (5x Leverage)",
    positions: {
      BTC: { amount: 35000, pnl: 1205.30 },
      SOL: { amount: 30000, pnl: 890.45 },
      ETH: { amount: 35000, pnl: 755.00 }
    }
  },
  {
    id: "2", 
    name: "ArbitrageHunter Pro",
    pnl: 1456.20,
    pnlPercent: 1.46,
    status: "Active",
    portfolio: 100000,
    winRate: 68.7,
    volume: 412350.75,
    strategy: "Cross-Exchange Arbitrage (3x Leverage)",
    positions: {
      BTC: { amount: 40000, pnl: 680.15 },
      SOL: { amount: 25000, pnl: 456.80 },
      ETH: { amount: 35000, pnl: 319.25 }
    }
  },
  {
    id: "3",
    name: "TrendFollower Alpha",
    pnl: 850.40,
    pnlPercent: 0.85,
    status: "Active", 
    portfolio: 100000,
    winRate: 64.2,
    volume: 195680.30,
    strategy: "Momentum & Trend Following (10x Leverage)",
    positions: {
      BTC: { amount: 45000, pnl: 425.60 },
      SOL: { amount: 20000, pnl: 180.25 },
      ETH: { amount: 35000, pnl: 244.55 }
    }
  },
  {
    id: "4",
    name: "RiskParity Bot",
    pnl: -320.85,
    pnlPercent: -0.32,
    status: "Active",
    portfolio: 100000,
    winRate: 58.9,
    volume: 156780.90,
    strategy: "Risk Parity & Volatility Targeting (2x Leverage)",
    positions: {
      BTC: { amount: 33333, pnl: -145.20 },
      SOL: { amount: 33333, pnl: -85.65 },
      ETH: { amount: 33334, pnl: -90.00 }
    }
  },
  {
    id: "5",
    name: "DeepLearning Trader",
    pnl: -890.50,
    pnlPercent: -0.89,
    status: "Active",
    portfolio: 100000,
    winRate: 55.4,
    volume: 234560.40,
    strategy: "Neural Networks & Pattern Recognition (8x Leverage)",
    positions: {
      BTC: { amount: 42000, pnl: -425.30 },
      SOL: { amount: 28000, pnl: -265.90 },
      ETH: { amount: 30000, pnl: -199.30 }
    }
  }
];

// Mock price data for markets
const btcPriceData = [
  { time: "18:00", price: 86750, volume: 45 },
  { time: "19:00", price: 86250, volume: 120 },
  { time: "20:00", price: 87500, volume: 85 },
  { time: "21:00", price: 86800, volume: 95 },
  { time: "22:00", price: 87200, volume: 110 },
  { time: "23:00", price: 86900, volume: 75 },
  { time: "00:00", price: 87350, volume: 90 },
  { time: "01:00", price: 87516, volume: 65 }
];

const ethPriceData = [
  { time: "18:00", price: 3245, volume: 1200 },
  { time: "19:00", price: 3189, volume: 1580 },
  { time: "20:00", price: 3298, volume: 980 },
  { time: "21:00", price: 3267, volume: 1100 },
  { time: "22:00", price: 3312, volume: 1350 },
  { time: "23:00", price: 3289, volume: 890 },
  { time: "00:00", price: 3325, volume: 1020 },
  { time: "01:00", price: 3341, volume: 750 }
];

const solPriceData = [
  { time: "18:00", price: 187.45, volume: 2800 },
  { time: "19:00", price: 184.22, volume: 3200 },
  { time: "20:00", price: 191.80, volume: 2100 },
  { time: "21:00", price: 188.95, volume: 2600 },
  { time: "22:00", price: 193.25, volume: 2950 },
  { time: "23:00", price: 190.10, volume: 2200 },
  { time: "00:00", price: 194.60, volume: 2400 },
  { time: "01:00", price: 196.75, volume: 1850 }
];

// XRP Price Data
const xrpPriceData = [
  { time: "18:00", price: 0.62, volume: 15000 },
  { time: "19:00", price: 0.61, volume: 18000 },
  { time: "20:00", price: 0.64, volume: 12000 },
  { time: "21:00", price: 0.63, volume: 14000 },
  { time: "22:00", price: 0.65, volume: 16000 },
  { time: "23:00", price: 0.63, volume: 11000 },
  { time: "00:00", price: 0.66, volume: 13000 },
  { time: "01:00", price: 0.67, volume: 9500 }
];

// BNB Price Data
const bnbPriceData = [
  { time: "18:00", price: 298, volume: 5000 },
  { time: "19:00", price: 295, volume: 6200 },
  { time: "20:00", price: 305, volume: 4100 },
  { time: "21:00", price: 302, volume: 5600 },
  { time: "22:00", price: 308, volume: 5950 },
  { time: "23:00", price: 304, volume: 4200 },
  { time: "00:00", price: 311, volume: 4800 },
  { time: "01:00", price: 314, volume: 3850 }
];

const markets = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 87516.52,
    change: 39.03,
    changePercent: 0.045,
    data: btcPriceData
  },
  {
    symbol: "ETH", 
    name: "Ethereum",
    price: 3341.28,
    change: 96.28,
    changePercent: 2.97,
    data: ethPriceData
  },
  {
    symbol: "SOL",
    name: "Solana", 
    price: 196.75,
    change: 9.30,
    changePercent: 4.96,
    data: solPriceData
  },
  {
    symbol: "XRP",
    name: "XRP",
    price: 0.67,
    change: 0.05,
    changePercent: 8.06,
    data: xrpPriceData
  },
  {
    symbol: "BNB",
    name: "BNB",
    price: 314.25,
    change: 16.25,
    changePercent: 5.45,
    data: bnbPriceData
  }
];

const TradingSimulator = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedAgentForBetting, setSelectedAgentForBetting] = useState<Agent | null>(agents[0]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500";
      case "Liquidated": return "bg-red-500";
      case "Stopped": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getPnLColor = (pnl: number) => {
    return pnl >= 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="w-full max-w-[1424px] mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Agent Trading Arena</h1>
        <p className="text-muted-foreground text-lg">
          Watch AI agents trade across BTC, SOL, and ETH markets. Each agent manages a $100,000 portfolio.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Main Content - Left Side */}
        <div className="flex-1">
          {/* Portfolio Chart */}
          <div className="mb-8">
            <AgentPortfolioChart />
          </div>

          {/* Agent Performance */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Agent Performance</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Timer className="w-4 h-4" />
                Trading session: 6h 24m remaining
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agents.map((agent, index) => (
                  <div 
                    key={agent.id}
                    className={cn(
                      "flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer",
                      selectedAgent?.id === agent.id && "bg-accent"
                    )}
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-bold text-muted-foreground">
                        #{index + 1}
                      </div>
                      <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-primary" />
                        <span className="font-medium">{agent.name}</span>
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", getStatusColor(agent.status))}
                        >
                          {agent.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className={cn("text-lg font-bold", getPnLColor(agent.pnl))}>
                          {agent.pnl >= 0 ? '+' : ''}${agent.pnl.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {agent.pnlPercent >= 0 ? '+' : ''}{agent.pnlPercent}%
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-medium">{agent.winRate}%</div>
                        <div className="text-xs text-muted-foreground">Win Rate</div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-medium">${agent.portfolio.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Portfolio</div>
                      </div>

                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              Strategy
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{agent.name} - Strategy & Positions</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Trading Strategy</h4>
                                <p className="text-muted-foreground">{agent.strategy}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Current Positions</h4>
                                <div className="grid grid-cols-3 gap-4">
                                  {Object.entries(agent.positions).map(([asset, position]) => (
                                    <div key={asset} className="p-3 border border-border rounded-lg">
                                      <div className="font-medium">{asset}</div>
                                      <div className="text-sm text-muted-foreground">
                                        ${position.amount.toLocaleString()}
                                      </div>
                                      <div className={cn(
                                        "text-sm font-medium",
                                        getPnLColor(position.pnl)
                                      )}>
                                        {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAgentForBetting(agent);
                          }}
                        >
                          <DollarSign className="w-4 h-4 mr-1" />
                          Bet on Agent
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Agent Details - Graph and Resolution */}
          {selectedAgent && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{selectedAgent.name} - Market Price History</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="graph" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="graph">Graph</TabsTrigger>
                    <TabsTrigger value="resolution">Resolution</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="graph" className="mt-6">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={btcPriceData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="time" className="text-muted-foreground" />
                          <YAxis className="text-muted-foreground" />
                          <Tooltip />
                          <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="resolution" className="mt-6">
                    <div className="text-center py-8">
                      <h3 className="text-lg font-semibold mb-2">Market Resolution</h3>
                      <p className="text-muted-foreground">
                        This agent's performance will be resolved based on portfolio growth over the trading session.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Market Price Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8">
            {markets.map((market) => (
              <Card key={market.symbol}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{market.name}</CardTitle>
                    <div className="text-right">
                       <div className="text-xl font-bold">
                         {market.symbol === 'XRP' ? `$${market.price.toFixed(2)}` : `$${market.price.toLocaleString()}`}
                       </div>
                      <div className={cn(
                        "flex items-center gap-1 text-sm font-medium",
                        market.changePercent >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                         {market.changePercent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                         {market.changePercent >= 0 ? '+' : ''}{market.symbol === 'XRP' ? market.change.toFixed(2) : market.change} ({market.changePercent}%)
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={market.data}>
                        <defs>
                          <linearGradient id={`gradient-${market.symbol}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis 
                          dataKey="time" 
                          className="text-muted-foreground"
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis 
                          domain={['dataMin - 50', 'dataMax + 50']}
                          className="text-muted-foreground"
                          tick={{ fontSize: 10 }}
                          tickFormatter={(value) => market.symbol === 'XRP' ? `$${value.toFixed(2)}` : `$${value.toLocaleString()}`}
                        />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                                  <p className="text-sm font-medium">{label}</p>
                                    <p className="text-sm text-primary">
                                      {market.symbol}: {market.symbol === 'XRP' ? `$${(payload[0].value as number)?.toFixed(2)}` : `$${(payload[0].value as number)?.toLocaleString()}`}
                                    </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          fill={`url(#gradient-${market.symbol})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Portfolio History Section */}
          <div className="mb-8">
            <PortfolioHistory />
          </div>
        </div>

        {/* Modal - Always visible on the right */}
        <div className="w-80 flex-shrink-0">
          {selectedAgentForBetting && (
            <SimpleBuyModal
              agentName={selectedAgentForBetting.name}
              price={75}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingSimulator;