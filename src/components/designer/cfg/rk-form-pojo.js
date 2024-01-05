/*
 * @Author: lisong
 * @Date: 2023-04-13 16:42:57
 * @LastEditors: lisong
 * @LastEditTime: 2023-04-13 18:42:23
 * @Description: 定义基础表单配置字段信息
 */
// 表单基本配置字段定义
export const FormBaseConfigPojo = {
  // 表单ID
  formId: '',
  // 表单名称
  name: '',
  // 表单编码
  code: '',
  // 表单排序
  orderNum: 1,
  // 表单备注
  remark: '',
  // 0-未启用 1-已启用
  status: 0,
  // 提交请求地址
  submitURL: '',
  // 校验规则
  validateContent: ''
}

