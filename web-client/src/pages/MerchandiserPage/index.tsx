import React from "react";
import MerchandiserPageContainer from "containers/MerchandiserPageContainer";
import withAuth from "components/withAuth";

const MerchandiserPage: React.FunctionComponent = () => {

  return <MerchandiserPageContainer />;
};

export default withAuth(MerchandiserPage, "merchandiser");