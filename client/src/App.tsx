import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import {GameProvider, useGame} from "@/contexts/GameContext";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/MineGambler/" component={Home} />
      <Route path="/" component={Home} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {

  return (
      <QueryClientProvider client={queryClient}>
          <GameProvider>
              <Router />
              <Toaster />
          </GameProvider>
      </QueryClientProvider>
  );
}

export default App;
