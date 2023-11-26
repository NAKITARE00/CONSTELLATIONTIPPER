import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home, ElectionDetails, CreateElection, Vote, Profile, Registration } from "./pages";
import { Navbar, Sidebar } from "./components"

function App() {
  return (

    <div className="relative sm: -8 p-4 bg-[#13131a] min-h-screen 
    flex flex-row">
      <BrowserRouter>
        <div className="sm:flex hidden mr-10 relative">
          <Sidebar />
        </div>
        <div className="flex-1 max-sm:w-full max-w-[1280px] 
      mx-auto sm:pr-5">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/election-details/:id" element={<ElectionDetails />} />
            <Route path="/create-election" element={<CreateElection />} />
            <Route path="/vote" element={<Vote />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/registration" element={<Registration />} />
          </Routes>
        </div>
      </BrowserRouter>

    </div >
  );
}

export default App;