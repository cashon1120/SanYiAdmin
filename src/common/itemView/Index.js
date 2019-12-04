import React, {Component, Fragment} from 'react'
import {Modal} from 'antd';
import VideoImg from '../../assets/imgs/video.png'
import styles from '../../layouts/global.less'

class ItemView extends Component {
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

  render() {
    const {files} = this.props
    const {previewVisible, previewImage, previewType} = this.state
    return (
      <Fragment>
        {files.map(item => {
          if(item.url){
            const temp = item
              .url
              .split('.')
            const type = temp[temp.length - 1]
            const dom = <div
                className={`${styles.itemImg}`}
                key={item.id}
                onClick={() => this.handlePreview(item)}
                        >
              <img
                  key={item.id}
                  src={type === 'mp4'
                ? VideoImg
                : item.url}
              />
            </div>
            return dom
          }
        })}

        <Modal
            centered
            footer={null}
            onCancel={this.handleCancel}
            visible={previewVisible}
            width={800}
        >
          <div style={{
            textAlign: 'center'
          }}
          >
            {previewType === 1
              ? <img
                  alt="example"
                  src={previewImage}
                  style={{
                  width: '100%'
                }}
                />
              : <video autoPlay
                  className={styles.previewVideo}
                  controls
                  src={previewImage}
                />
}
          </div>
        </Modal>
      </Fragment>
    )
  }
}
export default ItemView
