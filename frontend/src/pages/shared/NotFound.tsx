import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, FileQuestion } from 'lucide-react';
import { useAuth } from '../../hooks/auth/useAuth';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case 'PATIENT':
          navigate('/patient');
          break;
        case 'DOCTOR':
          navigate('/doctor');
          break;
        case 'ADMIN':
          navigate('/admin');
          break;
        default:
          navigate('/');
      }
    } else {
      navigate('/login');
    }
  };

  const popularLinks = [
    ...(isAuthenticated && user ? [
      {
        to: user.role === 'PATIENT' ? '/patient' :
            user.role === 'DOCTOR' ? '/doctor' : '/admin',
        label: 'Dashboard',
        description: 'Go to your main dashboard'
      }
    ] : []),
    ...(user?.role === 'PATIENT' ? [
      { to: '/patient/appointments', label: 'My Appointments', description: 'View your scheduled appointments' },
      { to: '/patient/book', label: 'Book Appointment', description: 'Schedule a new appointment' },
      { to: '/patient/records', label: 'Medical Records', description: 'Access your medical history' }
    ] : []),
    ...(user?.role === 'DOCTOR' ? [
      { to: '/doctor/appointments', label: 'My Appointments', description: 'Manage your patient appointments' },
      { to: '/doctor/patients', label: 'Patients', description: 'View your patient roster' },
      { to: '/doctor/analytics', label: 'Analytics', description: 'View practice statistics' }
    ] : []),
    ...(user?.role === 'ADMIN' ? [
      { to: '/admin/users', label: 'User Management', description: 'Manage system users' },
      { to: '/admin/appointments', label: 'All Appointments', description: 'View system appointments' },
      { to: '/admin/analytics', label: 'System Analytics', description: 'View system statistics' }
    ] : []),
    ...(!isAuthenticated ? [
      { to: '/login', label: 'Sign In', description: 'Access your MedPortal account' },
      { to: '/register', label: 'Create Account', description: 'Join MedPortal today' }
    ] : [])
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* 404 Header */}
        <div className="text-center">
          <div className="mx-auto h-24 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <FileQuestion className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back to where you need to be.
          </p>
        </div>

        {/* Action Buttons */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleGoBack}
                variant="outline"
                className="flex items-center justify-center gap-2 h-12"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              
              <Button 
                onClick={handleGoHome}
                className="flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Home className="h-4 w-4" />
                {isAuthenticated ? 'Dashboard' : 'Home'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Popular Links */}
        {popularLinks.length > 0 && (
          <Card className="shadow-lg bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Search className="h-5 w-5" />
                Quick Links
              </CardTitle>
              <CardDescription>
                Here are some pages you might be looking for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {popularLinks.slice(0, 6).map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {link.label}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {link.description}
                    </p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Text */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            If you continue to experience issues, please{' '}
            <Link to="/contact" className="text-blue-600 hover:text-blue-800 font-medium">
              contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Export for easier importing
export default NotFound;