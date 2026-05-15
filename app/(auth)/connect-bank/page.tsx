import HeaderBox from "@/components/HeaderBox";
import PlaidLink from "@/components/PlaidLink";
import { getLoggedInUser } from "@/lib/actions/user.actions";

const ConnectBankPage = async () => {
  const user = await getLoggedInUser();

  return (
    <section className="flex-center size-full max-sm:px-6">
      <div className="flex flex-col gap-6 w-full max-w-md">
        <HeaderBox
          title="Connect Your Bank"
          subtext="Link a simulated bank account to start using the dashboard."
        />
        {user && <PlaidLink user={user} variant="primary" />}
      </div>
    </section>
  );
};

export default ConnectBankPage;

