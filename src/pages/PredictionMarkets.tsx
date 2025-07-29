import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, DollarSign, BarChart3, BookOpen, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import OrderBook from "@/components/OrderBook";
import PriceChart from "@/components/PriceChart";
import TradingModal from "@/components/TradingModal";

interface UnifiedMarket {
  id: string;
  question: string;
  status: "Open" | "Locked" | "Resolved";
  timeLeft: string;
  yesPrice: number; // in cents
  noPrice: number; // in cents
  volume: number;
  participants: number;
  category: string;
  agentName?: string; // For multi-agent markets
}

// Convert all markets to unified format
const allMarkets: UnifiedMarket[] = [
  // Binary markets
  {
    id: "1",
    question: "Will Agent Alpha finish in Top 3?",
    status: "Open",
    timeLeft: "2h 34m",
    yesPrice: 65,
    noPrice: 35,
    volume: 3400,
    participants: 127,
    category: "Performance"
  },
  {
    id: "2", 
    question: "Will Agent Beta get liquidated?",
    status: "Open",
    timeLeft: "5h 12m",
    yesPrice: 23,
    noPrice: 77,
    volume: 1850,
    participants: 89,
    category: "Risk"
  },
  {
    id: "3",
    question: "Will Agent Gamma return over 10%?",
    status: "Open", 
    timeLeft: "1h 45m",
    yesPrice: 42,
    noPrice: 58,
    volume: 2200,
    participants: 156,
    category: "Returns"
  },
  // Multi-agent markets converted to individual options
  {
    id: "multi-1-alpha",
    question: "Which agents will finish in Top 3?",
    status: "Open",
    timeLeft: "3h 15m",
    yesPrice: 45,
    noPrice: 55,
    volume: 2100,
    participants: 89,
    category: "Performance",
    agentName: "Agent Alpha"
  },
  {
    id: "multi-1-beta",
    question: "Which agents will finish in Top 3?",
    status: "Open",
    timeLeft: "3h 15m",
    yesPrice: 32,
    noPrice: 68,
    volume: 1800,
    participants: 89,
    category: "Performance",
    agentName: "Agent Beta"
  },
  {
    id: "multi-1-gamma",
    question: "Which agents will finish in Top 3?",
    status: "Open",
    timeLeft: "3h 15m",
    yesPrice: 28,
    noPrice: 72,
    volume: 1600,
    participants: 89,
    category: "Performance",
    agentName: "Agent Gamma"
  },
  {
    id: "multi-1-delta",
    question: "Which agents will finish in Top 3?",
    status: "Open",
    timeLeft: "3h 15m",
    yesPrice: 18,
    noPrice: 82,
    volume: 1200,
    participants: 89,
    category: "Performance",
    agentName: "Agent Delta"
  },
  {
    id: "multi-1-epsilon",
    question: "Which agents will finish in Top 3?",
    status: "Open",
    timeLeft: "3h 15m",
    yesPrice: 15,
    noPrice: 85,
    volume: 900,
    participants: 89,
    category: "Performance",
    agentName: "Agent Epsilon"
  },
  {
    id: "multi-2-alpha",
    question: "Who finishes with the highest PnL?",
    status: "Open",
    timeLeft: "4h 22m",
    yesPrice: 28,
    noPrice: 72,
    volume: 1800,
    participants: 156,
    category: "Returns",
    agentName: "Agent Alpha"
  },
  {
    id: "multi-2-beta",
    question: "Who finishes with the highest PnL?",
    status: "Open",
    timeLeft: "4h 22m",
    yesPrice: 24,
    noPrice: 76,
    volume: 1500,
    participants: 156,
    category: "Returns",
    agentName: "Agent Beta"
  },
  {
    id: "multi-2-gamma",
    question: "Who finishes with the highest PnL?",
    status: "Open",
    timeLeft: "4h 22m",
    yesPrice: 22,
    noPrice: 78,
    volume: 1400,
    participants: 156,
    category: "Returns",
    agentName: "Agent Gamma"
  },
  {
    id: "multi-2-delta",
    question: "Who finishes with the highest PnL?",
    status: "Open",
    timeLeft: "4h 22m",
    yesPrice: 20,
    noPrice: 80,
    volume: 1300,
    participants: 156,
    category: "Returns",
    agentName: "Agent Delta"
  },
  {
    id: "multi-2-epsilon",
    question: "Who finishes with the highest PnL?",
    status: "Open",
    timeLeft: "4h 22m",
    yesPrice: 16,
    noPrice: 84,
    volume: 1100,
    participants: 156,
    category: "Returns",
    agentName: "Agent Epsilon"
  }
];

const PredictionMarkets = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedMarket, setSelectedMarket] = useState<UnifiedMarket | null>(null);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [buyModalData, setBuyModalData] = useState<{
    market: UnifiedMarket;
    type: "yes" | "no";
  } | null>(null);
  
  // Remove category filter as requested - show all markets at once
  const filteredMarkets = allMarkets;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-success";
      case "Locked": return "bg-yellow-500";
      case "Resolved": return "bg-muted";
      default: return "bg-muted";
    }
  };

  const handleBuyClick = (market: UnifiedMarket, type: "yes" | "no", e: React.MouseEvent) => {
    e.stopPropagation();
    setBuyModalData({ market, type });
    setBuyModalOpen(true);
  };

  if (selectedMarket) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => setSelectedMarket(null)}
          className="mb-6"
        >
          ← Back to Markets
        </Button>
        
        {/* Market Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{selectedMarket.question}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>${selectedMarket.volume.toLocaleString()} Vol.</span>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {selectedMarket.timeLeft}
            </div>
          </div>
        </div>

        {/* Market Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Section - Chart and OrderBook */}
          <div className="lg:col-span-3 space-y-6">
            {/* Outcome Section */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{selectedMarket.agentName || "OUTCOME"}</h3>
                    <div className="text-xs text-muted-foreground">${(selectedMarket.volume / 1000).toFixed(0)}K Vol.</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{selectedMarket.yesPrice.toFixed(0)}%</div>
                    <div className="text-xs text-success">+2%</div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-success hover:bg-success/90 text-success-foreground"
                      onClick={(e) => handleBuyClick(selectedMarket, "yes", e)}
                    >
                      Buy Yes {selectedMarket.yesPrice.toFixed(0)}¢
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={(e) => handleBuyClick(selectedMarket, "no", e)}
                    >
                      Buy No {selectedMarket.noPrice.toFixed(0)}¢
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for OrderBook, Graph, Resolution */}
            <Tabs defaultValue="orderbook" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="orderbook">Order Book</TabsTrigger>
                <TabsTrigger value="graph">Graph</TabsTrigger>
                <TabsTrigger value="resolution">Resolution</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orderbook" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-primary">{selectedMarket.yesPrice.toFixed(0)}% chance</h3>
                      <div className="text-sm text-error">▼42%</div>
                    </div>
                    <OrderBook yesPrice={selectedMarket.yesPrice / 100} noPrice={selectedMarket.noPrice / 100} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="graph" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <PriceChart title="Market Price" />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="resolution" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">Resolution Details</h3>
                      <p className="text-muted-foreground">This market will be resolved based on official announcements and verified sources.</p>
                      <div className="mt-4 text-sm">
                        <div className="text-muted-foreground">Resolution Source:</div>
                        <div className="font-medium">Official government announcements</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Section - Trading Panel (matches reference design) */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{selectedMarket.agentName || "Israel"}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="default">Buy</Button>
                    <Button size="sm" variant="outline">Sell</Button>
                    <div className="ml-auto">
                      <Button size="sm" variant="outline">Market ▼</Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      className="bg-success hover:bg-success/90 text-success-foreground"
                      onClick={(e) => handleBuyClick(selectedMarket, "yes", e)}
                    >
                      Yes {selectedMarket.yesPrice.toFixed(0)}¢
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={(e) => handleBuyClick(selectedMarket, "no", e)}
                    >
                      No {selectedMarket.noPrice.toFixed(0)}¢
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm text-muted-foreground mb-2">Market Stats</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Volume</span>
                        <span className="font-medium">${selectedMarket.volume.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Participants</span>
                        <span className="font-medium">{selectedMarket.participants}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>24h High</span>
                        <span className="font-medium text-success">72.4%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>24h Low</span>
                        <span className="font-medium text-error">58.1%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Agent Trading Prediction Markets</h1>
        <p className="text-muted-foreground text-lg">
          Bet on the performance of AI trading agents in live Bitcoin markets
        </p>
      </div>

      {/* Category Filter removed as requested */}

      {/* Unified Markets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMarkets.map((market) => (
          <Card 
            key={market.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer h-[280px] flex flex-col"
            onClick={() => setSelectedMarket(market)}
          >
            <CardHeader className="pb-3 flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className={cn("text-xs", getStatusColor(market.status))}>
                  {market.status}
                </Badge>
              </div>
              <CardTitle className="text-sm leading-tight line-clamp-2">
                {market.agentName ? `${market.agentName} - ` : ""}{market.question}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
              {/* Odds Display */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium">Market Odds</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {market.timeLeft}
                  </div>
                </div>
                <Progress value={market.yesPrice} className="h-2" />
                <div className="flex justify-between text-xs">
                  <span className="text-success font-medium">
                    Yes {market.yesPrice.toFixed(0)}%
                  </span>
                  <span className="text-error font-medium">
                    No {market.noPrice.toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  ${(market.volume / 1000).toFixed(1)}K
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {market.participants}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm" 
                  className="bg-success hover:bg-success/90 text-success-foreground text-xs h-8"
                  onClick={(e) => handleBuyClick(market, "yes", e)}
                >
                  Yes {market.yesPrice.toFixed(0)}¢
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-error text-error hover:bg-error/10 text-xs h-8"
                  onClick={(e) => handleBuyClick(market, "no", e)}
                >
                  No {market.noPrice.toFixed(0)}¢
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trading Modal */}
      {buyModalData && (
        <TradingModal
          isOpen={buyModalOpen}
          onClose={() => {
            setBuyModalOpen(false);
            setBuyModalData(null);
          }}
          marketTitle={buyModalData.market.question}
          type={buyModalData.type}
          price={buyModalData.type === "yes" ? buyModalData.market.yesPrice : buyModalData.market.noPrice}
          agentName={buyModalData.market.agentName}
        />
      )}
    </div>
  );
};

export default PredictionMarkets;