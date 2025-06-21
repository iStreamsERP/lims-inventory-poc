import { AuthProvider } from "@/contexts/AuthContext.jsx";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.jsx";
import { store } from "./app/store.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </AuthProvider>,
);
