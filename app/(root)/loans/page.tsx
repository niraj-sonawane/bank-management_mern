import LoansPage from "@/components/LoansPage";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

const LoansRoute = async () => {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) redirect("/sign-in");

  return (
    <section className="flex w-full flex-row">
      <div className="flex-1">
        <LoansPage user={loggedIn} />
      </div>
    </section>
  );
};

export default LoansRoute;
