import { Outlet } from "react-router-dom";
import Navbar from "./components/general/Navbar";
import Footer from "./components/general/Footer";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;
