import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import Wizard from './pages/Wizard';
import Reports from './pages/Reports';
import Docs from './pages/Docs';
import Analytics from './pages/Analytics';
import ProcessCanvas from './pages/ProcessCanvas';
import Playground from './pages/playground';
import AlchemyLab from './pages/alchemyLab';
import MainLayout from './layouts/MainLayout';
import RouteError from './components/RouteError';
import ProtectedRoute from './components/ProtectedRoute';
import { SidebarProvider } from './contexts/SidebarContext';
import { Toaster } from '@/components/ui/sonner';
import WizardSteel from './pages/WizardSteel';
import WizardLead from './pages/WizardLead';
import WizardZinc from './pages/Wizard-zn';

function App() {
  const router = createBrowserRouter([
    // Routes without sidebar
    {
      path: "/",
      element: <Landing />,
      errorElement: <RouteError />
    },
    {
      path: "/login",
      element: <Login />,
      errorElement: <RouteError />
    },
    {
      path: "/signup",
      element: <Signup />,
      errorElement: <RouteError />
    },
    {
      path: "/docs",
      element: <Docs />,
      errorElement: <RouteError />
    },
    // Routes with sidebar - wrapped in MainLayout (Protected)
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      ),
      errorElement: <RouteError />,
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
          errorElement: <RouteError />
        },
        
        {
          path: "wizard",
          element: <Wizard />,
          errorElement: <RouteError />
        },
        {
          path: "wizard-steel",
          element: <WizardSteel />,
          errorElement: <RouteError />
        },
        {
          path: "wizard-lead",
          element: <WizardLead />,
          errorElement: <RouteError />
        },
        {
          path: "wizard-zinc",
          element: <WizardZinc />,
          errorElement: <RouteError />
        },
        {
          path: "reports",
          element: <Reports />,
          errorElement: <RouteError />
        },
        {
          path: "canvas",
          element: <ProcessCanvas />,
          errorElement: <RouteError />
        },
        {
          path: "analytics",
          element: <Analytics />,
          errorElement: <RouteError />
        },
        {
          path: "playground",
          element: <Playground />,
          errorElement: <RouteError />
        },
        {
          path: "alchemy-lab",
          element: <AlchemyLab />,
          errorElement: <RouteError />
        }
      ]
    }
  ])

  return (
    <SidebarProvider>
      <RouterProvider router={router} />
      <Toaster 
        position="top-right" 
        closeButton
        toastOptions={{
          style: {
            background: '#FCFAF6',
            border: '1px solid #DED6CC',
            borderRadius: '14px',
            padding: '16px',
            boxShadow: '0 8px 24px rgba(52, 39, 68, 0.12)',
            color: '#342744',
          },
          className: 'font-sans',
          success: {
            style: {
              background: '#FCFAF6',
              border: '2px solid #8FAF9A',
              color: '#24422E',
            },
            iconTheme: {
              primary: '#8FAF9A',
              secondary: '#FCFAF6',
            },
          },
          error: {
            style: {
              background: '#FCFAF6',
              border: '2px solid #B87968',
              color: '#8F3A2B',
            },
            iconTheme: {
              primary: '#B87968',
              secondary: '#FCFAF6',
            },
          },
          loading: {
            style: {
              background: '#FCFAF6',
              border: '2px solid #68538C',
              color: '#342744',
            },
            iconTheme: {
              primary: '#68538C',
              secondary: '#FCFAF6',
            },
          },
        }}
      />
    </SidebarProvider>
  );
}

export default App;