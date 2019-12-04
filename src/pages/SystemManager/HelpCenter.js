import React, {PureComponent} from 'react'
import styles from '../../layouts/global.less'
import {Link} from '../../common/Plugins'
import {Tree, Card} from 'antd';
import imgO1 from '../../assets/imgs/0-1.png'
import imgO2 from '../../assets/imgs/0-2.png'
import imgO3 from '../../assets/imgs/0-3.png'
import img11 from '../../assets/imgs/1-1.png'
import img12 from '../../assets/imgs/1-2.png'
import img13 from '../../assets/imgs/1-3.png'


const {TreeNode} = Tree;

class HelpCenter extends PureComponent {
  state = {
    data: [],
    activeKey: ''
  }

  componentDidMount() {

  }
  onSelect = (selectedKeys) => {
    this.setState({
      activeKey: selectedKeys[0]
    })
  };
  render() {
    const { activeKey } = this.state
    return (
      <Card style={{margin:20}}>
        <div className={styles.helpCenter}>
          <h1 style={{fontSize: 28, borderBottom: '1px solid #ebebeb', paddingBottom: 15}}>帮助手册</h1>
          <div className={styles.helpLeft}>
            <Tree defaultExpandAll
                onSelect={this.onSelect}
                showLine
            >
              <TreeNode key="0"
                  title="整车系统架构管理"
              >
              </TreeNode>
              <TreeNode key="1"
                  title="故障模式"
              ></TreeNode>
              <TreeNode key="2"
                  title="点检表"
              ></TreeNode>
              <TreeNode key="3"
                  title="模板下载"
              ></TreeNode>
            </Tree>
          </div>
          <div className={styles.helpRight}
              ref="helpData"
          >
            <div style={{display: activeKey === '' ? 'block' : 'none', paddingTop:5}}>
            <h3>手册说明</h3>
              因网站很多功能模块操作模式基本一致, 这里只用部分功能做演示, 其它同功能模块可参考本手册, 更多详细信息请
              {/* <a href={helpWord}>下载操作手册</a> */}
              <a href="/static/三一知识点检库系统文档.docx">下载操作手册</a>
            </div>

            <div style={{display: activeKey === '0' ? 'block' : 'none', paddingTop:5}}>
              整车系统分系统管理,总成管理和核心零部件管理三个模块, 操作方式大同小异, 下面以"系统管理"举例:
              <h3>查询项</h3>
              <ul>
                <li>1、 整车系统（单选项）：上传系统、底盘系统。</li>
                <li>2、 系统名称（输入项）：手动输入对应整车系统选择项下的系统名称。</li>
                <li>3、 有无附件：单选项。当选择有时，单击查询按钮，查询出有附件的数据。当选择无时，单击查询按钮，查询出无附件的数据。默认为所有数据。</li>
              </ul>
              <h3>操作项</h3>
              <ul>
                <li>1、	新建：单击新建时，弹出如下页面。新建（整车系统下的系统下的）总成部件
                  <dl>
                    <dd>1)	整车系统：单选项。可以选择上装系统，底盘系统。必选项。</dd>
                    <dd>2)	系统名称：单选项（整车系统中上装系统、底盘系统下的）系统名称。必选项。</dd>
                    <dd>3)	总成部件：手动输入名称。必输项。</dd>
                    <dd>4)	总成部件图片/视频：上传对应系统的图片，视频。可以上传多张图片。必传项。</dd>
                    <dd>5)	标准、原理、基于标准的具体化数据参数：输入文本向。</dd>
                    <dd>6)	标准原理及图片：上传对应图片，可以上传多张。</dd>
                    <dd>7)	设计雷区、要点：输入文本项。</dd>
                    <dd>8)	设计雷区，要点影响因素说明：输入文本项。</dd>
                    <dd>9)	设计雷区，要点及影响因素图片：上传对应图片，可以上传多张。</dd>
                    <dd>10)	继续添加设计雷区要点：单击此按钮可以继续添加以下三项内容：“设计雷区、要点” 、“设计雷区，要点影响因素说明”、“设计雷区，要点及影响因素图片”。</dd>
                    <dd>11)	报告上传。每个报告可以上传多个。格式为Word、PDF。</dd>
                    <dd>12)	提交：判断必填项是否已经填写完成。完成则能成功提交，新建一条系统信息。</dd>
                    <dd>13)	取消：取消信息提交。</dd>

                  </dl>
                </li>
                <li>2、	下载：单击后弹出上传的附件界面。下载附件报告。
                  <img src={imgO1} />
                </li>
                <li>3、	查看：单击后查看系统信息的详细界面、操作日志。只可查看。
                  <img src={imgO2} />
                </li>
                <li>4、	修改：单击后弹出修改界面。修改数据。界面同新建界面。数据判断同新建界面数据判断。选择项“整车系统”不能修改。</li>
                <li>5、	导入：导入Excel表模板数据。做增量导入。提示出导入成功、导入失败的数据项。
                  <img src={imgO3} />
                </li>
                <li>6、	删除：判断该系统下是否有子组建（总成部件、核心零部件），有则不能删除该系统，必须先去子部件里去删除该子部件，然后才能删除该系统。没有子组件则可以删除该系统。</li>
              </ul>
            </div>

            <div style={{display: activeKey === '1' ? 'block' : 'none', paddingTop:5}}>
              本内容以"动力系统"举例
              <img src={img11} />
              <h3>查询项</h3>
              <ul>
                <li>1、	总成部件（单选项）：选择总成部件名称。</li>
                <li>2、	核心零部件（单选项）：选择核心零部件名称。</li>
                <li>3、	故障模式：手动输入故障模式名称，模糊名称。</li>
                <li>4、	状态：全部、待审核、已审核、驳回修改。</li>
              </ul>
              <h3>操作项</h3>
              <ul>
                <li>1、	新建：单击新建时，弹出如下页面。新建（整车系统下的动力系统/动力系统下的故障模式）
                  <dl>
                    <dd>A.	没有选择总成部件，没有选择核心零部件。则默认为该系统的故障模式。（举例：图中默认为动力系统的故障模式）</dd>
                    <dd>B.	选择了总成部件，没有选择核心零部件。则是总成部件的故障模式。</dd>
                    <dd>C.	选择了总成部件，选择了核心零部件。则是核心零部件的故障模式。
备注：没有选总成部件，不能直接选择核心零部件。
                    <div>
                    1）	总成部件：单选项。数据来源于“总成管理”中的总成部件名称。
                    <Link to="/chassisComponent/add/2">添加总成</Link>
                    <br/>
2）	核心零部件：单选项。数据来源于“核心零部件”中的核心零部件名称。<Link to="/chassisComponent/add/3">添加核心零部件</Link><br/>
3）	故障模式：手动输入故障模式的名称。文本内容。必填项。<br/>
4）	故障描述：文本内容。必填项。<br/>
5）	故障现场：上传故障模式对应的图片，可以上传多张。必传项。<br/>
6）	原因分析：文本内容。必填项。<br/>
7）	故障对策：文本内容。必填项。<br/>
8）	原因及对策照片：图片上传。必传项。<br/>
9）	标准、原理、基于标准的具体化数据参数：输入文本向。<br/>
10）	标准原理及图片：上传对应图片，可以上传多张。<br/>
11）	设计雷区、要点：输入文本项。<br/>
12）	设计雷区，要点及影响因素图片：上传对应图片，可以上传多张。<br/>
13）	继续添加设计雷区要点：单击此按钮可以继续添加以下二项内容：“设计雷区、要点” 、 “设计雷区，要点及影响因素图片”。<br/>
14）	故障参考信息（类型、平均里程、地域等）：文本项。<br/>
15）	提交：判断数据填写要求，符合则成功新建一条故障模式，状态为待审核。不符合则给出相应提示。<br/>
16）	取消：取消操作，返回上一界面。<br/>

                    </div>
</dd>

                  </dl>
                </li>
                <li>2、	查看：单击查看，可以查看该故障模式的详细信息，操作日志。不能修改。</li>
                <li>3、	修改：修改故障模式信息。总成部件和核心零部件不能修改。新建故障模式后，在审核之前可以修改。审核没有通过“驳回修改”后可以再次修改。否则不能修改。
                <img src={img12} />
</li>
                <li>4、	审核：审核故障模式信息，信息只能查看。只能对状态为“待审核”
                  <dl>
                    <dd>
                    1）	审核备注：填写审核备注内容，可不填写。填写内容记录到操作日志的备注里。 </dd>
                    <dd>2）	审核结果：通过、不通过。
                      <div style={{paddingLeft: 28}}>
选择“通过”。提示“操作成功”并返回上一界面，数据状态为“已审核”。已审核故障模式数据在前台展示，并能搜索出来。
选择“不通过”。提示“操作成功”并返回上一界面，数据状态为“驳回修改”。可以在操作栏进行“修改”操作。修改提交后状态为“待审核”，重新走审核流程。</div>

                    </dd>
                  </dl>
                </li>
                <li>
                5、	更新：只能对状态为“已审核”的数据进行“更新”操作。
                <img src={img13} />
                <dl>
                  <dd>备注：更新：故障模式为“已审核”状态时，单击“更新”可以对故障模式信息进行“编辑”。编辑后状态为“待审核”重新走审核流程。通过“更新”操作的版本号加0.1。初始版本号为1.0。举例：初始版本号为1.0 。成功更新一次后为1.1。</dd>
                  <dd>1）	更新时总成部件、核心零部件不能更改。</dd>
                  <dd>2）	更新提交后，状态为待审核。流程如上图所示。</dd>

                </dl>
                </li>
                <li>6、	导入：导入Excel表模板数据。做增量导入。提示出导入成功、导入失败的数据项。</li>
                <li>7、	删除：删除故障模式。成功删除后后台和前台都删除掉该故障模式。所有状态的数据都能删除。</li>
              </ul>
            </div>

            <div style={{display: activeKey === '2' ? 'block' : 'none', paddingTop:5}}>
            备注： 一种车型，一个系统为一条点检项数据。一种车型对应的多个（N）系统的点检项有（N）条数据。
            <h3>查询项</h3>
            <ul>
              <li>1、	车型（单选项）：数据来源为“码表管理”中的车型名称库。</li>
              <li>2、	系统名称（单选项）：数据来源为“码表管理”中的点检系统名称库。</li>
              <li>3、	状态（单选项）：单选项。全部、待审核、已审核、未通过（审核没有通过的状态）。</li>
            </ul>
            <h3>操作项</h3>
            <ul>
              <li>1、	新建：默认第一项为“功能点检项”
备注：功能，性能，空间，接口点检项。至少有一个点检项里要有具体的点检项目。
      <dl>
        <dd>1）	车型名称：单选项。选择一个车型。必选项。<Link to="/nameStore/pointCheckCar">添加车型</Link></dd>
        <dd>2）	点检系统名称：单选项。选择车型需要的点检系统名称。必选项。<Link to="/nameStore/pointCheckSystem">添加点检系统</Link></dd>
        <dd>3）	点检项目（单选项）：数据来源为“码表管理”中的点检项目名称库。<Link to="/nameStore/pointCheckProject">添加点检项目</Link></dd>
        <dd>4）	要求/参考阈值：手动输入内容。文本项。选择了点检项目则这里。</dd>
        <dd>5）	设置值：文本项。选择了点检项目则这里必填项。</dd>
        <dd>6）	添加点检项目：单击此项时，可以继续添加一组“点检项目”、“要求/参考阈值”、“设置值”。</dd>
        <dd>7）	下一步：单击此按钮，可以继续添加性能点检项。</dd>

      </dl>
      <b>注:性能，空间，接口点检项均按以上步骤操作</b>
</li>
              <li>3、	审核, 审核有通过/不通过两个状态</li>
              <li>4、	修改：修改点检项数据，所有数据都可以更改。修改后状态为“待审核”。</li>
              <li>5、	导入：导入Excel表模板数据。做增量导入。提示出导入成功、导入失败的数据项。</li>
            </ul>
            </div>
            <div style={{display: activeKey === '3' ? 'block' : 'none', paddingTop:5}}>
              <div><a href="/static/点检表导表.xlsx">点检表导表</a></div>
              <div><a href="/static/系统故障模式详情导表.xlsx">系统故障模式详情导表</a></div>
              <div><a href="/static/系统详情页导表.xlsx">系统详情页导表</a></div>
              <div><a href="/static/总成故障模式详情导表.xlsx">总成故障模式详情导表</a></div>
              <div><a href="/static/总成详情页导表.xlsx">总成详情页导表</a></div>
            </div>
          </div>
        </div>
      </Card>
    )
  }
}

export default HelpCenter
