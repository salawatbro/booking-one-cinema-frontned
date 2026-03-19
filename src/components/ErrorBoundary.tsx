import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center text-center" style={{ padding: '0 32px' }}>
          <div
            className="flex items-center justify-center bg-danger-light"
            style={{ width: 64, height: 64, borderRadius: 32 }}
          >
            <AlertTriangle size={28} className="text-danger" />
          </div>
          <h1 className="text-[18px] font-bold text-text-primary" style={{ marginTop: 16 }}>
            Xatolik yuz berdi
          </h1>
          <p className="text-[13px] text-text-secondary leading-relaxed" style={{ marginTop: 8, maxWidth: 280 }}>
            Kutilmagan xatolik yuz berdi. Sahifani qaytadan yuklang yoki bosh sahifaga qayting.
          </p>
          {this.state.error && (
            <pre
              className="w-full text-left text-[11px] text-text-tertiary bg-bg-secondary overflow-auto"
              style={{ marginTop: 16, padding: 12, borderRadius: 6, maxHeight: 120 }}
            >
              {this.state.error.message}
            </pre>
          )}
          <div className="w-full flex flex-col" style={{ marginTop: 24, gap: 8 }}>
            <button
              onClick={this.handleReset}
              className="w-full bg-accent text-white text-[14px] font-semibold flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
              style={{ height: 48, borderRadius: 8 }}
            >
              <RefreshCw size={16} /> Qaytadan urinish
            </button>
            <button
              onClick={() => { window.location.href = '/'; }}
              className="w-full bg-bg-secondary text-text-primary text-[14px] font-semibold active:opacity-80 transition-opacity"
              style={{ height: 48, borderRadius: 8 }}
            >
              Bosh sahifaga qaytish
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
