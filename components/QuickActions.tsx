import Link from "next/link";
import { Send, Plus, CreditCard } from "lucide-react";

const QuickActions = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-18 font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-3 gap-4">
        <Link 
          href="/payment-transfer" 
          className="flex flex-col items-center justify-center p-4 rounded-lg bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors gap-2"
        >
          <div className="p-2 bg-blue-500 rounded-full text-white">
            <Send size={20} />
          </div>
          <span className="text-12 font-semibold text-blue-900">Transfer</span>
        </Link>

        <Link 
          href="/loans" 
          className="flex flex-col items-center justify-center p-4 rounded-lg bg-green-50 border border-green-100 hover:bg-green-100 transition-colors gap-2"
        >
          <div className="p-2 bg-green-500 rounded-full text-white">
            <CreditCard size={20} />
          </div>
          <span className="text-12 font-semibold text-green-900">Get Loan</span>
        </Link>

        <Link 
          href="/#connect-bank" 
          className="flex flex-col items-center justify-center p-4 rounded-lg bg-purple-50 border border-purple-100 hover:bg-purple-100 transition-colors gap-2"
        >
          <div className="p-2 bg-purple-500 rounded-full text-white">
            <Plus size={20} />
          </div>
          <span className="text-12 font-semibold text-purple-900">Link Bank</span>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;
