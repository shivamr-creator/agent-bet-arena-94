import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Trade {
  timestamp: string;
  asset: string;
  direction: "Long" | "Short";
  leverage: string;
  entryPrice: string;
  exitPrice: string;
  positionSize: string;
  marginUsed: string;
  pnl: number;
  status: "Closed" | "Open" | "Liquidated";
  duration: string;
}

const agents = ["Agent Alpha", "Agent Beta", "Agent Gamma", "Agent Delta", "Agent Epsilon"];

const mockTrades: Record<string, Trade[]> = {
  "Agent Alpha": [
    {
      timestamp: "2025-07-29 14:32",
      asset: "BTC",
      direction: "Long",
      leverage: "5x",
      entryPrice: "$58,000",
      exitPrice: "$59,500",
      positionSize: "$20,000",
      marginUsed: "$4,000",
      pnl: 1500,
      status: "Closed",
      duration: "1h 23m"
    },
    {
      timestamp: "2025-07-29 13:10",
      asset: "ETH",
      direction: "Short",
      leverage: "3x",
      entryPrice: "$3,400",
      exitPrice: "-",
      positionSize: "$15,000",
      marginUsed: "$5,000",
      pnl: 0,
      status: "Open",
      duration: "-"
    },
    {
      timestamp: "2025-07-29 12:00",
      asset: "SOL",
      direction: "Long",
      leverage: "10x",
      entryPrice: "$120",
      exitPrice: "$110",
      positionSize: "$10,000",
      marginUsed: "$1,000",
      pnl: -1000,
      status: "Liquidated",
      duration: "45m"
    }
  ],
  "Agent Beta": [
    {
      timestamp: "2025-07-29 15:45",
      asset: "BTC",
      direction: "Short",
      leverage: "2x",
      entryPrice: "$60,000",
      exitPrice: "$58,200",
      positionSize: "$25,000",
      marginUsed: "$12,500",
      pnl: 2250,
      status: "Closed",
      duration: "2h 15m"
    },
    {
      timestamp: "2025-07-29 14:20",
      asset: "ETH",
      direction: "Long",
      leverage: "4x",
      entryPrice: "$3,350",
      exitPrice: "-",
      positionSize: "$18,000",
      marginUsed: "$4,500",
      pnl: 0,
      status: "Open",
      duration: "-"
    }
  ],
  "Agent Gamma": [
    {
      timestamp: "2025-07-29 16:10",
      asset: "BTC",
      direction: "Long",
      leverage: "3x",
      entryPrice: "$59,200",
      exitPrice: "$61,000",
      positionSize: "$30,000",
      marginUsed: "$10,000",
      pnl: 1800,
      status: "Closed",
      duration: "1h 50m"
    },
    {
      timestamp: "2025-07-29 15:00",
      asset: "SOL",
      direction: "Short",
      leverage: "8x",
      entryPrice: "$125",
      exitPrice: "$115",
      positionSize: "$16,000",
      marginUsed: "$2,000",
      pnl: 1280,
      status: "Closed",
      duration: "35m"
    }
  ],
  "Agent Delta": [
    {
      timestamp: "2025-07-29 17:30",
      asset: "ETH",
      direction: "Long",
      leverage: "6x",
      entryPrice: "$3,300",
      exitPrice: "$3,450",
      positionSize: "$22,000",
      marginUsed: "$3,667",
      pnl: 2000,
      status: "Closed",
      duration: "1h 10m"
    },
    {
      timestamp: "2025-07-29 16:45",
      asset: "BTC",
      direction: "Short",
      leverage: "4x",
      entryPrice: "$60,500",
      exitPrice: "-",
      positionSize: "$28,000",
      marginUsed: "$7,000",
      pnl: 0,
      status: "Open",
      duration: "-"
    }
  ],
  "Agent Epsilon": [
    {
      timestamp: "2025-07-29 18:00",
      asset: "SOL",
      direction: "Long",
      leverage: "12x",
      entryPrice: "$118",
      exitPrice: "$122",
      positionSize: "$12,000",
      marginUsed: "$1,000",
      pnl: 400,
      status: "Closed",
      duration: "25m"
    },
    {
      timestamp: "2025-07-29 17:15",
      asset: "ETH",
      direction: "Short",
      leverage: "5x",
      entryPrice: "$3,380",
      exitPrice: "$3,420",
      positionSize: "$20,000",
      marginUsed: "$4,000",
      pnl: -800,
      status: "Liquidated",
      duration: "20m"
    }
  ]
};

const TradeHistory = () => {
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Closed": return "bg-muted text-muted-foreground";
      case "Open": return "bg-success text-success-foreground";
      case "Liquidated": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPnlColor = (pnl: number) => {
    if (pnl > 0) return "text-success";
    if (pnl < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  const formatPnl = (pnl: number) => {
    if (pnl === 0) return "-";
    return pnl > 0 ? `+$${pnl.toLocaleString()}` : `-$${Math.abs(pnl).toLocaleString()}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Trade History</CardTitle>
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {agents.map((agent) => (
                <SelectItem key={agent} value={agent}>
                  {agent}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Leverage</TableHead>
                <TableHead>Entry Price</TableHead>
                <TableHead>Exit Price</TableHead>
                <TableHead>Position Size</TableHead>
                <TableHead>Margin Used</TableHead>
                <TableHead>PnL (USDC)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTrades[selectedAgent]?.map((trade, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-sm">{trade.timestamp}</TableCell>
                  <TableCell className="font-medium">{trade.asset}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={trade.direction === "Long" ? "default" : "secondary"}
                      className={trade.direction === "Long" ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}
                    >
                      <span className="flex items-center gap-1">
                        {trade.direction === "Long" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {trade.direction}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>{trade.leverage}</TableCell>
                  <TableCell className="font-mono">{trade.entryPrice}</TableCell>
                  <TableCell className="font-mono">{trade.exitPrice}</TableCell>
                  <TableCell className="font-mono">{trade.positionSize}</TableCell>
                  <TableCell className="font-mono">{trade.marginUsed}</TableCell>
                  <TableCell className={`font-mono font-semibold ${getPnlColor(trade.pnl)}`}>
                    {formatPnl(trade.pnl)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(trade.status)}>
                      {trade.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{trade.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradeHistory;