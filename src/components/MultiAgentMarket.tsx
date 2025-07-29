import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, DollarSign, Users } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  yesPrice: number;
  noPrice: number;
  percentage: number;
  volume: number;
}

interface MultiAgentMarketProps {
  question: string;
  timeLeft: string;
  totalVolume: number;
  participants: number;
  agents: Agent[];
  status: "Open" | "Locked" | "Resolved";
}

const MultiAgentMarket = ({ 
  question, 
  timeLeft, 
  totalVolume, 
  participants, 
  agents, 
  status 
}: MultiAgentMarketProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-success";
      case "Locked": return "bg-yellow-500";
      case "Resolved": return "bg-muted";
      default: return "bg-muted";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-end mb-3">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeLeft}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              ${(totalVolume / 1000).toFixed(1)}K
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {participants}
            </div>
          </div>
        </div>
        <CardTitle className="text-lg leading-tight">{question}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-xs">Agent</TableHead>
              <TableHead className="text-xs">%Chance</TableHead>
              <TableHead className="text-xs">YES</TableHead>
              <TableHead className="text-xs">NO</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent) => (
              <TableRow key={agent.id} className="border-border hover:bg-accent/50">
                <TableCell className="font-medium text-sm">
                  {agent.name}
                </TableCell>
                <TableCell className="text-sm">
                  <span className="font-mono">{agent.percentage.toFixed(1)}%</span>
                </TableCell>
                <TableCell>
                  <Button 
                    size="sm" 
                    className="h-7 px-3 bg-success hover:bg-success/90 text-success-foreground text-xs"
                  >
                    {agent.yesPrice.toFixed(2)}¢
                  </Button>
                </TableCell>
                <TableCell>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-7 px-3 border-error text-error hover:bg-error/10 text-xs"
                  >
                    {agent.noPrice.toFixed(2)}¢
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="mt-4 text-xs text-muted-foreground">
          Total Volume: ${totalVolume.toLocaleString()} • {participants} participants
        </div>
      </CardContent>
    </Card>
  );
};

export default MultiAgentMarket;