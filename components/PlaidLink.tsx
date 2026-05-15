"use client";

import React, { useState } from 'react'
import { Button } from './ui/button'
import Image from 'next/image';
import { createSimulatedBankAccount } from '@/lib/actions/user.actions';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "./ui/input";
import { Loader2 } from 'lucide-react';

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [bankName, setBankName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConnectBank = async () => {
    if (!bankName) return;
    setIsLoading(true);
    try {
      const account = await createSimulatedBankAccount({
        bankName: bankName,
        accountNumber: user?.email?.split("@")[0] + '-' + Math.random().toString(36).substring(7),
        startingBalance: 0,
      });

      if (account) {
        setIsOpen(false);
        setBankName("");
        router.refresh();
        router.push('/');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const Trigger = variant === 'primary' ? (
    <Button className="plaidlink-primary">Connect bank</Button>
  ) : variant === 'ghost' ? (
    <Button variant="ghost" className="plaidlink-ghost">
      <Image src="/icons/connect-bank.svg" alt="connect bank" width={24} height={24} />
      <p className='hiddenl text-[16px] font-semibold text-black-2 xl:block'>Connect bank</p>
    </Button>
  ) : (
    <Button className="plaidlink-default">
      <Image src="/icons/connect-bank.svg" alt="connect bank" width={24} height={24} />
      <p className='text-[16px] font-semibold text-black-2'>Connect bank</p>
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {Trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Link a Bank Account</DialogTitle>
          <DialogDescription>
            Add your bank account
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-14 font-medium text-gray-700">
              Bank Institution Name
            </label>
            <Input
              id="name"
              placeholder="e.g. Chase Checking"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="col-span-3 text-16"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleConnectBank} disabled={!bankName || isLoading} className="bg-bankGradient text-white">
            {isLoading ? <><Loader2 size={20} className="animate-spin mr-2" /> Linking...</> : "Link Bank"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PlaidLink