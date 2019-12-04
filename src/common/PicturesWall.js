import React from 'react'
import {Upload, Icon, Modal, Button, message} from 'antd'
import styles from '../layouts/global.less'
import {UPLOAD_URL} from '../../public/config'
import VideoImg from '../assets/imgs/video.png'


// 设置数据格式
const setFileList = (dataSource, maxImgLen) => {
  const maxLen = maxImgLen === undefined
    ? 1
    : maxImgLen;
  const fileList = [];
  let fileListArr = [dataSource];
  if (dataSource === '' || dataSource === null || dataSource === undefined) {
    fileListArr = [];
  }
  if (maxLen === 1) {
    if (fileListArr.length > 0) {
      fileListArr = [dataSource];
    }
  } else if (maxLen > 1) {
    if (Array.isArray(dataSource)) {
      fileListArr = dataSource;
    }
  }

  // 给传进来的数据加上一个key
  fileListArr.forEach((item, index) => {
    if(item.url){
      const temp = item.url.split('.')
      if(temp[temp.length - 1] === 'mp4'){
        item.data = item.url
        item.url = VideoImg
      }
    }
    const obj = {
      ...item,
      uid: item.id || index,
      name: item.oldFileName || ''
    }
    fileList.push(obj);
  });
  return fileList;
};

class PicturesWall extends React.Component {
  constructor(props) {
    super(props);
    const {dataSource, maxImgLen, form, name} = props;
    const maxLen = maxImgLen === undefined
      ? 1
      : maxImgLen;
    const fileList = setFileList(dataSource, maxImgLen);
    this.state = {
      maxImgLen: maxLen, // 上传图片最大数量
      form,
      name,
      fileList,
      loading: false,
      previewVisible: false,
      previewImage: '',
      previewType: 1,
      isFirst: true
    };
  }

  componentDidMount() {
    const {canDrag} = this.props;
    if (canDrag === 1) this.handleDrag();
  }

  // 同步更新父组件图片值
  componentWillReceiveProps(nextProps) {
    const {dataSource, maxImgLen} = nextProps;
    const {isFirst} = this.state;
    const {fileList: flist} = this.state;
    let fileList = [];
    if (flist && flist.length < 1) {
      fileList = setFileList(dataSource, maxImgLen);
    } else {
      fileList = flist;
    }
    if (isFirst && fileList.length > 0) {
      this.setFormValue(fileList);
      this.setState({fileList, isFirst: false});
    }
  }

  // 设置表单 (maxImgLen=1 的时候传回一个字符串, maxImgLen > 1 的时候传回一个数组)
  setFormValue = newImageList => {
    const {maxImgLen, name, form} = this.state;
    let formList = [];
    if (maxImgLen > 1) {
      newImageList.forEach(item => {
        formList.push(item.url);
      });
    } else {
      formList = newImageList.length > 0
        ? newImageList[0].url
        : '';
    }
    form.setFieldsValue({[name]: formList});
  };

  // 取消预览
  handleCancel = () => this.setState({previewVisible: false})

  // 预览
  handlePreview = file => {
    if(file.name.indexOf('doc') > 0 || file.name.indexOf('docx') > 0 || file.name.indexOf('pdf') > 0 || file.name.indexOf('xls') > 0 || file.name.indexOf('xlsx') > 0 || file.name.indexOf('ppt') > 0 || file.name.indexOf('pptx') > 0){
      return
    }
    let previewType = 1
    let previewImage = file.response && file.response.data || file.url || file.thumbUrl
    if(file.type === 'video/mp4' || file.data){
      previewType = 2
      previewImage = file.response && file.response.data || file.data
    }else{
      if (file.url) {
        const temp = file.url.split('.')
        previewType = temp[temp.length - 1] === 'mp4' ? 2 : 1
      }
    }

    this.setState({
      previewImage,
      previewVisible: true,
      previewType
    });
  }

  // 删除图片
  handleDeleteImg = file => {
    const {onChangeFile} = this.props;
    const {fileList} = this.state;
    const index = fileList.indexOf(file);
    const newImageList = fileList.slice();
    newImageList.splice(index, 1);
    this.setState({fileList: newImageList});
    this.setFormValue(newImageList);
    if (onChangeFile)
      onChangeFile(newImageList);
    };


  // 拖拽事件
  handleDrag = () => {
    let isDown = false; // mousedown 状态
    const uploadContainer = document.querySelector('.ant-upload-list');
    uploadContainer.style.position = 'relative';
    uploadContainer.onmousedown = e => {
      // 屏蔽鼠标右键和中键点击
      if (e.button !== 0) return;
      const touchdom = e.target;
      // 长按才能拖动, 以免误操作, 长按时间为 300ms
      let delayTimer = null;
      // canDrag: 是否能拖动当前目标, i svg path 当用户点击预览和删除时不执行拖动
      let canDrag =
        touchdom.nodeName !== 'i' &&
        touchdom.nodeName !== 'svg' &&
        touchdom.nodeName !== 'path' &&
        touchdom.className.indexOf('ant-upload-list-item') !== -1;
      if (!canDrag) {
        return;
      }
      const dom =
        touchdom.className.indexOf('ant-upload-list-item-info') === 0
          ? touchdom.parentNode
          : touchdom;
      // 临时占位 DIV
      const tempDiv = document.createElement('div');
      tempDiv.className = `ant-upload-list-item ${styles.tempDiv}`;
      const left = dom.offsetLeft;
      clearTimeout(delayTimer);
      delayTimer = setTimeout(() => {
        dom.style.position = 'absolute';
        dom.style.left = `${left}px`;
        dom.style.zIndex = 9999;
        dom.style.opacity = 0.5;
        uploadContainer.insertBefore(tempDiv, dom.nextSibling);
        isDown = true;
      }, 300);
      // 获取当前拖动目标索引
      const itemList = uploadContainer.querySelectorAll('.ant-upload-list-item');
      const lists = Array.from(itemList);
      const index = lists.indexOf(dom);
      // 设置参数 direction: 拖动方向, stance: 计算位置的单位距离(目标宽度+margin距离), moveToIndex: 释放鼠标时的位置
      let direction = 'left';
      const stance = dom.offsetWidth + 8;
      let moveToIndex = null;
      const x = e.clientX;
      let lastIndex = -1;
      document.onmousemove = event => {
        if (isDown === false) {
          clearTimeout(delayTimer);
          return;
        }
        const nx = event.clientX;
        // nl: 目标被拖动位置 = 当前鼠位置 - 鼠标点击位置 + 目标初始位置
        const nl = nx - x + left;
        dom.style.left = `${nl}px`;
        if (nx < x) {
          direction = 'left';
        } else {
          direction = 'right';
        }
        // deviation: 根据拖动方向设置不同的偏移值,提高拖动的精准度
        const deviation = direction === 'left' ? 0 : stance;
        moveToIndex = Math.max(
          0,
          Math.min(lists.length, parseInt((nl + deviation + stance / 2) / stance, 10))
        );
        // 判断位置是否有改变, 减少dom插入操作
        if (moveToIndex !== lastIndex) {
          lastIndex = moveToIndex;
          uploadContainer.insertBefore(tempDiv, itemList[moveToIndex]);
        }
      };
      document.onmouseup = () => {
        clearTimeout(delayTimer);
        if (canDrag && isDown && uploadContainer && tempDiv) {
          dom.removeAttribute('style');
          uploadContainer.removeChild(tempDiv);
          if (moveToIndex !== null && moveToIndex !== index) {
            const { fileList } = this.state;
            const newFile = fileList.splice(index, 1);
            const directionIndex = direction === 'left' ? 0 : 1;
            fileList.splice(moveToIndex - directionIndex, 0, newFile[0]);
            this.setFileList(fileList);
          }
        }
        // 强制把两状态设为 false, 以防意外...
        canDrag = false;
        isDown = false;
      };
    };
  };

   // 拖拽后重新设置图片
   setFileList = newFileList => {
    const { name, onChange } = this.props;
    const fileList = [];
    newFileList.forEach((item) => {
      fileList.push(item);
    });
    this.setFormValue(fileList);
    this.setState({
      fileList
    });
    if (onChange) {
      onChange(name, fileList);
    }
  };


  // 上传图片事件
  handleChange = e => {
    let {acceptType} = this.props
    if(!acceptType){
      acceptType = '.jpg, .gif, .jpeg, .png, .mp4'
    }
    const {fileList, file} = e
    const temp = file.name.split('.')
    const fileType = temp[temp.length-1]
    if(!acceptType.includes(fileType)) {
      message.error(`请选择正确的文件格式${acceptType}`)
      return
    }
    fileList.forEach(item => {
      if(item.thumbUrl === ''){
        item.thumbUrl = VideoImg
      }
    })
    const {name, onChange} = this.props
    this.setState({fileList})
    onChange(name, fileList)
  }

  render() {
    const {previewVisible, previewImage, previewType, fileList, maxImgLen} = this.state;
    const {acceptType, disabled, listType} = this.props
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">上传</div>
      </div>
    );
    const uploadFileButton = (
      <Button>
        <Icon type="upload"/>点击上传
      </Button>
    )
    const props = {
      action: UPLOAD_URL,
      onPreview: this.handlePreview,
      onChange: this.handleChange,
      fileList,
      multiple: true,
      accept: acceptType || '.jpg, .gif, .jpeg, .png, .mp4',
      listType: listType || 'picture-card'
    }
    return (
      <div className="clearfix">{} < Upload
          {
        ...props}
          disabled={disabled}
                                   > {listType === 'text'
          ? uploadFileButton
          : fileList.length >= maxImgLen
            ? null
            : uploadButton}
      </Upload>
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
    </div>
    );
  }
}
export default PicturesWall
