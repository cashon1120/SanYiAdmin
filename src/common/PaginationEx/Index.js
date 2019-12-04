import React from 'react'
import { Pagination } from 'antd';
export default class PaginationEx extends React.Component {
    state = {
        page: 1,
        pageSize: this.props.pageSizeOptions != void 0 ? parseInt(this.props.pageSizeOptions[0]) : 10
    };
    showTotal = (total) => {
        return '共 ' + this.props.total + ' 条记录 第 ' + this.state.page + ' / ' + Math.ceil(total / this.state.pageSize) + ' 页';
    };
    onChange = (page, pageSize) => {
        this.setState({
            page: page,
            pageSize: pageSize
        });
        this.props.onChangeEx(page, pageSize);
    };
    onShowSizeChange = (page, pageSize) => {
        this.setState({
            page: page,
            pageSize: pageSize
        });
        this.props.onChangeEx(page, pageSize);
    };
    setCurrentPage = (page) => {
        this.setState({
            page: page
        });
    };
    render() {
        return (
            <div>
                <Pagination
                    current={this.state.page}
                    onChange={this.onChange}
                    onShowSizeChange={this.onShowSizeChange}
                    pageSize={this.state.pageSize}
                    pageSizeOptions={this.props.pageSizeOptions != void 0 ? this.props.pageSizeOptions : ['10', '20', '30', '40']}
                    showQuickJumper
                    showSizeChanger
                    showTotal={this.showTotal}
                    style={{ textAlign: 'right', marginTop: 20 }}
                    total={this.props.total <= 0 ? 1 : this.props.total}
                />
            </div>
        );
    }
}