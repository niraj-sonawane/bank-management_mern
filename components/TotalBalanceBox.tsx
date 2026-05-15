import AnimatedCounter from './AnimatedCounter';
import DoughnutChart from './DoughnutChart';
import { DepositModal } from './DepositModal';

const TotalBalanceBox = ({
  accounts = [], totalBanks, totalCurrentBalance
}: TotalBalanceBoxProps) => {
  return (
    <section className="total-balance">
      <div className="total-balance-chart">
        <DoughnutChart accounts={accounts} />
      </div>

      <div className="flex flex-col gap-6 w-full">
        <div className="flex w-full justify-between items-center">
          <h2 className="header-2">
            Bank Accounts: {totalBanks}
          </h2>
          <DepositModal accounts={accounts} />
        </div>
        <div className="flex flex-col gap-2">
          <p className="total-balance-label">
            Total Current Balance
          </p>

          <div className="total-balance-amount flex-center gap-2">
            <AnimatedCounter amount={totalCurrentBalance} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default TotalBalanceBox