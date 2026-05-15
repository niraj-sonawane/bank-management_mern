import AdminDashboard from "@/components/AdminDashboard";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

const AdminRoute = async () => {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) redirect("/sign-in");
  
  if (loggedIn.role !== "admin") {
    // If user is not an admin, redirect them to the home dashboard
    redirect("/");
  }

  return (
    <section className="flex w-full flex-row">
      <div className="flex-1">
        <AdminDashboard />
      </div>
    </section>
  );
};

export default AdminRoute;
