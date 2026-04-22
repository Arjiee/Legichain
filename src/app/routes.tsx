import { createBrowserRouter, Navigate } from 'react-router';
import { DataProvider } from './components/DataContext';
import { PublicApp } from './components/PublicApp';
import { AdminApp } from './components/AdminApp';
import { LoginPage } from './components/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <DataProvider>
        <PublicApp />
      </DataProvider>
    ),
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: (
      <DataProvider>
        <ProtectedRoute>
          <AdminApp />
        </ProtectedRoute>
      </DataProvider>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
