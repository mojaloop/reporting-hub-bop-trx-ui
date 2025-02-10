import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  onError: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  isForbidden: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, isForbidden: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true, isForbidden: false };
  }

  componentDidCatch(error: any): void {
    // Check for 403 error
    const status = error?.response?.status || error?.networkError?.statusCode;
    if (status === 403) {
      this.setState({ isForbidden: true });
      this.props.onError();
    }
  }

  render() {
    if (this.state.hasError && this.state.isForbidden) {
      return null; // Do not render anything if a 403 error occurs
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
