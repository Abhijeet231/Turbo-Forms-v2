import { ThemeProvider } from "./components/theme-provider";
import {ModeToggle} from "@/components/mode-toggle"
import Navbar from "./components/general/Navbar";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <h3 className="">App me html</h3>
      <Navbar/>
   
    </ThemeProvider>
  );
};

export default App;
