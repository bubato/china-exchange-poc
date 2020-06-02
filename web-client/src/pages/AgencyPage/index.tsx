import React from "react";
import AgencyPageContainer from "containers/AgencyPageContainer";
import withAuth from "components/withAuth";

const AgencyPage: React.FunctionComponent = () => {

  return <AgencyPageContainer />;
};

export default withAuth(AgencyPage, "agency");