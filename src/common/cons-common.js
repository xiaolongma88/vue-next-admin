/*
 * @Author: ljc
 * @Date: 2023-06-20 14:19:46
 * @LastEditors: g05047
 * @LastEditTime: 2023-10-19 16:27:34
 * @Description: file content
 */

// ----- 定义工作流任务相关的常量数据
export const WF_TASK_SEND_AUDIT = {
  value: 1, label: '送审'
}
export const WF_TASK_AUDIT = {
  value: 2, label: '审核', alias: '上报'
}
export const WF_TASK_CANCEL = {
  value: 3, label: '撤销'
}
export const WF_TASK_BACK = {
  value: 4, label: '退回'
}

export const YEAR_LIST = {
  getYearList(start, end) {
    let config = { start: start, end: end };
    var nowYear = new Date().getUTCFullYear();//当前年份
    var startYear = nowYear + config.start;//起始年份
    var endYear = nowYear + config.end;//结束年份，默认为当前年份

    var jsonstr = [];
    for (var i = startYear; i <= endYear; i++) {
      var arr = { "id": i, "value": i, "label": i };
      jsonstr.push(arr);
    }
    return jsonstr;
  },
}

