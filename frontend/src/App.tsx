import "./App.css";
import Header from "./components/custom/Header";
import SearchBar from "./components/custom/SearchBar";

function App() {
  return (
    <div className='app px-10'>
      <Header />
      <>
        <SearchBar />
      </>
    </div>
  );
}

export default App;
