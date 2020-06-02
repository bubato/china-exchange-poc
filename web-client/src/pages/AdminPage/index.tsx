import React from "react";
import AdminPageContainer from "containers/AdminPageContainer";
import AdminHeader from "components/AdminHeader";
import withAuth from "components/withAuth";

const AdminPage: React.FunctionComponent = () => {
  return (
    <>
      <AdminHeader />
      <AdminPageContainer />
    </>
  );
};

export default withAuth(AdminPage, "admin");
