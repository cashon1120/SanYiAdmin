import React from 'react'
import { Form, Modal, Button } from 'antd'
import ItemList from '@/common/ItemList/Index'
const ModalForm = Form.create()(props => {
  const {
    visible,
    onOk,
    data
  } = props

  const okHandle = () => {
    onOk()
  }
  const getFiles = (files, type) => {
    let result = []
    files && files.map(item => {
      if(item.businessType === type){
        result.push({name: item.oldFileName, url: item.url})
      }
    })
    return result
  }

  let dataSource = [
    {
      name: 'DFMEA报告',
      files: getFiles(data, 1)
    },
    {
      name: '设计规范报告',
      files: getFiles(data, 2)
    },
    {
      name: '行业趋势报告',
      files: getFiles(data, 3)
    },
    {
      name: '法规标准报告',
      files: getFiles(data, 4)
    },
    {
      name: '质量分析报告',
      files: getFiles(data, 5)
    }
  ];



  return (
    <Modal
        cancelText="取消"
        destroyOnClose
        footer={[
          <Button key="back"
              onClick={okHandle}
          >
            关闭
          </Button>
        ]}
        okText="确定"
        onCancel={okHandle}
        onOk={okHandle}
        title="附件下载"
        visible={visible || false}
        width={560}
        zIndex={1000}
    >
       {dataSource.map(item => <ItemList files={item.files}
           key={
            item.name
          }
           label={
            item.name
          }
                               />)}
    </Modal>
  )
})

export default ModalForm
