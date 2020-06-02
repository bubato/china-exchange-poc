import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "pages/HomePage";
import { withTranslation } from "react-i18next";
import CustomerPaymentPage from "pages/CustomerPaymentPage";
import AgencyPage from "pages/AgencyPage";
import Merchandiser from "pages/MerchandiserPage";
import AdminPage from "pages/AdminPage";
import LoginPage from "pages/LoginPage";
import NotFoundPage from "pages/NotFoundPage";

function AppRouter() {
  return (
    <Router>
      <Switch>
        <Route path="/payment" exact>
          <CustomerPaymentPage />
        </Route>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/anotherpage" exact>
          <>I am anotherpage</>
        </Route>
        <Route path="/agency" exact>
          <AgencyPage />
        </Route>
        <Route path="/merchandiser" exact>
          <Merchandiser />
        </Route>
        <Route path="/admin" exact>
          <AdminPage />
        </Route>
        <Route path="/login" exact>
          <LoginPage />
        </Route>
        <Route path="/notfound" exact>
          <NotFoundPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default withTranslation()(AppRouter);
