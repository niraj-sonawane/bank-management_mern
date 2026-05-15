"use client";

import React, { useState, useEffect } from "react";
import HeaderBox from "@/components/HeaderBox";
import { 
  getAdminStats, 
  getAdminUsers, 
  getAdminTransactions, 
  getPendingLoans,
  getPendingTransfers,
  approveLoanAction,
  approveTransactionAction
} from "@/lib/actions/admin.actions";
import { formatAmount } from "@/lib/utils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Users, CreditCard, Activity, Landmark, Search } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [pendingLoans, setPendingLoans] = useState<any[]>([]);
  const [pendingTransfers, setPendingTransfers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [userSearch, setUserSearch] = useState("");
  const [txSearch, setTxSearch] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    const [statsData, usersData, txData, loansData, pendingTxData] = await Promise.all([
      getAdminStats(),
      getAdminUsers(),
      getAdminTransactions(),
      getPendingLoans(),
      getPendingTransfers(),
    ]);
    setStats(statsData);
    setUsers(usersData);
    setTransactions(txData);
    setPendingLoans(loansData);
    setPendingTransfers(pendingTxData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveLoan = async (loanId: string) => {
    const success = await approveLoanAction(loanId);
    if (success) fetchData();
  };

  const handleApproveTx = async (txId: string) => {
    const success = await approveTransactionAction(txId);
    if (success) fetchData();
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredTx = transactions.filter(tx => 
    tx.userId?.name?.toLowerCase().includes(txSearch.toLowerCase()) || 
    tx.description?.toLowerCase().includes(txSearch.toLowerCase())
  );

  if (isLoading) return <div className="flex-center h-screen"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto w-full">
      <HeaderBox 
        title="Admin Control Center"
        subtext="Global bank monitoring, user management, and approval workflows."
      />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3 max-w-[600px] h-12 bg-white border border-gray-100 shadow-sm rounded-lg p-1">
          <TabsTrigger value="overview" className="text-14 font-semibold data-[state=active]:bg-bank-gradient data-[state=active]:text-white rounded-md transition-all">Overview</TabsTrigger>
          <TabsTrigger value="users" className="text-14 font-semibold data-[state=active]:bg-bank-gradient data-[state=active]:text-white rounded-md transition-all">User Management</TabsTrigger>
          <TabsTrigger value="transactions" className="text-14 font-semibold data-[state=active]:bg-bank-gradient data-[state=active]:text-white rounded-md transition-all">Global Log</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-8 animate-in fade-in-50 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Users" value={stats?.userCount} icon={<Users className="text-blue-500" />} />
            <StatCard title="Total Accounts" value={stats?.accountCount} icon={<CreditCard className="text-green-500" />} />
            <StatCard title="Total Transactions" value={stats?.transactionCount} icon={<Activity className="text-purple-500" />} />
            <StatCard title="System Liquidity" value={formatAmount(stats?.totalSystemLiquidity)} icon={<Landmark className="text-orange-500" />} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
              <h2 className="text-18 font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-orange-100 p-2 rounded-lg text-orange-600">Pending Loan Approvals</span>
              </h2>
              {pendingLoans.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No loans requiring approval.</p>
              ) : (
                <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2">
                  {pendingLoans.map((loan) => (
                    <div key={loan._id} className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex justify-between items-center gap-4">
                      <div>
                        <p className="text-14 font-bold text-gray-900">{loan.userId?.name}</p>
                        <p className="text-12 text-gray-600 capitalize">{loan.loanType} Loan</p>
                        <p className="text-16 font-semibold text-orange-600 mt-1">{formatAmount(loan.amount)}</p>
                      </div>
                      <Button size="sm" className="bg-bank-gradient text-white shadow-sm" onClick={() => handleApproveLoan(loan._id)}>
                        Approve
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
              <h2 className="text-18 font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-red-100 p-2 rounded-lg text-red-600">Pending High-Value Transfers</span>
              </h2>
              {pendingTransfers.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No high-value transfers pending.</p>
              ) : (
                <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2">
                  {pendingTransfers.map((tx) => (
                    <div key={tx._id} className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex justify-between items-center gap-4">
                      <div>
                        <p className="text-14 font-bold text-gray-900">From: {tx.senderId?.name}</p>
                        <p className="text-12 text-gray-600">To: {tx.receiverId?.name}</p>
                        <p className="text-16 font-semibold text-red-600 mt-1">{formatAmount(tx.amount)}</p>
                      </div>
                      <Button size="sm" className="bg-red-600 text-white hover:bg-red-700 shadow-sm" onClick={() => handleApproveTx(tx._id)}>
                        Release
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* USERS TAB */}
        <TabsContent value="users" className="animate-in fade-in-50 duration-500">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-18 font-bold text-gray-900">User Registry</h2>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Filter users by name or email..." 
                  className="pl-9 h-10 border-gray-200 outline-none focus-visible:ring-1 focus-visible:ring-bankGradient"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
            </div>
            
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No users found.</TableCell></TableRow>
                  ) : (
                    filteredUsers.map((u) => (
                      <TableRow key={u._id}>
                        <TableCell className="font-semibold">{u.name}</TableCell>
                        <TableCell className="text-gray-600">{u.email}</TableCell>
                        <TableCell className="text-gray-600">{u.state || 'N/A'}</TableCell>
                        <TableCell className="capitalize">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                            {u.role}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-600">{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* TRANSACTIONS TAB */}
        <TabsContent value="transactions" className="animate-in fade-in-50 duration-500">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <div className="flex justify-between items-center mb-6">
              <h2 className="text-18 font-bold text-gray-900">Global Transaction Log</h2>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Filter by user or description..." 
                  className="pl-9 h-10 border-gray-200 outline-none focus-visible:ring-1 focus-visible:ring-bankGradient"
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>Initiator</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTx.length === 0 ? (
                     <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No transactions found.</TableCell></TableRow>
                  ) : (
                    filteredTx.map((tx) => (
                      <TableRow key={tx._id}>
                        <TableCell className="font-semibold">{tx.userId?.name}</TableCell>
                        <TableCell className="max-w-[250px] truncate text-gray-700">{tx.description}</TableCell>
                        <TableCell className={`font-semibold ${tx.type === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
                          {tx.type === 'debit' ? '-' : '+'}{formatAmount(tx.amount)}
                        </TableCell>
                        <TableCell>
                           <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700">
                             {tx.category || 'Transfer'}
                           </span>
                        </TableCell>
                        <TableCell className="text-gray-600">{new Date(tx.date).toLocaleString()}</TableCell>
                        <TableCell className="capitalize text-[12px] font-medium text-gray-600">{tx.type}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
};

const StatCard = ({ title, value, icon }: { title: string, value: any, icon: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-md">
    <div>
      <p className="text-14 text-gray-500 font-medium">{title}</p>
      <h3 className="text-24 font-bold text-gray-900 mt-1">{value || 0}</h3>
    </div>
    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">{icon}</div>
  </div>
);

export default AdminDashboard;
