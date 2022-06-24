import React from "react";
import Theme from "./theme/Theme";


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Main } from "./components/screens/Main";
import { CreateTwitterCard } from "./components/screens/CreateTwitterCard";
import { OnBoarding } from "./components/screens/OnBoarding";
import { Template } from "./components/screens/Template";
import { Invoice } from "./components/screens/Invoice";
function App() {

  return (
    <Router>
      <Theme>
        <Routes>
          <Route path="/" exact element={<Main />} />
          <Route path="/create" exact element={<CreateTwitterCard />} />
          <Route path="/template" exact element={<Template />} />
          <Route path="/invoice" exact element={<Invoice />} />
          <Route path="/onboarding" exact element={<OnBoarding />} />
        </Routes>
      </Theme>
    </Router>
  );
}

export default App;
