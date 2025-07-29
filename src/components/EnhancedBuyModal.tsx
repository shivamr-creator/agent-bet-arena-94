import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Minus, Plus, CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EnhancedBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketTitle: string;
  type: "yes" | "no";
  price: number; // in cents
  agentName?: string;
}

const EnhancedBuyModal = ({ isOpen, onClose, marketTitle, type, price, agentName }: EnhancedBuyModalProps) => {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [amount, setAmount] = useState<string>("221");
  const [shares, setShares] = useState<string>("221");
  const [limitPrice, setLimitPrice] = useState<string>(price.toString());
  const [setExpiration, setSetExpiration] = useState(false);
  const [expirationDate, setExpirationDate] = useState<Date>();
  const [expirationTime, setExpirationTime] = useState("06:50 PM");
  const [selectedExpiry, setSelectedExpiry] = useState("60minutes");

  const calculateWinnings = (investmentAmount: number, priceInCents: number): number => {
    if (priceInCents <= 0) return 0;
    return (investmentAmount / priceInCents) * 100;
  };

  const calculateReceiveAmount = (): number => {
    if (orderType === "limit") {
      const numericShares = parseFloat(shares) || 0;
      const limitPriceValue = parseFloat(limitPrice) || 0;
      return (numericShares * limitPriceValue) / 100;
    } else {
      const numericAmount = parseFloat(amount) || 0;
      return calculateWinnings(numericAmount, price);
    }
  };

  const getTotalCost = (): number => {
    if (orderType === "limit") {
      const numericShares = parseFloat(shares) || 0;
      const limitPriceValue = parseFloat(limitPrice) || 0;
      return (numericShares * limitPriceValue) / 100;
    } else {
      return parseFloat(amount) || 0;
    }
  };

  const handleTrade = () => {
    console.log(`Trading ${activeTab} ${type} for ${orderType === "limit" ? shares + " shares" : "$" + amount} at ${orderType === "limit" ? limitPrice + "¢" : "market price"}`);
    onClose();
  };

  const adjustShares = (delta: number) => {
    const current = parseInt(shares) || 0;
    setShares(Math.max(0, current + delta).toString());
  };

  const setSharesPercentage = (percentage: number) => {
    if (percentage === 100) {
      setShares("999");
    } else {
      const maxShares = 999;
      const targetShares = Math.floor((maxShares * percentage) / 100);
      setShares(targetShares.toString());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
              <span className="text-xs font-bold">IL</span>
            </div>
            <div>
              <DialogTitle className="text-lg text-white">
                {agentName || "Israel"}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Buy/Sell Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "buy" | "sell")}>
            <div className="flex items-center justify-between">
              <TabsList className="bg-transparent p-0">
                <TabsTrigger 
                  value="buy" 
                  className={cn(
                    "px-0 pb-2 bg-transparent border-b-2 rounded-none data-[state=active]:bg-transparent",
                    activeTab === "buy" ? "border-white text-white" : "border-transparent text-gray-400"
                  )}
                >
                  Buy
                </TabsTrigger>
                <TabsTrigger 
                  value="sell"
                  className={cn(
                    "px-0 pb-2 ml-4 bg-transparent border-b-2 rounded-none data-[state=active]:bg-transparent",
                    activeTab === "sell" ? "border-white text-white" : "border-transparent text-gray-400"
                  )}
                >
                  Sell
                </TabsTrigger>
              </TabsList>
              <div className="text-right">
                <div className="text-sm text-gray-400">
                  {orderType === "market" ? "Market" : "Limit"}
                </div>
                <Select value={orderType} onValueChange={(value) => setOrderType(value as "market" | "limit")}>
                  <SelectTrigger className="w-24 h-8 bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="market">Market</SelectItem>
                    <SelectItem value="limit">Limit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="buy" className="mt-6">
              {/* Yes/No Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button 
                  variant={type === "yes" ? "default" : "outline"}
                  className={cn(
                    "py-3",
                    type === "yes" 
                      ? "bg-green-600 hover:bg-green-700 text-white border-0" 
                      : "bg-slate-700 border-slate-600 text-gray-300 hover:bg-slate-600"
                  )}
                >
                  Yes {orderType === "limit" ? `${limitPrice}¢` : `${price}¢`}
                </Button>
                <Button 
                  variant={type === "no" ? "default" : "outline"}
                  className={cn(
                    "py-3",
                    type === "no" 
                      ? "bg-slate-600 hover:bg-slate-700 text-white border-0" 
                      : "bg-slate-700 border-slate-600 text-gray-300 hover:bg-slate-600"
                  )}
                >
                  No {orderType === "limit" ? `${100 - parseInt(limitPrice)}¢` : `${100 - price}¢`}
                </Button>
              </div>

              {orderType === "limit" && (
                <>
                  {/* Limit Price */}
                  <div className="mb-4">
                    <Label className="text-white text-sm">Limit Price</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white h-10 w-10 p-0"
                        onClick={() => setLimitPrice((prev) => Math.max(1, parseInt(prev) - 1).toString())}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        value={limitPrice}
                        onChange={(e) => setLimitPrice(e.target.value)}
                        className="text-center bg-slate-800 border-slate-600 text-white flex-1"
                      />
                      <span className="text-gray-400">¢</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white h-10 w-10 p-0"
                        onClick={() => setLimitPrice((prev) => Math.min(99, parseInt(prev) + 1).toString())}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Shares */}
                  <div className="mb-4">
                    <Label className="text-white text-sm">Shares</Label>
                    <Input
                      value={shares}
                      onChange={(e) => setShares(e.target.value)}
                      className="text-right text-2xl font-bold bg-slate-800 border-slate-600 text-white mt-2"
                    />
                    <div className="text-xs text-green-400 mt-1">50.00 matching</div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white"
                        onClick={() => adjustShares(-10)}
                      >
                        -10
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white"
                        onClick={() => adjustShares(10)}
                      >
                        +10
                      </Button>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white"
                        onClick={() => setSharesPercentage(25)}
                      >
                        25%
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white"
                        onClick={() => setSharesPercentage(50)}
                      >
                        50%
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white"
                        onClick={() => setSharesPercentage(100)}
                      >
                        Max
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {orderType === "market" && (
                <>
                  {/* Amount */}
                  <div className="mb-4">
                    <Label className="text-white text-sm">Amount</Label>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                      <Input
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-8 text-2xl font-bold bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white"
                        onClick={() => setAmount((prev) => (parseInt(prev || "0") + 1).toString())}
                      >
                        +$1
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white"
                        onClick={() => setAmount((prev) => (parseInt(prev || "0") + 20).toString())}
                      >
                        +$20
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white"
                        onClick={() => setAmount((prev) => (parseInt(prev || "0") + 100).toString())}
                      >
                        +$100
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white"
                        onClick={() => setAmount("1000")}
                      >
                        Max
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Set Expiration */}
              <div className="flex items-center justify-between mb-4">
                <Label className="text-gray-400">Set Expiration</Label>
                <Switch
                  checked={setExpiration}
                  onCheckedChange={setSetExpiration}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              {setExpiration && (
                <div className="mb-4">
                  <Select value={selectedExpiry} onValueChange={setSelectedExpiry}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="60minutes">In 60 Minutes</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>

                  {selectedExpiry === "custom" && (
                    <div className="flex gap-2 mt-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="bg-slate-800 border-slate-600 text-white flex-1"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {expirationDate ? format(expirationDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600">
                          <Calendar
                            mode="single"
                            selected={expirationDate}
                            onSelect={setExpirationDate}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <Input
                          value={expirationTime}
                          onChange={(e) => setExpirationTime(e.target.value)}
                          className="w-24 bg-slate-800 border-slate-600 text-white text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Total/You'll receive */}
              {orderType === "limit" && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Total</span>
                    <span className="text-blue-400">${getTotalCost().toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">
                    {orderType === "market" ? "To win" : "You'll receive"}
                  </span>
                  <span className="text-green-400 font-bold text-xl">
                    ${calculateReceiveAmount().toFixed(2)}
                  </span>
                </div>
                {orderType === "market" && (
                  <div className="text-xs text-gray-400 mt-1">
                    Avg. Price {price}¢ ⓘ
                  </div>
                )}
              </div>

              <Button 
                onClick={handleTrade}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                Trade
              </Button>
            </TabsContent>

            <TabsContent value="sell" className="mt-6">
              {/* Yes/No Buttons for Sell */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button 
                  variant={type === "yes" ? "default" : "outline"}
                  className={cn(
                    "py-3",
                    type === "yes" 
                      ? "bg-red-600 hover:bg-red-700 text-white border-0" 
                      : "bg-slate-700 border-slate-600 text-gray-300 hover:bg-slate-600"
                  )}
                >
                  Sell Yes {orderType === "limit" ? `${limitPrice}¢` : `${price}¢`}
                </Button>
                <Button 
                  variant={type === "no" ? "default" : "outline"}
                  className={cn(
                    "py-3",
                    type === "no" 
                      ? "bg-red-600 hover:bg-red-700 text-white border-0" 
                      : "bg-slate-700 border-slate-600 text-gray-300 hover:bg-slate-600"
                  )}
                >
                  Sell No {orderType === "limit" ? `${100 - parseInt(limitPrice)}¢` : `${100 - price}¢`}
                </Button>
              </div>

              {orderType === "limit" && (
                <>
                  {/* Limit Price for Sell */}
                  <div className="mb-4">
                    <Label className="text-white text-sm">Limit Price</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white h-10 w-10 p-0"
                        onClick={() => setLimitPrice((prev) => Math.max(1, parseInt(prev) - 1).toString())}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        value={limitPrice}
                        onChange={(e) => setLimitPrice(e.target.value)}
                        className="text-center bg-slate-800 border-slate-600 text-white flex-1"
                      />
                      <span className="text-gray-400">¢</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white h-10 w-10 p-0"
                        onClick={() => setLimitPrice((prev) => Math.min(99, parseInt(prev) + 1).toString())}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Shares for Sell */}
                  <div className="mb-4">
                    <Label className="text-white text-sm">Shares to Sell</Label>
                    <Input
                      value={shares}
                      onChange={(e) => setShares(e.target.value)}
                      className="text-right text-2xl font-bold bg-slate-800 border-slate-600 text-white mt-2"
                    />
                    <div className="text-xs text-blue-400 mt-1">100 shares available</div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white"
                        onClick={() => adjustShares(-10)}
                      >
                        -10
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white"
                        onClick={() => adjustShares(10)}
                      >
                        +10
                      </Button>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white"
                        onClick={() => setSharesPercentage(25)}
                      >
                        25%
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white"
                        onClick={() => setSharesPercentage(50)}
                      >
                        50%
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white"
                        onClick={() => setSharesPercentage(100)}
                      >
                        Max
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {orderType === "market" && (
                <>
                  {/* Shares for Market Sell */}
                  <div className="mb-4">
                    <Label className="text-white text-sm">Shares to Sell</Label>
                    <Input
                      value={shares}
                      onChange={(e) => setShares(e.target.value)}
                      className="text-2xl font-bold bg-slate-800 border-slate-600 text-white mt-2"
                    />
                    <div className="text-xs text-blue-400 mt-1">100 shares available</div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white"
                        onClick={() => adjustShares(-10)}
                      >
                        -10
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white"
                        onClick={() => adjustShares(10)}
                      >
                        +10
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white"
                        onClick={() => setSharesPercentage(100)}
                      >
                        Max
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Set Expiration for Sell */}
              <div className="flex items-center justify-between mb-4">
                <Label className="text-gray-400">Set Expiration</Label>
                <Switch
                  checked={setExpiration}
                  onCheckedChange={setSetExpiration}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              {setExpiration && (
                <div className="mb-4">
                  <Select value={selectedExpiry} onValueChange={setSelectedExpiry}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="60minutes">In 60 Minutes</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>

                  {selectedExpiry === "custom" && (
                    <div className="flex gap-2 mt-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="bg-slate-800 border-slate-600 text-white flex-1"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {expirationDate ? format(expirationDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600">
                          <Calendar
                            mode="single"
                            selected={expirationDate}
                            onSelect={setExpirationDate}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <Input
                          value={expirationTime}
                          onChange={(e) => setExpirationTime(e.target.value)}
                          className="w-24 bg-slate-800 border-slate-600 text-white text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Total/You'll receive for Sell */}
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">You'll receive</span>
                  <span className="text-green-400 font-bold text-xl">
                    ${calculateReceiveAmount().toFixed(2)}
                  </span>
                </div>
                {orderType === "market" && (
                  <div className="text-xs text-gray-400 mt-1">
                    Avg. Price {price}¢ ⓘ
                  </div>
                )}
              </div>

              <Button 
                onClick={handleTrade}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
              >
                Sell Order
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedBuyModal;