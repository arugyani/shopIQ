import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.css";

import { store } from "./app/store.ts";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
