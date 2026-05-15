"use client";

import React, { useState } from 'react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "./ui/input";
import { depositFunds } from '@/lib/actions/bank.actions';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { BankDropdown } from './BankDropdown';

export const DepositModal = ({ accounts }: { accounts: Account[] }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [selectedBankId, setSelectedBankId] = useState(accounts[0]?.id || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleDeposit = async () => {
    if (!amount || !selectedBankId) return;
    setIsLoading(true);
    try {
      const success = await depositFunds({
        accountId: selectedBankId,
        amount: Number(amount)
      });

      if (success) {
        setIsOpen(false);
        setAmount("");
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-bankGradient text-white shadow-sm font-semibold rounded-lg px-4 py-2">
          + Deposit Funds
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
          <DialogDescription>
            Simulate a direct deposit into one of your real-world bank accounts.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-14 font-medium text-gray-700">
              Select Bank Account
            </label>
            <BankDropdown 
              accounts={accounts} 
              setValue={(name: string, id: string) => setSelectedBankId(id)} 
              otherStyles="!w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="amount" className="text-14 font-medium text-gray-700">
              Deposit Amount
            </label>
            <Input
              id="amount"
              type="number"
              min="1"
              step="0.01"
              placeholder="e.g. 1000.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3 text-16"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleDeposit} disabled={!amount || isLoading || !selectedBankId} className="bg-bankGradient text-white">
            {isLoading ? <><Loader2 size={20} className="animate-spin mr-2" /> Processing...</> : "Deposit Money"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
