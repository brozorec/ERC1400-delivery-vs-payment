import React from "react";
import ReactDOM from "react-dom";
//import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "./index.css";
import App from "./App";

import { ThemeSwitcherProvider } from "react-css-theme-switcher";

const themes = {
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/light-theme.css`,
};

const prevTheme = window.localStorage.getItem("theme");
const stripePromise = loadStripe("pk_test_51IeddeDCSVmtRQ3w7ujcZHn49b9AF3GkY1vo65qZaIBHTegOQDnXOvihBkfcSt7O9LGZ9bb5lvrMZfHRqqKtpIrM00xoRhCNJ2");

//let subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract"

//const client = new ApolloClient({
  //uri: subgraphUri,
  //cache: new InMemoryCache()
//});

ReactDOM.render(
  <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme ? prevTheme : "light"}>
    <Elements stripe={stripePromise}>
      <App/>
    </Elements>
  </ThemeSwitcherProvider>,
  document.getElementById("root"),
);
