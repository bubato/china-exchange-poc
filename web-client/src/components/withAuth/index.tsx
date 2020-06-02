import React, { useEffect, useState } from "react";
import LoginApiClient from "api/LoginApiClient";
import ChinaExchangeApiClient from "api/common/ChinaExchangeApiClient";
import { useHistory } from "react-router-dom";

const loginApiClient = new LoginApiClient();

function withAuth( Component: React.FunctionComponent, role: string)  {
  return function WrapperFunction<T extends React.FunctionComponent>() {
    const history = useHistory();
    const [hasToken, setHasToken] = useState(false);
    useEffect(() => {
      async function checkUser() {
        try {
          ChinaExchangeApiClient.accessToken = localStorage.getItem("accessToken");
          const currentUser = await loginApiClient.currentUser();
          if (!currentUser.roles.includes(role)) {
            history.push("/login");
          } else {
            setHasToken(true);
          }
        } catch(e) {
          history.push("/login");
        }
      }

      checkUser();
    });

    return (
      <>
        {hasToken && (
          <Component />
        )}
      </>
    );

  };
}

export default withAuth;