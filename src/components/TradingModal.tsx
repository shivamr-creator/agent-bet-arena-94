import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketTitle: string;
  type: "yes" | "no";
  price: number; // in cents
  agentName?: string;
}

const TradingModal = ({ isOpen, onClose, marketTitle, type, price, agentName }: TradingModalProps) => {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState<string>("70");
  const [selectedType, setSelectedType] = useState<"yes" | "no">(type);
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [limitPrice, setLimitPrice] = useState<string>(price.toString());
  const [expirationDate, setExpirationDate] = useState<Date>();
  const [expirationTime, setExpirationTime] = useState<string>("10:04");
  const [showExpiration, setShowExpiration] = useState(false);

  const calculateReceiveAmount = (): number => {
    const numericAmount = parseFloat(amount) || 0;
    if (orderType === "market") {
      const currentPrice = selectedType === "yes" ? price : (100 - price);
      return numericAmount / currentPrice * 100;
    } else {
      const limitPriceValue = parseFloat(limitPrice) || 0;
      const effectivePrice = selectedType === "yes" ? limitPriceValue : (100 - limitPriceValue);
      return numericAmount / effectivePrice * 100;
    }
  };

  const getTotalCost = (): number => {
    if (activeTab === "sell") {
      const numericAmount = parseFloat(amount) || 0;
      const currentPrice = selectedType === "yes" ? price : (100 - price);
      return numericAmount * currentPrice / 100;
    }
    return parseFloat(amount) || 0;
  };

  const handleTrade = () => {
    console.log(`${activeTab === "buy" ? "Buying" : "Selling"} ${selectedType} for ${amount} shares at ${orderType === "limit" ? limitPrice + "¢" : "market price"}`);
    onClose();
  };

  const adjustShares = (delta: number) => {
    const current = parseFloat(amount) || 0;
    setAmount(Math.max(0, current + delta).toString());
  };

  const setSharesPercentage = (percentage: number) => {
    const maxShares = 1000; // Assuming max shares available
    setAmount((maxShares * percentage / 100).toString());
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
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "buy" | "sell")}>
            <div className="flex items-center justify-between">
              <TabsList className="grid w-32 grid-cols-2">
                <TabsTrigger value="buy">Buy</TabsTrigger>
                <TabsTrigger value="sell">Sell</TabsTrigger>
              </TabsList>
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

            <TabsContent value="buy" className="space-y-4">
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

              {orderType === "limit" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="limitPrice">Limit Price</Label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setLimitPrice((prev) => Math.max(1, parseInt(prev) - 1).toString())}>
                        -
                      </Button>
                      <div className="relative flex-1">
                        <Input
                          id="limitPrice"
                          value={limitPrice}
                          onChange={(e) => setLimitPrice(e.target.value)}
                          className="text-center text-lg font-semibold"
                          placeholder="0"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">¢</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setLimitPrice((prev) => Math.min(99, parseInt(prev) + 1).toString())}>
                        +
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setShowExpiration(!showExpiration)}
                    >
                      Set Expiration
                    </Button>
                    {showExpiration && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal mt-2"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {expirationDate ? format(expirationDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={expirationDate}
                            onSelect={setExpirationDate}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                          <div className="p-3 border-t">
                            <Label htmlFor="time">Time</Label>
                            <Input
                              id="time"
                              type="time"
                              value={expirationTime}
                              onChange={(e) => setExpirationTime(e.target.value)}
                              className="mt-1"
                            />
                            <Button className="w-full mt-2" onClick={() => setShowExpiration(false)}>
                              Apply
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </div>
              )}
              
              <div>
                <Label htmlFor="shares">Shares</Label>
                <Input
                  id="shares"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg font-semibold text-center"
                  placeholder="0"
                />
                <div className="text-xs text-success mt-1">70.00 matching</div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSharesPercentage(25)}>
                  25%
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSharesPercentage(50)}>
                  50%
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSharesPercentage(100)}>
                  Max
                </Button>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">You'll receive</span>
                    <span className="text-success font-semibold">▲</span>
                  </div>
                  <div className="text-2xl font-bold text-success">
                    ${calculateReceiveAmount().toFixed(2)}
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
            </TabsContent>

            <TabsContent value="sell" className="space-y-4">
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

              {orderType === "limit" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="limitPriceSell">Limit Price</Label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setLimitPrice((prev) => Math.max(1, parseInt(prev) - 1).toString())}>
                        -
                      </Button>
                      <div className="relative flex-1">
                        <Input
                          id="limitPriceSell"
                          value={limitPrice}
                          onChange={(e) => setLimitPrice(e.target.value)}
                          className="text-center text-lg font-semibold"
                          placeholder="0"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">¢</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setLimitPrice((prev) => Math.min(99, parseInt(prev) + 1).toString())}>
                        +
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setShowExpiration(!showExpiration)}
                    >
                      Set Expiration
                    </Button>
                    {showExpiration && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal mt-2"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {expirationDate ? format(expirationDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={expirationDate}
                            onSelect={setExpirationDate}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                          <div className="p-3 border-t">
                            <Label htmlFor="timeSell">Time</Label>
                            <Input
                              id="timeSell"
                              type="time"
                              value={expirationTime}
                              onChange={(e) => setExpirationTime(e.target.value)}
                              className="mt-1"
                            />
                            <Button className="w-full mt-2" onClick={() => setShowExpiration(false)}>
                              Apply
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </div>
              )}
              
              <div>
                <Label htmlFor="sharesSell">Shares</Label>
                <Input
                  id="sharesSell"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg font-semibold text-center"
                  placeholder="0"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSharesPercentage(25)}>
                  25%
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSharesPercentage(50)}>
                  50%
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSharesPercentage(100)}>
                  Max
                </Button>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">You'll receive</span>
                    <span className="text-success font-semibold">▲</span>
                  </div>
                  <div className="text-2xl font-bold text-success">
                    ${getTotalCost().toFixed(2)}
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
                Sell Order
              </Button>
            </TabsContent>
          </Tabs>

          <div className="text-xs text-muted-foreground text-center">
            By trading, you agree to the Terms of Use.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TradingModal;