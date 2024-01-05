import XEUtils from 'xe-utils'

const RKUtils = {
    /** 格式化银行账号，按4位显示 */
    formatBankNo(value) {
        if (value) {
            return value.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
        } else {
            return ''
        }
    },
    /** 格式化金额 */
    formatAmount(value, digits = 4, fillZero = true) {
        if (fillZero) {
            return XEUtils.commafy(XEUtils.toNumber(value), {digits})
        } else {
            return XEUtils.commafy(XEUtils.toNumber(value), {digits}).replace(/(?:\.0*|(\.\d+?)0+)$/, '$1')
        }
    },
    /** 格式化金额方法 */
    formatThousand: function (value, digits = 2) {
        return RKUtils.formatAmount(value, digits, true)
    },
    /** 格式化金额方法，小数点后不补零 */
    formatThousandNotFillZero: function (value, digits = 4) {
        return RKUtils.formatAmount(value, digits, false)
    },
    /** 获取GUID */
    getGuid: function () {
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        return uuid.replace(/-/g, '').toUpperCase()
    },
    formatNumber(number) {
        if (isNaN(number)) {
            return 0
        }
        return +number
    }
}

export default RKUtils
