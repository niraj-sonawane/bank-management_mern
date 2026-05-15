"use client";

import React, { useState, useEffect } from "react";
import HeaderBox from "@/components/HeaderBox";
import { 
  getUserLoansAction, 
  applyForLoanAction, 
  payLoanEMIAction 
} from "@/lib/actions/loan.actions";
import { getAccounts } from "@/lib/actions/bank.actions";
import { formatAmount } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

const LoansPage = ({ user }: { user: User }) => {
  const [loans, setLoans] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [loanType, setLoanType] = useState("personal");
  const [amount, setAmount] = useState("");
  const [bankAccountId, setBankAccountId] = useState("");
  const [tenure, setTenure] = useState("12");

  const fetchData = async () => {
    setIsLoading(true);
    const [loansData, accountsData] = await Promise.all([
      getUserLoansAction(),
      getAccounts({ userId: user.$id }),
    ]);
    setLoans(loansData);
    if (accountsData?.data) {
      setAccounts(accountsData.data);
      if (accountsData.data.length > 0) setBankAccountId(accountsData.data[0].id);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankAccountId || !amount) return;

    setIsSubmitting(true);
    const success = await applyForLoanAction({
      bankAccountId,
      loanType,
      amount: Number(amount),
      interestRate: 12, // Default 12% for simulation
      tenureMonths: Number(tenure),
    });

    if (success) {
      setAmount("");
      fetchData();
    }
    setIsSubmitting(false);
  };

  const handlePayEMI = async (loanId: string, emi: number) => {
    const success = await payLoanEMIAction(loanId, emi);
    if (success) {
      fetchData();
    }
  };

  if (isLoading) return <div className="flex-center h-screen"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="flex flex-col gap-8 p-8 max-w-6xl mx-auto">
      <HeaderBox 
        title="Loans & Credit"
        subtext="Apply for a new loan or manage your existing credit accounts."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Loan Application Form */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h2 className="text-18 font-bold text-gray-900 mb-4">Apply for Loan</h2>
          <form onSubmit={handleApply} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-14 font-medium text-gray-700">Loan Type</label>
              <Select value={loanType} onValueChange={setLoanType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal Loan (12%)</SelectItem>
                  <SelectItem value="home">Home Loan (8%)</SelectItem>
                  <SelectItem value="auto">Auto Loan (10%)</SelectItem>
                  <SelectItem value="education">Education Loan (7%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-14 font-medium text-gray-700">Disbursement Account</label>
              <Select value={bankAccountId} onValueChange={setBankAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.name} (₹{acc.currentBalance.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-14 font-medium text-gray-700">Amount (₹)</label>
              <Input 
                type="number" 
                placeholder="e.g. 500000" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-14 font-medium text-gray-700">Tenure (Months)</label>
              <Select value={tenure} onValueChange={setTenure}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tenure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                  <SelectItem value="24">24 Months</SelectItem>
                  <SelectItem value="36">36 Months</SelectItem>
                  <SelectItem value="60">60 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="bg-bank-gradient text-white mt-2" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin size-4 mr-2" /> : null}
              Apply for Loan
            </Button>
          </form>
        </div>

        {/* Existing Loans Table */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-18 font-bold text-gray-900 mb-4">My Loans</h2>
          {loans.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              You have no active or pending loans.
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>EMI</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map((loan) => (
                  <TableRow key={loan._id}>
                    <TableCell className="capitalize font-medium">{loan.loanType}</TableCell>
                    <TableCell>{formatAmount(loan.amount)}</TableCell>
                    <TableCell>{formatAmount(loan.emiAmount)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        loan.status === 'active' ? 'bg-green-100 text-green-700' :
                        loan.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {loan.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {loan.status === 'active' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handlePayEMI(loan._id, loan.emiAmount)}
                          className="text-xs h-7"
                        >
                          Pay EMI
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoansPage;
