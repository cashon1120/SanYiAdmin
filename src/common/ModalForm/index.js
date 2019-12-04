import React from 'react'
import { Form, Modal, Select, DatePicker, Input, Radio, Row, Col, InputNumber, TreeSelect } from 'antd'
import TreeCheck from './TreeCheck'
import { legalStr } from '@/utils/utils'

const FormItem = Form.Item
const { RangePicker } = DatePicker
const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input
const ModalForm = Form.create()(props => {
  const {
    form,
    title,
    width,
    okText,
    cancelText,
    zIndex,
    visible,
    confirmLoading,
    onOk,
    onCancel,
    isfooter
  } = props
  const columns = props.columns.filter(
    item => item && item.showStatu !== 'hide' && item.showStatu !== 'hideModal'
  )
  const { TreeNode } = TreeSelect

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return
      // form.resetFields()
      onOk(fieldsValue, form)
    })
  }

  const treeSelectNode = (treeList = [], valueKey, nameKey, conentKey, upVal) =>
    treeList &&
    treeList.map(item => {
      const val = upVal ? `${upVal}-${item[valueKey || 'value']}` : item[valueKey || 'value']
      return (
        <TreeNode
            disabled={item.disabled}
            key={`treeListIndex${val}`}
            title={item[nameKey || 'name']}
            value={val}
        >
          {(obj => {
            if (obj[conentKey || 'content']) {
              return treeSelectNode(obj[conentKey || 'content'], valueKey, nameKey, conentKey, val)
            }
            return ''
          })(item)}
        </TreeNode>
      )
    })

  const onDefaultCancel = () => form.resetFields()

  const footer = {}
  if (isfooter === 0) {
    footer.footer = null
  }

  return (
    <Modal
        destroyOnClose
        {...footer}
        cancelText={cancelText || '取消'}
        confirmLoading={confirmLoading || false}
        okText={okText || '确定'}
        onCancel={onCancel || onDefaultCancel}
        onOk={okHandle}
        title={title || ''}
        visible={visible || false}
        width={width || 560}
        zIndex={zIndex || 1000}
    >
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          type="flex"
      >
        {columns.map(item => {
          let rulesObj = []
          if (
            item.componentType === 'Select' ||
            item.componentType === 'Radio' ||
            item.componentType === 'TreeSelect' ||
            item.componentType === 'TreeSelectForDj' ||
            item.componentType === 'DatePicker' ||
            item.componentType === 'RangePicker' ||
            item.componentType === 'Upload' ||
            item.componentType === 'AreaCascader' ||
            // item.componentType === 'InputNumber' ||
            item.componentType === 'Cascader'
          ) {
            // 这些类型的规则如果加了 min 和 validator 要出问题...
            rulesObj = [
              {
                required: item.required || false,
                message: item.requiredMessage || ''
              }
            ]
          } else {
            rulesObj = [
              {
                required: item.required || false,
                message: item.requiredMessage || '',
                whitespace: true,
                min: item.requiredmin || 1,
                validator: item.validator || false
              }
            ]
            if (item.componentType === 'Input' && !item.noPattern) {
              rulesObj.push({
                pattern: legalStr,
                message: '请输入合法的字符'
              })
            }
            if (item.priceRange) {
              delete rulesObj[0].validator
              rulesObj.push({
                validator: item.validator || false
              })
            }
            if (item.componentType === 'InputNumber' && !item.validator) {
              delete rulesObj[0].min
              delete rulesObj[0].validator
            }
          }
          return (
            <Col key={item.title}
                md={item.col || 23}
                sm={(item.col || 23) * 3}
            >
              <FormItem
                  className={item.className}
                  extra={item.extra || ''}
                  label={item.title}
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 15 }}
              >
                {form.getFieldDecorator(item.dataIndex, {
                  rules: rulesObj,
                  initialValue: item.initialValue
                })(
                  (fItem => {
                    let componentTem = (
                      <Input
                          className={fItem.childclassName}
                          disabled={fItem.disabled}
                          onBlur={e => fItem.onBlur && fItem.onBlur(e, form)}
                          placeholder={fItem.placeholder ? fItem.placeholder : '请输入'}
                      />
                    )
                    if (fItem.componentType === 'Select') {
                      componentTem = (
                        <Select
                            className={fItem.childclassName}
                            disabled={fItem.disabled}
                            mode={fItem.multiple ? 'multiple' : ''}
                            onChange={(text, e) => {
                            if (fItem.validatorSelect) {
                              fItem.handleChange(text, e, form)
                            } else if (fItem.handleChange) {
                              fItem.handleChange(text, e, form)
                            }
                          }}
                            placeholder={fItem.placeholder ? fItem.placeholder : '请选择'}
                            style={{ width: '100%' }}
                        >
                          {fItem.dataSource.map(selData => (
                            <Option
                                key={`selectIndex${selData.value || selData.id}`}
                                value={selData.value || selData.id || selData.assemblyComponentId}
                            >
                              {selData.name || selData.assemblyComponentName || selData.componentName || (fItem.selectName && selData[fItem.selectName])}
                            </Option>
                          ))}
                        </Select>
                      )
                    } else if (fItem.componentType === 'DatePicker') {
                      const formatRangePicker = {}
                      if (fItem.showTime) {
                        formatRangePicker.showTime = fItem.showTime
                      }
                      if (fItem.format) {
                        formatRangePicker.format = fItem.format
                      }
                      componentTem = (
                        <DatePicker
                            disabled={fItem.disabled}
                            placeholder=""
                            style={{ width: '100%' }}
                            {...formatRangePicker}
                        />
                      )
                    } else if (fItem.componentType === 'RangePicker') {
                      const formatRangePicker = {}
                      if (fItem.showTime) {
                        formatRangePicker.showTime = fItem.showTime
                      }
                      if (fItem.format) {
                        formatRangePicker.format = fItem.format
                      }
                      componentTem = (
                        <RangePicker
                            disabled={fItem.disabled}
                            placeholder=""
                            style={{ width: '100%' }}
                            {...formatRangePicker}
                        />
                      )
                    } else if (fItem.componentType === 'Radio') {
                      componentTem = (
                        <RadioGroup
                            disabled={fItem.disabled}
                            onChange={
                            fItem.onChange
                              ? e => {
                                  fItem.onChange(e, form)
                                }
                              : ''
                          }
                            placeholder="请选择"
                        >
                          {fItem.dataSource.map(selData => (
                            <Radio key={`selectIndex${selData.value}`}
                                value={selData.value}
                            >
                              {selData.name}
                            </Radio>
                          ))}
                        </RadioGroup>
                      )
                    } else if (fItem.componentType === 'Input') {
                      componentTem = (
                        <Input
                            addonAfter={fItem.addonAfter}
                            addonBefore={fItem.addonBefore}
                            className={fItem.childclassName}
                            disabled={fItem.disabled}
                            placeholder={fItem.placeholder ? fItem.placeholder : '请输入'}
                            type={fItem.type ? fItem.type : 'text'}
                        />
                      )
                    } else if (fItem.componentType === 'TextArea') {
                      componentTem = (
                        <TextArea
                            autosize={fItem.autosize}
                            className={fItem.childclassName}
                            disabled={fItem.disabled}
                            name={fItem.dataIndex}
                            placeholder={fItem.placeholder ? fItem.placeholder : '请输入'}
                        />
                      )
                    } else if (fItem.componentType === 'InputNumber') {
                      componentTem = (
                        <InputNumber
                            className={fItem.childclassName}
                            disabled={fItem.disabled}
                            formatter={fItem.formatter}
                            min={0}
                            name={fItem.dataIndex}
                            onChange={e => fItem.onChange && fItem.onChange(e, form)}
                            placeholder={fItem.placeholder ? fItem.placeholder : '请输入'}
                            style={{ width: '100%' }}
                        />
                      )
                    } else if (fItem.componentType === 'PassWorld') {
                      componentTem = (
                        <Input
                            className={fItem.childclassName}
                            name={fItem.dataIndex}
                            placeholder={fItem.placeholder ? fItem.placeholder : '请输入'}
                            style={{ width: '100%' }}
                            type="password"
                        />
                      )
                    } else if (fItem.componentType === 'TreeSelect') {
                      componentTem = (
                        <TreeSelect
                            className={fItem.childclassName}
                            disabled={fItem.disabled}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            onChange={fItem.onChange}
                            placeholder={fItem.placeholder ? fItem.placeholder : '请选择'}
                            style={{ width: '100%' }}
                            treeData={fItem.dataSource}
                            treeDefaultExpandAll
                        />
                      )
                    } else if (fItem.componentType === 'TreeSelectForDj') {
                      componentTem = (
                        <TreeSelect
                            allowClear
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            filterTreeNode={(input, treeNode) => {
                            const node = treeNode
                            return node.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }}
                            placeholder="请选择"
                            showSearch={fItem.showSearch}
                            style={{ width: '100%' }}
                            treeDefaultExpandAll
                          // onChange={fItem.onChange}
                        >
                          {treeSelectNode(
                            fItem.dataSource || [],
                            fItem.valueKey || '',
                            fItem.nameKey || '',
                            fItem.conentKey || ''
                          )}
                        </TreeSelect>
                      )
                    } else if (fItem.componentType === 'TreeCheck') {
                      componentTem = (
                        <TreeCheck form={form}
                            name={fItem.dataIndex}
                            treeData={fItem.dataSource}
                        />
                      )
                    } else if (fItem.componentType === 'TableChoose') {
                      componentTem = fItem.renderTable()
                    } else if (fItem.render) {
                      componentTem = fItem.render()
                    }
                    return componentTem
                  })(item)
                )}
              </FormItem>
            </Col>
          )
        })}
      </Row>
    </Modal>
  )
})

export default ModalForm
