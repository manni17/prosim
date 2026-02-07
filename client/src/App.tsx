import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export type GameStatus = "IDLE" | "ACTIVE" | "REVIEW" | "GAME_OVER";

const App = () => {
  const [gameStatus, setGameStatus] = useState<GameStatus>("IDLE");

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
