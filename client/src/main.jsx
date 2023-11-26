import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Sepolia } from "@thirdweb-dev/chains";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { BrowserRouter as Router } from 'react-router-dom';

import "./index.css";
import { StateContextProvider } from "./context";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.


const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ThirdwebProvider
      clientId={import.meta.env.VITE_TEMPLATE_CLIENT_ID}
      activeChain={Sepolia}
    >
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </ThirdwebProvider>
  </React.StrictMode >
);
