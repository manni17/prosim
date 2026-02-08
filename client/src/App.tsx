import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { telemetry } from "./services/telemetry";

const queryClient = new QueryClient();

export type GameStatus = "IDLE" | "ACTIVE" | "REVIEW" | "GAME_OVER";

const App = () => {
  const [gameStatus, setGameStatus] = useState<GameStatus>("IDLE");

  useEffect(() => {
    telemetry.init().catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner theme="dark" richColors position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index gameStatus={gameStatus} setGameStatus={setGameStatus} initialData={null} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;