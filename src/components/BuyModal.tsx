import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketTitle: string;
  type: "yes" | "no";
  price: number; // in cents
  agentName?: string;
}

const BuyModal = ({ isOpen, onClose, marketTitle, type, price, agentName }: BuyModalProps) => {
  const [amount, setAmount] = useState<string>("221");
  const [selectedType, setSelectedType] = useState<"yes" | "no">(type);
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [limitPrice, setLimitPrice] = useState<string>(price.toString());

  const calculateWinnings = (investmentAmount: number, priceInCents: number): number => {
    if (priceInCents <= 0) return 0;
    return (investmentAmount / priceInCents) * 100;
  };

  const numericAmount = parseFloat(amount) || 0;
  const currentPrice = selectedType === "yes" ? price : (100 - price);
  const potentialWinnings = calculateWinnings(numericAmount, orderType === "limit" ? parseFloat(limitPrice) : currentPrice);

  const handleTrade = () => {
    // Trading logic would go here
    console.log(`Trading ${selectedType} for ${numericAmount} at ${orderType === "limit" ? limitPrice + "¢" : "market price"}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {agentName ? `${agentName} - ` : ""}{marketTitle}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button 
                variant="default"
                size="sm"
                className="bg-success hover:bg-success/90 text-success-foreground"
              >
                Buy
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-muted-foreground"
              >
                Sell
              </Button>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">{orderType}</div>
              <Select value={orderType} onValueChange={(value) => setOrderType(value as "market" | "limit")}>
                <SelectTrigger className="w-24 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market</SelectItem>
                  <SelectItem value="limit">Limit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant={selectedType === "yes" ? "default" : "outline"}
              className={selectedType === "yes" ? "bg-success hover:bg-success/90 text-success-foreground" : "border-input"}
              onClick={() => setSelectedType("yes")}
            >
              Yes {orderType === "limit" ? `${limitPrice}¢` : `${price.toFixed(0)}¢`}
            </Button>
            <Button 
              variant={selectedType === "no" ? "destructive" : "outline"}
              className={selectedType === "no" ? "bg-destructive hover:bg-destructive/90" : "border-input"}
              onClick={() => setSelectedType("no")}
            >
              No {orderType === "limit" ? `${100 - parseInt(limitPrice)}¢` : `${(100 - price).toFixed(0)}¢`}
            </Button>
          </div>

          <div className="space-y-4">
            {orderType === "limit" && (
              <div>
                <Label htmlFor="limitPrice">Limit Price</Label>
                <div className="relative">
                  <Input
                    id="limitPrice"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    className="text-lg font-semibold"
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">¢</span>
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="amount">{orderType === "limit" ? "Shares" : "Amount"}</Label>
              <div className="relative">
                {orderType === "market" && (
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                )}
                <Input
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`text-lg font-semibold ${orderType === "market" ? "pl-8" : ""}`}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setAmount((prev) => (parseInt(prev || "0") + 1).toString())}>
                +$1
              </Button>
              <Button variant="outline" size="sm" onClick={() => setAmount((prev) => (parseInt(prev || "0") + 20).toString())}>
                +$20
              </Button>
              <Button variant="outline" size="sm" onClick={() => setAmount((prev) => (parseInt(prev || "0") + 100).toString())}>
                +$100
              </Button>
              <Button variant="outline" size="sm" onClick={() => setAmount("1000")}>
                Max
              </Button>
            </div>

            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">To win</span>
                  <span className="text-success font-semibold">▲</span>
                </div>
                <div className="text-2xl font-bold text-success">
                  ${potentialWinnings.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Avg. Price {orderType === "limit" ? limitPrice : price.toFixed(0)}¢ ⓘ
                </div>
              </CardContent>
            </Card>

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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyModal;