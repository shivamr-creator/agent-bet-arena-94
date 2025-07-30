import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PortfolioEntry {
  time: string;
  btc: { pnl: number; leverage: string };
  eth: { pnl: number; leverage: string };
  sol: { pnl: number; leverage: string };
  xrp: { pnl: number; leverage: string };
  bnb: { pnl: number; leverage: string };
}

interface PositionDetail {
  token: string;
  direction: "Long" | "Short";
  leverage: string;
  entryPrice: string;
  currentPrice: string;
  positionSize: string;
  marginUsed: string;
  pnl: number;
  status: "Open" | "Closed";
}

const portfolioData: PortfolioEntry[] = [
  {
    time: "2025-07-29 11:00",
    btc: { pnl: 800, leverage: "5x" },
    eth: { pnl: 300, leverage: "3x" },
    sol: { pnl: -500, leverage: "2x" },
    xrp: { pnl: 200, leverage: "4x" },
    bnb: { pnl: -100, leverage: "3x" }
  },
  {
    time: "2025-07-29 12:00",
    btc: { pnl: 1500, leverage: "5x" },
    eth: { pnl: 300, leverage: "3x" },
    sol: { pnl: -800, leverage: "2x" },
    xrp: { pnl: 600, leverage: "4x" },
    bnb: { pnl: 200, leverage: "3x" }
  },
  {
    time: "2025-07-29 13:00",
    btc: { pnl: 2000, leverage: "5x" },
    eth: { pnl: 1000, leverage: "3x" },
    sol: { pnl: -1000, leverage: "2x" },
    xrp: { pnl: 1428, leverage: "4x" },
    bnb: { pnl: 0, leverage: "3x" }
  }
];

const recentPositions: PositionDetail[] = [
  {
    token: "BTC",
    direction: "Long",
    leverage: "5x",
    entryPrice: "$58,000",
    currentPrice: "$60,000",
    positionSize: "$25,000",
    marginUsed: "$5,000",
    pnl: 2000,
    status: "Open"
  },
  {
    token: "ETH",
    direction: "Short",
    leverage: "3x",
    entryPrice: "$3,400",
    currentPrice: "$3,250",
    positionSize: "$15,000",
    marginUsed: "$5,000",
    pnl: 1500,
    status: "Closed"
  },
  {
    token: "SOL",
    direction: "Long",
    leverage: "2x",
    entryPrice: "$120",
    currentPrice: "$110",
    positionSize: "$10,000",
    marginUsed: "$5,000",
    pnl: -1000,
    status: "Closed"
  },
  {
    token: "XRP",
    direction: "Short",
    leverage: "4x",
    entryPrice: "$0.70",
    currentPrice: "$0.65",
    positionSize: "$20,000",
    marginUsed: "$5,000",
    pnl: 1428,
    status: "Open"
  },
  {
    token: "BNB",
    direction: "Long",
    leverage: "3x",
    entryPrice: "$300",
    currentPrice: "-",
    positionSize: "$30,000",
    marginUsed: "$10,000",
    pnl: 0,
    status: "Open"
  }
];

const PortfolioHistory = () => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set([2])); // Current hour (latest) expanded by default
  const [selectedAgent, setSelectedAgent] = useState("QuantumTrader AI");
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [manualSelectTime, setManualSelectTime] = useState<number | null>(null);

  const agents = ["QuantumTrader AI", "AlphaBot Pro", "TrendMaster", "CryptoSage", "MarketMind AI"];

  // Auto-rotation effect
  useState(() => {
    const interval = setInterval(() => {
      if (isAutoRotating && !manualSelectTime) {
        setSelectedAgent(prev => {
          const currentIndex = agents.indexOf(prev);
          const nextIndex = (currentIndex + 1) % agents.length;
          return agents[nextIndex];
        });
      } else if (manualSelectTime && Date.now() - manualSelectTime > 30000) {
        setManualSelectTime(null);
        setIsAutoRotating(true);
      }
    }, isAutoRotating ? 10000 : 1000);

    return () => clearInterval(interval);
  });

  const handleAgentSelect = (agent: string) => {
    setSelectedAgent(agent);
    setManualSelectTime(Date.now());
    setIsAutoRotating(false);
  };

  const getPnLColor = (pnl: number) => {
    return pnl >= 0 ? "text-success" : "text-destructive";
  };

  const getStatusColor = (status: string) => {
    return status === "Open" ? "bg-success" : "bg-muted";
  };

  const toggleRowExpansion = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const getPositionsForHour = (hourIndex: number) => {
    // Mock data - in real app this would filter based on the hour
    return recentPositions;
  };

  const calculateTotalPnL = (entry: PortfolioEntry) => {
    return entry.btc.pnl + entry.eth.pnl + entry.sol.pnl + entry.xrp.pnl + entry.bnb.pnl;
  };

  return (
    <div className="space-y-6">
      {/* Agent Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio History</CardTitle>
          <div className="flex gap-2 flex-wrap">
            {agents.map((agent) => (
              <Button
                key={agent}
                variant={selectedAgent === agent ? "default" : "outline"}
                size="sm"
                onClick={() => handleAgentSelect(agent)}
                className={selectedAgent === agent ? "bg-primary" : ""}
              >
                {agent}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="w-12"></TableHead>
                  <TableHead className="min-w-32">Time</TableHead>
                  <TableHead className="text-center">Total PnL</TableHead>
                  <TableHead className="text-center">BTC</TableHead>
                  <TableHead className="text-center">ETH</TableHead>
                  <TableHead className="text-center">SOL</TableHead>
                  <TableHead className="text-center">XRP</TableHead>
                  <TableHead className="text-center">BNB</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioData.slice().reverse().map((entry, reverseIndex) => {
                  const index = portfolioData.length - 1 - reverseIndex;
                  const isExpanded = expandedRows.has(index);
                  const isCurrentHour = reverseIndex === 0;
                  const totalPnL = calculateTotalPnL(entry);
                  
                  return (
                    <>
                      <TableRow 
                        key={index} 
                        className={cn(
                          "border-border cursor-pointer hover:bg-muted/50",
                          isCurrentHour && "bg-accent/20"
                        )}
                        onClick={() => !isCurrentHour && toggleRowExpansion(index)}
                      >
                        <TableCell>
                          {!isCurrentHour && (
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          {isCurrentHour && (
                            <div className="text-xs text-muted-foreground px-2">Current</div>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-sm">{entry.time}</TableCell>
                        <TableCell className="text-center">
                          <div className={cn("font-bold text-lg", getPnLColor(totalPnL))}>
                            {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className={cn("font-semibold", getPnLColor(entry.btc.pnl))}>
                            {entry.btc.pnl >= 0 ? '+' : ''}${entry.btc.pnl}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {entry.btc.leverage}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className={cn("font-semibold", getPnLColor(entry.eth.pnl))}>
                            {entry.eth.pnl >= 0 ? '+' : ''}${entry.eth.pnl}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {entry.eth.leverage}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className={cn("font-semibold", getPnLColor(entry.sol.pnl))}>
                            {entry.sol.pnl >= 0 ? '+' : ''}${entry.sol.pnl}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {entry.sol.leverage}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className={cn("font-semibold", getPnLColor(entry.xrp.pnl))}>
                            {entry.xrp.pnl >= 0 ? '+' : ''}${entry.xrp.pnl}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {entry.xrp.leverage}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className={cn("font-semibold", getPnLColor(entry.bnb.pnl))}>
                            {entry.bnb.pnl >= 0 ? '+' : ''}${entry.bnb.pnl}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {entry.bnb.leverage}
                          </div>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded Details */}
                      {(isExpanded || isCurrentHour) && (
                        <TableRow key={`details-${index}`} className="border-0">
                          <TableCell colSpan={8} className="p-0">
                            <div className="bg-muted/30 p-4 border-l-4 border-primary/20">
                              <div className="text-sm font-medium mb-3 text-muted-foreground">
                                Position Details - {entry.time}
                              </div>
                              <div className="overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="border-border">
                                      <TableHead className="h-8">Token</TableHead>
                                      <TableHead className="h-8">Direction</TableHead>
                                      <TableHead className="h-8">Leverage</TableHead>
                                      <TableHead className="h-8">Entry Price</TableHead>
                                      <TableHead className="h-8">Current/Exit Price</TableHead>
                                      <TableHead className="h-8">Position Size</TableHead>
                                      <TableHead className="h-8">Margin Used</TableHead>
                                      <TableHead className="h-8">PnL (USDC)</TableHead>
                                      <TableHead className="h-8">Status</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {getPositionsForHour(index).map((position, posIndex) => (
                                      <TableRow key={posIndex} className="border-border">
                                        <TableCell className="font-semibold py-2">{position.token}</TableCell>
                                        <TableCell className="py-2">{position.direction}</TableCell>
                                        <TableCell className="py-2">{position.leverage}</TableCell>
                                        <TableCell className="py-2">{position.entryPrice}</TableCell>
                                        <TableCell className="py-2">{position.currentPrice}</TableCell>
                                        <TableCell className="py-2">{position.positionSize}</TableCell>
                                        <TableCell className="py-2">{position.marginUsed}</TableCell>
                                        <TableCell className={cn("font-semibold py-2", getPnLColor(position.pnl))}>
                                          {position.pnl >= 0 ? '+' : ''}${position.pnl.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="py-2">
                                          <Badge className={getStatusColor(position.status)}>
                                            {position.status}
                                          </Badge>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioHistory;