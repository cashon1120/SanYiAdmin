// 第一页参数配置
export const defaultPage = {
  pageNum: 1,
  pageSize: 10
};

// 获取表单上传文件, 返回服务端需要的数据格式
export function getUploadedPic(pictures, businessType) {
  let result = []
  pictures && pictures.map(item => {
    let sourceType = 1
    if (!item.sourceType) {
      sourceType = item.type.indexOf('image') > -1 ? 1 : 2 // 资源类型: 1 图片 2 文件
    }
    let picData = {}
    if (businessType) {
      picData = {
        oldFileName: item.name || item.oldFileName,
        sourceType,
        businessType,
        url: item.data ? item.data : item.response && item.response.data || item.url
      }
    } else {
      picData = {
        oldFileName: item.name || item.oldFileName,
        sourceType,
        url: item.data ? item.data : item.response && item.response.data || item.url
      }
    }
    if (item.id && item.id > 0) {
      picData.id = item.id
    }
    result.push(picData)
  })
  return result
}

// 自定义表单验证
export const validator = {
  // 验证电话
  checkPhone: (rule, value, callback) => {
    if (value && value.length > 0 && !/^1(3|4|5|7|8)\d{9}$/.test(value)) {
      callback('手机号码有误，请重填');
    } else {
      callback();
    }
  },

  // 两次密码
  twicePassword: (rule, value, callback) => {
    if (value && value.length > 0 && !/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value)) {
      callback('邮箱输入有误，请重填');
    } else {
      callback();
    }
  },

  // 验证身份证
  checkIdcard: (rule, value, callback) => {
    if (value && value.length > 0 && !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
      callback('身份证有误，请重填');
    } else {
      callback();
    }
  }
}

// 设置资源格式
export function formatTreeNode(data, sort) {
  let result = []
  data.map(item => {
    if (item.parentId === 0) {
      result.push({
        ...item,
        title: item.name,
        key: item.id.toString()
      })
    }
  })
  // 是否排序
  if (sort) {
    result.sort((a, b) => {
      return a.orderNum - b.orderNum
    })
  }
  const subMenu = data.filter(item => item.parentId !== 0)
  subMenu.map((item) => {
    for (let i = 0; i < result.length; i += 1) {
      if (item.parentId === result[i].id) {
        if (!result[i].children) {
          result[i].children = []
        }
        result[i].children.push({
          ...item,
          title: item.name,
          key: item.id.toString()
        })
      }
    }
  })
  subMenu.map((item) => {
    for (let i = 0; i < result.length; i += 1) {
      if (result[i].children) {
        for (let j = 0; j < result[i].children.length; j += 1) {
          if (item.parentId === result[i].children[j].id) {
            if (!result[i].children[j].children) {
              result[i].children[j].children = []
            }
            result[i].children[j].children.push({
              ...item,
              title: item.name,
              key: item.id.toString()
            })
          }
        }
      }
    }
  })
  return result
}

// 判断按钮权限
export function getButtonAuth(id) {
  const auth = JSON.parse(localStorage.getItem('userAuth'))
  let hasAuth = false
  if (auth) {
    for (let i = 0; i < auth.length; i += 1) {
      if (auth[i].id === id) {
        hasAuth = true
      }
    }
  }
  return hasAuth
}

export function replaceHtml(html){
  if(!html) return
  html = html.replace(/\n|\r\n/g, '<br/>')
  return html
}

export const legalStr = /^[A-Za-z0-9\u4e00-\u9fa5\_\#\@\.\:\\\/]+$/;

// 下面两个方法都是为了"设计雷区要点"后面的需求强行植入的,
//formartPicture 格式化返回来的数据
export function formartPicture(influenceFactorPictureArray, type){
  const influenceFactorPicture = []
  influenceFactorPictureArray.forEach(item => {
    const picInfo = {
      id: item.id,
      businessType: item.businessType,
      oldFileName: item.oldFileName,
      sourceType: item.sourceType,
      url: item.url
    }
    const _temp = influenceFactorPicture.find(list => list.remark === item.remark)
    if (!_temp) {
      if(item.url) {
        if(type === 2){
          influenceFactorPicture.push({remark: item.remark, remark2: item.remark2, pictures: [picInfo]})
        }else{
          influenceFactorPicture.push({remark: item.remark, pictures: [picInfo]})
        }
      }else{
        if(type === 2){
          influenceFactorPicture.push({remark: item.remark, remark2: item.remark2, pictures: []})
        }else{
          influenceFactorPicture.push({remark: item.remark, pictures: []})
        }
      }
    } else {
      for (let i = 0; i < influenceFactorPicture.length; i += 1) {
        if (influenceFactorPicture[i].remark === item.remark && item.url) {
          influenceFactorPicture[i].pictures.push({...picInfo})
        }
      }
    }
  })
  return influenceFactorPicture
}

// setPictureParams 设置上传前的参数
export function setPictureParams(influenceFactorPicture, type){
  let influenceFactorPictureArray = []
  influenceFactorPicture.forEach(item => {
    if (item.remark !== '') {
      const _pic = getUploadedPic(item.pictures, 5)
      if (_pic.length > 0) {
        _pic.forEach(pic => {
          if(type === 2){
            influenceFactorPictureArray.push({
              remark: item.remark,
              remark2: item.remark2,
              ...pic
            })
          }else{
            influenceFactorPictureArray.push({
              remark: item.remark,
              ...pic
            })
          }

        })
      } else {
        if(type === 2){
          influenceFactorPictureArray.push({
            remark: item.remark,
            remark2: item.remark2
          })
        }else{
          influenceFactorPictureArray.push({
            remark: item.remark
          })
        }
      }
    }
  })
  return influenceFactorPictureArray
}