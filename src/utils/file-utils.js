/*
 * @Author: ljc
 * @Date: 2023-04-27 13:26:58
 * @LastEditors: g05047
 * @LastEditTime: 2023-10-20 15:15:53
 * @Description: 关于文件工具方法
 *
 */
// 文件预览类型
export const fileType = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    mp3: 'audio/mpeg',
    svg: 'image/svg+xml',
    text: 'text/plain',
    bmp: 'image/bmp',
    zip: 'application/zip',
    excel: 'application/vnd.ms-excel',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    avi: 'video/x-msvideo',
    js: 'text/javascript',
    mpeg: 'video/mpeg',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    rar: 'application/x-rar-compressed',
    xls: "application/vnd.ms-excel",
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xml: 'text/xml',
    json: 'application/json',
    jsonld: 'application/ld+json',
    jar: 'application/java-archive',
    htm: 'text/html',
    html: 'text/html',
    css: 'text/css',
}
/**
 * 文件下载
 *
 * @param {Object} options 配置参数
 * @returns {Object} 
 * data: 文件流 
 * fileName: 文件名(有值不需要从请求头拿)
 * type: 文件类型
 * res: 后台返回结果
 */
export function dowloadFile(data, fileName = "", type, res = {}) {
    let blob = new Blob([data], { type });
    const { size } = blob;
    if (size > 0 && !fileName && res) {
        const { headers } = res
        let contentDisposition = headers["content-disposition"];
        let targetKey = ";filename=";
        let targetKeyLen = targetKey.length;
        let contentLen = contentDisposition.length;
        let startIndex = contentDisposition.indexOf(targetKey) + targetKeyLen;
        let endIndex = contentLen;
        fileName = decodeURI(contentDisposition.substring(startIndex, endIndex));
    }
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
        let objectUrl = (window.URL || window.webkitURL).createObjectURL(
            blob
        );
        let downFile = document.createElement("a");
        downFile.style.display = "none";
        downFile.href = objectUrl;
        downFile.download = fileName; // 下载后文件名
        document.body.appendChild(downFile);
        downFile.click();
        document.body.removeChild(downFile); // 下载完成移除元素 // window.location.href = objectUrl
        window.URL.revokeObjectURL(objectUrl); // 只要映射存在，Blob就不能进行垃圾回收，因此一旦不再需要引用，就必须小心撤销URL，释放掉blob对象。
    }
}
// 文件预览
export function previewFile(data, type) {
    let blob = new Blob([data], { type });
    let url = (window.URL || window.webkitURL).createObjectURL(blob)
    return url
}
//预览打开新网页
export function openNewWindow(url, title) {
    const win = window.open(url, "_blank")
    win.document.title = title
    // const iframe = document.createElement('iframe')
    // iframe.src = url
    // iframe.style.width = '100%'
    // iframe.style.height = '100%'
    // iframe.style.margin = '0'
    // iframe.style.padding = '0'
    // iframe.style.overflow = 'hidden'
    // iframe.style.border = 'none'
    // win.document.body.style.margin = '0'
    // win.document.body.appendChild(iframe)
}
/**
 * 字节转换显示
 *
 * @param {Object} options 配置参数
 * @returns {Object} 
 * size: 是默认是kb
 */
export function formatDataFileSize(size) {
    size = size * 1024.00
    if (!size)
        return "";
    var num = 1024.00
    if (size < num)
        return size + "B";
    if (size < Math.pow(num, 2))
        return (size / num).toFixed(2) + "KB"; //kb
    if (size < Math.pow(num, 3))
        return (size / Math.pow(num, 2)).toFixed(2) + "M"; //M
    if (size < Math.pow(num, 4))
        return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
    return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
}
export function downloadFunc(href, filename) {
    if (href && filename) {
      let a = document.createElement("a");
      a.download = filename; //指定下载的文件名
      a.href = href; //  URL对象
      a.click(); // 模拟点击
      URL.revokeObjectURL(a.href); // 释放URL 对象
    }
  }