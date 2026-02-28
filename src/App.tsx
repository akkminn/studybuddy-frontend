import {Toaster} from "@/components/ui/sonner.tsx";
import { Navigate, Route, Routes } from "react-router-dom"
import ProtectedRoute from "@/components/ProtectedRoute.tsx";
import Dashboard from "@/pages/Dashboard.tsx";
import Login from "@/pages/Login.tsx";
import Register from "@/pages/Register.tsx";
import {ThemeProvider} from "@/components/ThemeProvider.tsx";

function App() {

  return (
    <>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            <Toaster richColors position="top-right" />
        </ThemeProvider>
    </>
  )
}

export default App
