import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SimpleBuyModalProps {
  agentName: string;
  price: number; // in cents
  onAgentChange?: (agentName: string) => void;
}

const SimpleBuyModal = ({ agentName, price, onAgentChange }: SimpleBuyModalProps) => {
  const [amount, setAmount] = useState<string>("0");
  const [orderType, setOrderType] = useState<"market">("market");
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [selectedAgent, setSelectedAgent] = useState(agentName);

  const agents = ["QuantumTrader AI", "AlphaBot Pro", "TrendMaster", "CryptoSage", "MarketMind AI"];

  const handleAgentChange = (newAgent: string) => {
    setSelectedAgent(newAgent);
    onAgentChange?.(newAgent);
  };

  const calculateWinnings = (investmentAmount: number, priceInCents: number): number => {
    if (priceInCents <= 0) return 0;
    return (investmentAmount / priceInCents) * 100;
  };

  const calculateReceiveAmount = (shares: number, priceInCents: number): number => {
    return shares * (priceInCents / 100);
  };

  const numericAmount = parseFloat(amount) || 0;
  const potentialWinnings = activeTab === "buy" ? calculateWinnings(numericAmount, price) : 0;
  const receiveAmount = activeTab === "sell" ? calculateReceiveAmount(numericAmount, price) : 0;

  const handleTrade = () => {
    console.log(`Trading for ${numericAmount} at market price`);
  };

  const adjustAmount = (delta: number) => {
    const current = parseFloat(amount) || 0;
    setAmount(Math.max(0, current + delta).toString());
  };

  return (
    <Card className="w-full max-w-sm bg-card">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs font-medium">{selectedAgent.split(' ').map(n => n[0]).join('')}</span>
          </div>
          <div className="flex-1">
            <Select value={selectedAgent} onValueChange={handleAgentChange}>
              <SelectTrigger className="h-8 border-0 bg-transparent p-0 font-medium text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button 
              variant={activeTab === "buy" ? "default" : "outline"}
              size="sm"
              className={activeTab === "buy" ? "bg-success hover:bg-success/90 text-success-foreground" : "text-muted-foreground"}
              onClick={() => setActiveTab("buy")}
            >
              Buy
            </Button>
            <Button 
              variant={activeTab === "sell" ? "default" : "outline"}
              size="sm"
              className={activeTab === "sell" ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" : "text-muted-foreground"}
              onClick={() => setActiveTab("sell")}
            >
              Sell
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            variant="default"
            className="w-full bg-success hover:bg-success/90 text-success-foreground"
          >
            Yes {price.toFixed(1)}¢
          </Button>
        </div>

        <div>
          <label className="text-sm font-medium">{activeTab === "buy" ? "Amount" : "Shares"}</label>
          <div className="relative">
            {activeTab === "buy" && (
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-2xl">$</span>
            )}
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`text-2xl font-semibold text-center ${activeTab === "buy" ? "pl-8" : ""}`}
              placeholder="0"
            />
          </div>
        </div>

        {activeTab === "buy" && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => adjustAmount(1)}>
              +$1
            </Button>
            <Button variant="outline" size="sm" onClick={() => adjustAmount(20)}>
              +$20
            </Button>
            <Button variant="outline" size="sm" onClick={() => adjustAmount(100)}>
              +$100
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAmount("1000")}>
              Max
            </Button>
          </div>
        )}

        {activeTab === "sell" && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => adjustAmount(25)}>
              25%
            </Button>
            <Button variant="outline" size="sm" onClick={() => adjustAmount(50)}>
              50%
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAmount("100")}>
              Max
            </Button>
          </div>
        )}

        {activeTab === "buy" && numericAmount > 0 && (
          <Card className="bg-muted/50">
            <CardContent className="p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">To win</span>
                <span className="text-success font-semibold">▲</span>
              </div>
              <div className="text-2xl font-bold text-success">
                ${potentialWinnings.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                Avg. Price {price.toFixed(1)}¢ 
                <span className="w-3 h-3 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs">i</span>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "sell" && numericAmount > 0 && (
          <Card className="bg-muted/50">
            <CardContent className="p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">You'll receive</span>
                <span className="text-success font-semibold">▲</span>
              </div>
              <div className="text-2xl font-bold text-success">
                ${receiveAmount.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                Avg. Price {price.toFixed(1)}¢ 
                <span className="w-3 h-3 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs">i</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Button 
          onClick={handleTrade}
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
        >
          Trade
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          By trading, you agree to the Terms of Use.
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleBuyModal;