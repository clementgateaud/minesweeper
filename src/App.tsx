import { AppProvider } from "./providers/AppProvider.tsx";
import { Home } from "./components/Home.tsx";

const App = () => {
  return (
    <AppProvider>
      <Home />
    </AppProvider>
  );
};

export default App;
