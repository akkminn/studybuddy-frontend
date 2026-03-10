import { Routes, Route, Navigate} from "react-router-dom";
import {ThemeProvider} from "@/components/ThemeProvider.tsx";
import MainLayout from "@/components/MainLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login.tsx";
import Register from "@/pages/Register.tsx";
import ProtectedRoute from "@/components/ProtectedRoute.tsx";
import Dashboard from "@/pages/Dashboard.tsx";
import GenerateQuestion from "@/pages/GenerateQuestion.tsx";
import ChatAgent from "@/pages/ChatAgent.tsx";
import Documents from "@/pages/Documents.tsx";
import MyQuizzes from "./pages/MyQuizzes";
import Settings from "./pages/Settings";
import {Toaster} from "@/components/ui/sonner.tsx";


export default function App() {
    return (
        <ThemeProvider>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>

                <Route element={<ProtectedRoute/>}>
                    <Route element={<MainLayout/>}>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/dashboard" element={<Dashboard/>}/>
                        <Route path="/generate-questions" element={<GenerateQuestion/>}/>
                        <Route path="/knowledge-base" element={<Documents/>}/>
                        <Route path="/chat" element={<ChatAgent/>}/>
                        <Route path="/my-quizzes" element={<MyQuizzes/>}/>
                        <Route path="/settings" element={<Settings/>}/>
                    </Route>
                </Route>
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
            <Toaster richColors position="top-right"/>
        </ThemeProvider>
    );
}
