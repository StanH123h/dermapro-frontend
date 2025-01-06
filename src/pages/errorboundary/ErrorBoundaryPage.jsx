import React from 'react';
import { Toast } from '@douyinfe/semi-ui';

class ErrorBoundaryPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('全局错误捕获:', error, info);
        Toast.error('发生错误，请刷新页面或稍后再试');
    }

    render() {
        if (this.state.hasError) {
            return <h1>页面加载错误，请刷新重试。</h1>;
        }
        return this.props.children;
    }
}

export default ErrorBoundaryPage;