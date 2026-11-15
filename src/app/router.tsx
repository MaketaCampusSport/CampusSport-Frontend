import { createBrowserRouter } from 'react-router';
import AdminDashboard from '@/pages/AdminDashboard'; // temporar, dispare în faza 6
import { AvailabilityRoute, ConfirmRoute, StartRoute } from '@/features/user/routes';

export const router = createBrowserRouter([
  { path: '/', element: <StartRoute /> },
  { path: '/sport/:sportId', element: <AvailabilityRoute /> },
  { path: '/sport/:sportId/confirm', element: <ConfirmRoute /> },
  { path: '/admin', element: <AdminDashboard /> },
]);

