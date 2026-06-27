import { ThemeProvider } from "./components/theme-provider";
import {ModeToggle} from "@/components/mode-toggle"
import Navbar from "./components/general/Navbar";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <h3 className="">App me html</h3>
      <Navbar/>


<h2>Testing fonts</h2>

<p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt quia neque provident necessitatibus. Minima facilis itaque iure officia amet ipsa alias commodi ut omnis a debitis magni eveniet porro, dolorem perferendis repellat autem repudiandae obcaecati eos veniam facere vitae inventore? Recusandae, voluptatum nam tempore nulla ad nisi quibusdam dicta quaerat.</p>

<h4 className="mt-6 bg-gray-600">Testing the nature of fonts</h4>
<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nesciunt debitis dolores labore libero suscipit, facilis tenetur, consequatur numquam minima non ducimus veritatis sapiente assumenda ullam? Atque dignissimos error laborum? Quo laborum delectus quod, quos autem alias. Dolorum itaque maxime quibusdam earum error cumque, nostrum commodi similique tempore. Tempora dolore quis consectetur facilis voluptatum nemo nulla, eos id, molestias cum dolores nostrum laboriosam perspiciatis at sint, a magni velit quo quam minima laudantium ut! Enim voluptates culpa fugiat similique, cupiditate quasi numquam sed perspiciatis distinctio architecto. Perferendis sed reprehenderit maxime architecto!</p>
    
    </ThemeProvider>
  );
};

export default App;
