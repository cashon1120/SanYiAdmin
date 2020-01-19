import React, {Component, Fragment} from 'react'
import {Row, Col} from 'antd'
import {connect} from 'dva'
import styles from '../../layouts/global.less'
import ItemView from '../itemView/Index'
import {formItemLayout} from '../../../public/config'

@connect(({chassisComponent, loading}) => ({chassisComponent, loading: loading.models.chassisComponent}))
class ItemList extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    previewType: 1
  }

  // 预览
  handlePreview = file => {
    const temp = file
      .url
      .split('.')
    const previewType = temp[temp.length - 1] === 'mp4'
      ? 2
      : 1
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
      previewType
    });
  }

  // 取消预览
  handleCancel = () => this.setState({previewVisible: false})

  download = (fileName, path) => {
    const {dispatch} = this.props
    const callback = response => {
      if (response) {
      const content = response
      const blob = new Blob([content])
      if ('msSaveBlob' in navigator) {
        navigator.msSaveBlob(blob, fileName)
      } else {
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href)
        document.body .removeChild(elink)
      }
    }
  }
  dispatch({
    type: 'chassisComponent/download',
    payload: {
      fileName,
      path
    },
    callback
  })
}

render() {
  let {label, text, images, files} = this.props
  let noContent = ''

  if(text === ''){
    noContent = '暂无内容'
  }
  if (images && images.length === 0) {
    noContent = '暂无图片'
  }
  if (images === '暂无内容') {
    noContent = '暂无内容'
    images = []
  }
  if (files && files.length === 0) {
    noContent = '暂无附件'
  }
  return (
    <Fragment>
      <Row className={styles.itemList}>
        <Col className={styles.itemListLabel}
            {...formItemLayout.labelCol}
        >{label}:
        </Col>
        <Col className={styles.itemListContent}
            {...formItemLayout.wrapperCol}
        >
          {images && images.length > 0
            ? <ItemView files={images}/>
            : null}
          {files && files.length > 0
            ? files.map(item => (
              <a
                  className={styles.aList}
                  key={item.url}
                  onClick={() => {
                this.download(item.name, item.url)
              }}
                  target="_blank"
              >{item.name}</a>
            ))
            : <span className={styles.grayFont}>{noContent}</span>}
          <div
              dangerouslySetInnerHTML={{
            __html: text
              ? text.replace(/\n|\r\n/g, '<br/>')
              : null
          }}
          ></div>
        </Col>
      </Row>
    </Fragment>
  )
}
}
export default ItemList
