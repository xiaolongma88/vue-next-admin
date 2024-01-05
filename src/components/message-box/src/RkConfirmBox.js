import { ElMessageBox } from 'element-plus'

export default function RkConfirmBox ({
  title, content, type, draggable, onSubmit, onCancel, beforeClose
}) {
  ElMessageBox.confirm(
    content,
    title,
    {
      type: type || 'warning',
      showClose: false,
      customClass: 'rk-message-box-confirm',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnClickModal: false,
      draggable: draggable === undefined ? false : draggable,
      beforeClose: beforeClose
    }
  ).then(() => {
    onSubmit()
  }).catch(() => {
    onCancel()
  })
}

