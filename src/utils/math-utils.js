
import IsUtils from '@/utils/is-utils.js'
/*
 * @Author: ljc
 * @Date: 2022-10-14 10:11:40
 * @LastEditTime: 2023-04-24 18:08:19
 * @Description: 计算加减乘除方法
 */
const MathUtils = {
    //设置小数点精度位数
    precision: 6,
    /**
     * 所有数据求和
     * @param {*} data  总数据
     * @param {*} field 需要传的参数取值
     * @returns  total 返回总数
     */
    mathSum(data, field, precision = MathUtils.precision) {
        let total = 0.000000
        if (field && field != '') {
            data.forEach(row => {
                total = MathUtils.mathAdd(total, row[field] ?? 0.000000, precision)
            })
        } else {
            total = 0.000000
        }
        return precision ? MathUtils.getToFixNum(total, precision) : total
    },
    /**
     * 数字相加
     * @param {*} arg1
     * @param {*} arg2
     * @param {*} precision  小数点位数 (6位)
     * @returns
     */
    mathAdd(arg1, arg2, precision = MathUtils.precision) {
        if (!(IsUtils.isNotEmpty(arg1) && IsUtils.isNotEmpty(arg2))) return
        const num = MathUtils.changeNum(arg1, arg2)
        return precision ? MathUtils.getToFixNum(num, precision) : num
    },
    /**
     * 数字相减
      * @param {*} arg1
     * @param {*} arg2
     * @param {*} precision  小数点位数 (6位)
     * @returns
     */
    mathSub(arg1, arg2, precision = MathUtils.precision) {
        if (!(IsUtils.isNotEmpty(arg1) && IsUtils.isNotEmpty(arg2))) return
        const num = MathUtils.changeNum(arg1, arg2, false)
        return precision ? MathUtils.getToFixNum(num, precision) : num
    },
    /**
     * 数字相乘
    * @param {*} arg1
     * @param {*} arg2
     * @param {*} precision  小数点位数 (6位)
     * @returns
     */
    mathMul(arg1, arg2, precision = MathUtils.precision) {
        if (!(IsUtils.isNotEmpty(arg1) && IsUtils.isNotEmpty(arg2))) return
        let m = 0;
        m = MathUtils.mathAdd(m, MathUtils.getDecimalLength(arg1))
        m = MathUtils.mathAdd(m, MathUtils.getDecimalLength(arg2))
        const num = MathUtils.getNum(arg1) * MathUtils.getNum(arg2) / Math.pow(10, m)
        return precision ? MathUtils.getToFixNum(num, precision) : num
    },

    /**
     * 数字相除
      * @param {*} arg1
     * @param {*} arg2
     * @param {*} precision  小数点位数 (6位)
     * @returns
     */
    mathDiv(arg1, arg2, precision = MathUtils.precision) {
        if (!(IsUtils.isNotEmpty(arg1) && IsUtils.isNotEmpty(arg2))) return
        let t1, t2;
        t1 = MathUtils.getDecimalLength(arg1)
        t2 = MathUtils.getDecimalLength(arg2)
        let num = 0
        if (t1 - t2 > 0) {
            num = (MathUtils.getNum(arg1) / MathUtils.getNum(arg2)) / Math.pow(10, t1 - t2)
            return precision ? MathUtils.getToFixNum(num, precision) : num
        } else {
            num = (MathUtils.getNum(arg1) / MathUtils.getNum(arg2)) * Math.pow(10, t2 - t1)
            return precision ? MathUtils.getToFixNum(num, precision) : num
        }
    },
    changeNum(arg1 = '', arg2 = '', isAdd = true) {
        function changeInteger(arg, r, maxR) {
            if (r != maxR) {
                let addZero = ''
                for (let i = 0; i < maxR - r; i++) {
                    addZero += '0'
                }
                arg = Number(arg.toString().replace('.', '') + addZero)
            } else {
                arg = MathUtils.getNum(arg)
            }
            return arg
        }
        let r1, r2, maxR, m;
        r1 = MathUtils.getDecimalLength(arg1)
        r2 = MathUtils.getDecimalLength(arg2)
        maxR = Math.max(r1, r2)
        arg1 = changeInteger(arg1, r1, maxR)
        arg2 = changeInteger(arg2, r2, maxR)
        m = Math.pow(10, maxR)
        if (isAdd) {
            return (arg1 + arg2) / m
        } else {
            return (arg1 - arg2) / m
        }
    },
    getDecimalLength(arg = '') {
        try {
            return arg.toString().split(".")[1].length
        } catch (e) {
            return 0
        }
    },
    getNum(arg = '') {
        return Number(arg.toString().replace(".", ""))
    },
    /**
     * 转换小数点6位
     * @param {*} arg1
     * @param {*} precision  小数点位数 (6位)
     * @returns  Number
     */
    getToFixNum(arg = '', precision = MathUtils.precision) {
        return precision ? Number(Number(arg).toFixed(precision)) : Number(arg)
    }
}
export default MathUtils