import React from "react";
import Theme from "./theme/Theme";


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Main } from "./components/screens/Main";
import { CreateTwitterCard } from "./components/screens/CreateTwitterCard";
import { OnBoarding } from "./components/screens/OnBoarding";
import { AdminPanel } from "./components/screens/AdminPanel";
import { Template } from "./components/screens/Template";
import { Invoice } from "./components/screens/Invoice";
import { ProtectedRoute } from "./APIConfig/AuthGuard";
function App() {

  return (
    <Router>
      <Theme>
        <Routes>
          <Route path="/" exact element={<ProtectedRoute><Main /></ProtectedRoute>} />
          <Route path="/dashboard" exact element={<ProtectedRoute><CreateTwitterCard /></ProtectedRoute>} />
          <Route path="/campaign" exact element={<ProtectedRoute><Template /></ProtectedRoute>} />
          <Route path="/invoice" exact element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
          <Route path="/onboarding" exact element={<ProtectedRoute><OnBoarding /></ProtectedRoute>} />
          <Route path="/admin" exact element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        </Routes>
      </Theme>
    </Router>
  );
}

export default App;
