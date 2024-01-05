/*
 * @Author: ljc
 * @Date: 2023-06-09 10:21:41
 * @LastEditors: g05047
 * @LastEditTime: 2023-06-09 14:29:47
 * @Description: 单位管理枚举
 */

import { UNIT_STATUS_ENUMS } from '@/enums/enums-system.js'


export const UNIT_STATUS = {
  OPEN: UNIT_STATUS_ENUMS.options['1'].value.toString(),
  STOP: UNIT_STATUS_ENUMS.options['0'].value.toString()
}

export default {
  label: '单位相关',
  value: 'unit'
}