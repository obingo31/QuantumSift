import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false,
      error: undefined,
      errorInfo: undefined 
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { 
      hasError: true,
      error 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ 
      error, 
      errorInfo 
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback or default error UI
      const DefaultErrorUI = (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-center mb-6">
              <AlertTriangle className="w-16 h-16 text-red-500 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4 text-center">
              Application Error
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
              We're sorry for the inconvenience. An unexpected error occurred.
            </p>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Error Details:</h2>
              <pre className="text-xs text-gray-500 dark:text-gray-400 overflow-x-auto">
                {this.state.error?.toString()}
              </pre>
            </div>
            <div className="mt-6 text-center">
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );

      return this.props.fallback || DefaultErrorUI;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
