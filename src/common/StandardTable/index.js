import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from './index.less';

function initTotalList(columns) {
  const totalList = [];
  if (columns) {
    columns.forEach(column => {
      if (column.needTotal) {
        totalList.push({ ...column, total: 0 });
      }
    });
  }
  return totalList;
}

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);
    this.state = {
      needTotalList,
      pcolumns: [],
      columns: []
    };
  }

  componentWillMount() {
    const { columns } = this.props;
    const nColumns = this.filterColumns(columns);
    this.setState({
      pcolumns: columns,
      columns: nColumns
    });

    this.countAmountWidth(nColumns);
  }

  componentWillReceiveProps(nextProps) {
    const { pcolumns } = this.state;
    const { columns } = nextProps;
    if (columns && JSON.stringify(pcolumns) !== JSON.stringify(columns)) {
      const nColumns = this.filterColumns(columns);
      this.setState({
        pcolumns: columns,
        columns: nColumns
      });

      this.countAmountWidth(nColumns);
    }
  }

  // static getDerivedStateFromProps(nextProps) {
  //   // clean state
  //   if (nextProps.selectedRows && nextProps.selectedRows.length === 0) {
  //     const needTotalList = initTotalList(nextProps.columns);
  //     return {
  //       selectedRowKeys: [],
  //       needTotalList,
  //     };
  //   }
  //   return null;
  // }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0)
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRowKeys, selectedRows);
    }
    this.setState({ needTotalList });
  };

  handleRowSelect = (record, selected, selectedRows) => {
    const { onSelect } = this.props;
    if (onSelect) {
      onSelect(record, selected, selectedRows);
    }
  };

  handleOnSelectAll = (selected, selectedRows, changeRows) => {
    const { onSelectAll } = this.props;
    if (onSelectAll) {
      onSelectAll(selected, selectedRows, changeRows);
    }
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange, onChangeCombine } = this.props;
    if (onChangeCombine) {
      const params = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize
      };
      onChangeCombine(params);
    } else if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  filterColumns = columns =>
    columns.filter(item => item.showStatu !== 'hide' && item.showStatu !== 'hideTable');

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  // 设置序号表头
  resetColumn = (column, data) => {
    const hasIndex = column.some(item => item.dataIndex === 'serialNumber');
    if (!hasIndex) {
      column.splice(0, 0, {
        title: '序号',
        dataIndex: 'serialNumber',
        width: 60
      });
    }

    data.map((item, index) => {
      const obj = item;
      obj.serialNumber = index + 1;
      return obj;
    });
  };

  // 计算总宽度
  countAmountWidth = columns => {
    const { scroll, showSelectRow, showRowNum } = this.props;
    if (scroll) {
      let amountWidth = columns.reduce((total, item) => total + (item.width || 100), 0);
      if (showSelectRow) {
        amountWidth += 60;
      }
      if (showRowNum) {
        amountWidth += 60;
      }
      this.setState({ amountWidth: { x: amountWidth, y: false } });
    }
  };

  render() {
    const {
      data: { data, list },
      loading,
      rowKey,
      showSelectRow,
      bordered,
      ispagination,
      showRowNum,
      selectedRowKeys,
      selectType,
      columnTitle,
      scroll
    } = this.props;
    let {
      data: { pagination }
    } = this.props;
    const { amountWidth, columns } = this.state;

    let dataSource = data || list;
    if (!!dataSource && !Array.isArray(dataSource)) {
      if (!pagination) {
        pagination = {};
      }
      if (dataSource) {
        pagination.current = dataSource.pageNum;
        pagination.total = dataSource.total;
        pagination.pageNum = dataSource.pageNum;
        pagination.pageSize = dataSource.pageSize;
      }
      dataSource = dataSource.list;
    }

    if (showRowNum && columns && dataSource) {
      this.resetColumn(columns, dataSource);
    }

    let paginationProps;
    if (ispagination === false) {
      paginationProps = false;
    } else {
      paginationProps = {
        showTotal : total => `总共 ${total} 条数据`,
        showSizeChanger: true,
        ...pagination,
        showQuickJumper: true,
        pageSizeOptions: ['10', '15', '20', '30', '40', '50']
      };
    }
    const rowSelection = showSelectRow
      ? {
          selectedRowKeys,
          type: selectType || 'checkbox',
          columnTitle: columnTitle || React.ReactNode,
          onChange: this.handleRowSelectChange,
          onSelect: this.handleRowSelect,
          onSelectAll: this.handleOnSelectAll,
          getCheckboxProps: record => ({
            disabled: record.disabled
          })
        }
      : null;
    const { marginTop, onRow } = this.props;
    const onRowTable =
      {
        onRow
      } || {};
    return (
      <div className={marginTop === 0 ? null : styles.standardTable}>
        {/* <div className={styles.tableAlert}>
          <Alert
            message={
              <Fragment>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                {needTotalList.map(item => (
                  <span style={{ marginLeft: 8 }} key={item.dataIndex}>
                    {item.title}
                    总计&nbsp;
                    <span style={{ fontWeight: 600 }}>
                      {item.render ? item.render(item.total) : item.total}
                    </span>
                  </span>
                ))}
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                  清空
                </a>
              </Fragment>
            }
            type="info"
            showIcon
          />
        </div> */}
        <Table
            bordered={bordered}
            columns={columns || []}
            dataSource={dataSource || []}
            loading={loading}
            onChange={this.handleTableChange}
            pagination={paginationProps}
            rowKey={rowKey || columns[0].dataIndex}
            rowSelection={rowSelection}
            scroll={scroll ? amountWidth : {}}
            size="middle"
            {...onRowTable}
        />
      </div>
    );
  }
}

export default StandardTable;
