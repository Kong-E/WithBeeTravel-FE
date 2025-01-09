'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { PaymentError } from './payment-error';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class PaymentErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    console.log('getDerivedStateFromError:', error);
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('에러 바운더리에서 잡은 에러:', error);
    console.error('에러 정보:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <PaymentError
          message1="해당하는 카테고리의"
          message2="결제 내역이 존재하지 않아요."
        />
      );
    }

    return this.props.children;
  }
}
