import { ThemeProvider } from "./components/theme-provider";
import {ModeToggle} from "@/components/mode-toggle"


const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      App
      <ModeToggle/>
    </ThemeProvider>
  );
};

export default App;
