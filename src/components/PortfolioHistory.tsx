import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
  const getPnLColor = (pnl: number) => {
    return pnl >= 0 ? "text-success" : "text-destructive";
  };

  const getStatusColor = (status: string) => {
    return status === "Open" ? "bg-success" : "bg-muted";
  };

  return (
    <div className="space-y-6">
      {/* Portfolio History */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="min-w-32">Time</TableHead>
                  <TableHead className="text-center">BTC</TableHead>
                  <TableHead className="text-center">ETH</TableHead>
                  <TableHead className="text-center">SOL</TableHead>
                  <TableHead className="text-center">XRP</TableHead>
                  <TableHead className="text-center">BNB</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioData.map((entry, index) => (
                  <TableRow key={index} className="border-border">
                    <TableCell className="font-mono text-sm">{entry.time}</TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className={cn("font-semibold", getPnLColor(entry.btc.pnl))}>
                          ${entry.btc.pnl.toLocaleString()} ({entry.btc.leverage})
                        </div>
                        <div className="text-xs text-muted-foreground">
                          PnL: {entry.btc.pnl >= 0 ? '+' : ''}${entry.btc.pnl}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className={cn("font-semibold", getPnLColor(entry.eth.pnl))}>
                          ${entry.eth.pnl.toLocaleString()} ({entry.eth.leverage})
                        </div>
                        <div className="text-xs text-muted-foreground">
                          PnL: {entry.eth.pnl >= 0 ? '+' : ''}${entry.eth.pnl}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className={cn("font-semibold", getPnLColor(entry.sol.pnl))}>
                          ${entry.sol.pnl.toLocaleString()} ({entry.sol.leverage})
                        </div>
                        <div className="text-xs text-muted-foreground">
                          PnL: {entry.sol.pnl >= 0 ? '+' : ''}${entry.sol.pnl}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className={cn("font-semibold", getPnLColor(entry.xrp.pnl))}>
                          ${entry.xrp.pnl.toLocaleString()} ({entry.xrp.leverage})
                        </div>
                        <div className="text-xs text-muted-foreground">
                          PnL: {entry.xrp.pnl >= 0 ? '+' : ''}${entry.xrp.pnl}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className={cn("font-semibold", getPnLColor(entry.bnb.pnl))}>
                          ${entry.bnb.pnl.toLocaleString()} ({entry.bnb.leverage})
                        </div>
                        <div className="text-xs text-muted-foreground">
                          PnL: {entry.bnb.pnl >= 0 ? '+' : ''}${entry.bnb.pnl}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Hour Details */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Hour - Position Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Token</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Leverage</TableHead>
                  <TableHead>Entry Price</TableHead>
                  <TableHead>Current/Exit Price</TableHead>
                  <TableHead>Position Size</TableHead>
                  <TableHead>Margin Used</TableHead>
                  <TableHead>PnL (USDC)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPositions.map((position, index) => (
                  <TableRow key={index} className="border-border">
                    <TableCell className="font-semibold">{position.token}</TableCell>
                    <TableCell>{position.direction}</TableCell>
                    <TableCell>{position.leverage}</TableCell>
                    <TableCell>{position.entryPrice}</TableCell>
                    <TableCell>{position.currentPrice}</TableCell>
                    <TableCell>{position.positionSize}</TableCell>
                    <TableCell>{position.marginUsed}</TableCell>
                    <TableCell className={cn("font-semibold", getPnLColor(position.pnl))}>
                      {position.pnl >= 0 ? '+' : ''}${position.pnl.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(position.status)}>
                        {position.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioHistory;