import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OrderBookProps {
  yesPrice: number;
  noPrice: number;
}

const OrderBook = ({ yesPrice, noPrice }: OrderBookProps) => {
  // Generate realistic orderbook data
  const generateOrders = (basePrice: number, side: 'yes' | 'no') => {
    const orders = [];
    const priceStep = side === 'yes' ? -0.01 : 0.01;
    
    for (let i = 0; i < 8; i++) {
      const price = Math.max(0.01, Math.min(0.99, basePrice + (priceStep * i)));
      const volume = Math.floor(Math.random() * 5000) + 500;
      orders.push({
        price: price.toFixed(2),
        percentage: (price * 100).toFixed(1),
        volume: volume.toLocaleString()
      });
    }
    return orders;
  };

  const yesOrders = generateOrders(yesPrice, 'yes');
  const noOrders = generateOrders(noPrice, 'no');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Order Book</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Yes Orders */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-success">YES Orders</h4>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-xs">Price</TableHead>
                <TableHead className="text-xs">%</TableHead>
                <TableHead className="text-xs">Volume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {yesOrders.map((order, i) => (
                <TableRow key={i} className="border-border hover:bg-accent/50">
                  <TableCell className="text-xs font-mono text-success">{order.price}¢</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{order.percentage}%</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{order.volume}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* No Orders */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-error">NO Orders</h4>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-xs">Price</TableHead>
                <TableHead className="text-xs">%</TableHead>
                <TableHead className="text-xs">Volume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {noOrders.map((order, i) => (
                <TableRow key={i} className="border-border hover:bg-accent/50">
                  <TableCell className="text-xs font-mono text-error">{order.price}¢</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{order.percentage}%</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{order.volume}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;