import React, { useState } from "react";
import { Grid } from "semantic-ui-react";
import Routes from "../../routes/Routes";
import { BrowserRouter as Router } from "react-router-dom";
import MenuLeft from "../../components/MenuLeft";
import TopBar from "../../components/TopBar";
import { DataContext } from "../../context/DataContext";
import "./LoggedLayout.scss";
export default function LoggedLayout(props) {
  const { user, setReloadApp } = props;

  return (
    <Router>
      <Grid className="logged-layout">
        <Grid.Row>
          <Grid.Column width={3}>
            <MenuLeft user={user} />
          </Grid.Column>
          <Grid.Column className="content" width={13}>
            <TopBar user={user} />

            <Routes user={user} setReloadApp={setReloadApp} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <h2>footer</h2>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Router>
  );
}
