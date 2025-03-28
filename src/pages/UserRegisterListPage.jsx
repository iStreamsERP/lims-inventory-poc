import UserDialog from "@/components/Dialog/UserDialog";
import UserTable from "@/components/Table/UserTable";
import { useState } from "react";

const UserRegisterListPage = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">User Register List</h1>
      <div>
        <UserTable />
      </div>
    </div>
  )
};

export default UserRegisterListPage;