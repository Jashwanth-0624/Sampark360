import React, { useState, useEffect } from 'react';
import { IndianRupee } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/Components/ui/card.jsx";
import { FundTransaction } from '@/Entities/FundTransaction';
import { Skeleton } from '@/Components/ui/skeleton.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table.jsx";
import { Badge } from "@/Components/ui/badge.jsx";
import { format } from 'date-fns';
import ScheduleReleaseDialog from '@/components/fund/ScheduleReleaseDialog';

export default function FundFlow() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const data = await FundTransaction.list("-transaction_date");
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      "Released": "!bg-green-100 !text-green-800",
      "Pending": "!bg-orange-100 !text-orange-800",
      "Rejected": "!bg-red-100 !text-red-800",
      "Approved": "!bg-blue-100 !text-blue-800",
      "On Hold": "!bg-yellow-100 !text-yellow-800"
    };
    return colors[status] || "!bg-gray-100 !text-gray-800";
  };
  
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <IndianRupee className="w-8 h-8 text-orange-500" />
          Fund Flow Ledger
        </h1>
        <ScheduleReleaseDialog onSuccess={fetchData} />
      </div>
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Track all fund releases, approvals, and reconciliation status.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={6}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      <IndianRupee className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="font-semibold">No fund transactions found.</p>
                      <p className="text-sm">Start by scheduling a new release to see transactions here.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map(tx => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-medium">{tx.project_title}</TableCell>
                      <TableCell>{format(new Date(tx.transaction_date), "dd MMM, yyyy")}</TableCell>
                      <TableCell><Badge className={getStatusColor(tx.status)}>{tx.status}</Badge></TableCell>
                      <TableCell>{tx.from_entity}</TableCell>
                      <TableCell>{tx.to_entity}</TableCell>
                      <TableCell className="text-right font-mono">₹{tx.amount?.toLocaleString('en-IN')}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}