import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import UserForm from "@/features/dashboard/user/components/user-form";

const AddUser = () => {
  return (
    <SidebarInset>
      <SiteHeader title="New User" />
      <div className="flex flex-1 flex-col">
        <div className="max-w-7xl w-full mx-auto flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
            <h1 className="text-2xl font-bold">Add New User</h1>

            <div className="mt-11">
              <UserForm />
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default AddUser;
