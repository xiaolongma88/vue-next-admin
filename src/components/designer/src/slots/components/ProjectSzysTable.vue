<!--
 * @Author: lisong
 * @Date: 2023-04-17 16:22:20
 * @LastEditors: g05047
 * @LastEditTime: 2023-06-30 16:12:56
 * @Description: 收支预算表格
-->
<template>
	<rk-grid
		ref="rkGridRef"
		title="收支预算明细（单位：万元）"
		:data="tableData"
		:seqConfig="false"
		:toolbarConfig="true"
		:pagerConfig="false"
		:editConfig="!editDisable"
		:keepSource="true"
		:columns="columns"
	>
		<template #toolbar_title_buttons v-if="!editDisable">
			<el-button type="primary" plain @click="interestCalculation">利息测算 </el-button>
			<el-button type="primary" plain @click="modelDownload"> 模板下载 </el-button>
			<el-button type="primary" plain @click="importFile">导入 </el-button>
			<el-button type="primary" plain @click="fillingInstructions">填报说明 </el-button>
			<input type="file" ref="fileInputRef" accept=".xls, .xlsx" style="display: none" @change="fileInputChange" />
		</template>
		<template #rk_type_name="{ row, column }">
			<div class="bgc full-size align-left">
				{{ row[column.field] }}
			</div>
		</template>
		<template #rk_formula="{ row, column }">
			<div class="bgc full-size align-left">
				{{ row[column.field] }}
			</div>
		</template>
		<template #rk_sr_input="{ row, column }">
			<div class="bgc full-size">
				{{ formatAmount(row[column.field]) }}
			</div>
		</template>
		<template #rk_zc_input="{ row, column }">
			<div class="bgc full-size">
				{{ formatAmount(row[column.field]) }}
			</div>
		</template>
		<template v-for="item in handleSlotName().srDefaults" v-slot:[item]="{ row, column }">
			<div :class="[row.TRUN_BG_COLOR === 1 ? 'bgc' : '', 'full-size']">
				{{ row.IS_SR_EDIT !== 1 ? '--' : row[column.field] ? formatAmount(row[column.field]) : '0.00' }}
			</div>
		</template>
		<template v-for="item in handleSlotName().srEdits" v-slot:[item]="{ row, column }">
			<div :class="row.TRUN_BG_COLOR === 1 ? 'bgc' : ''" class="full-size">
				<div v-if="row.IS_SR_EDIT === 1 && row.TRUN_BG_COLOR !== 1" class="full-size">
					<vxe-input v-model="row[column.field]" type="float" @blur="blurEvent(row, column)" clearable @clear="cleanEvent(row, column)"></vxe-input>
				</div>
				<div v-else class="full-size">
					{{ row.IS_SR_EDIT !== 1 ? '--' : row[column.field] ? formatAmount(row[column.field]) : '0.00' }}
				</div>
			</div>
		</template>
		<template v-for="item in handleSlotName().zcDefaults" v-slot:[item]="{ row, column }">
			<div :class="row.TRUN_BG_COLOR === 1 ? 'bgc' : ''" class="full-size">
				{{ row.IS_ZC_EDIT !== 1 ? '--' : row[column.field] ? formatAmount(row[column.field]) : '0.00' }}
			</div>
		</template>
		<template v-for="item in handleSlotName().zcEdits" v-slot:[item]="{ row, column }">
			<div :class="row.TRUN_BG_COLOR === 1 ? 'bgc' : ''" class="full-size">
				<div v-if="row.IS_ZC_EDIT === 1 && row.TRUN_BG_COLOR !== 1" class="full-size">
					<vxe-input v-model="row[column.field]" type="float" @blur="blurEvent(row, column)" @clear="cleanEvent(row, column)" clearable></vxe-input>
				</div>
				<div v-else class="full-size">
					{{ row.IS_ZC_EDIT !== 1 ? '--' : row[column.field] ? formatAmount(row[column.field]) : '0.00' }}
				</div>
			</div>
		</template>
	</rk-grid>
	<!-- <div class="app-container">
    <div class="VFormTable-container">
    </div>
  </div> -->
</template>

<script setup name="ProjectSzysTable">
import RKUtils from '@/utils/rk-utils.js';
import SzysTableData from '@/mock/SzysTableData.json';
import { ElMessage } from 'element-plus';
import { getCurrentInstance, nextTick, onBeforeMount, onMounted, ref, watch } from 'vue';
import { FILL_FORM_TYPE_CONFIG } from '@/components/designer/cfg/rk-form-conf.js';
import { dowloadFile, fileType } from '@/utils/file-utils.js';

import { useProjectApi } from '@/api';
import { useFilesSzysApi } from '@/api';

const { queryBgtBalanceByProId } = useProjectApi();
const { downloadSzysTemplate, uploadSzysFile } = useFilesSzysApi();

const { appContext } = getCurrentInstance();
const globalProxy = appContext.config.globalProperties;
// 向上触发的方法
const emits = defineEmits(['setFormItemValue']);
const formatAmount = (cellValue) => {
	return RKUtils.formatAmount(cellValue, 2, true);
};
const formatNumber = (number) => {
	return RKUtils.formatNumber(number);
};
const formulas = ref(null);
const props = defineProps({
	// 组件的名称，用于组织插槽数据，提供给表单设计器以及渲染器（必须定义）
	title: { type: String, default: '收支预算表格' },
	// 表单数据信息
	formData: { type: Object, default: {} },
	formType: { type: String },
});
const tableData = ref([]);

// 表格的模板引用
const rkGridRef = ref(null);
const fileInputRef = ref(null);
// 设置表格是否禁用编辑: 默认不禁用-false
const editDisable = ref(false);
// 允许的类型
const allowTypes = [FILL_FORM_TYPE_CONFIG.ADD.value, FILL_FORM_TYPE_CONFIG.EDIT.value];

// ----- 监听数据
// 监听表单 PRO_BUID_TERM 建设期限字段数据进行联动
watch(
	() => props.formData.PRO_BUID_TERM,
	(newValue, oldValue) => {
		handleDynamicColumn();
	},
	{ deep: false, immediate: false }
);
// 监听表单 PRO_OPER_TERM 运营期限字段数据进行联动
watch(
	() => props.formData.PRO_OPER_TERM,
	(newValue, oldValue) => {
		handleDynamicColumn();
	},
	{ deep: false, immediate: false }
);

// 监听表单 START_DATE 开工日期字段数据进行联动
watch(
	() => props.formData.START_DATE,
	(newValue, oldValue) => {
		handleDynamicColumn();
	},
	{ deep: false, immediate: false }
);
// 监听表单 FISCAL_YEAR 申报年度字段数据进行联动
watch(
	() => props.formData.FISCAL_YEAR,
	(newValue, oldValue) => {
		handleDataMonitoring();
	},
	{ deep: false, immediate: false }
);

// ----- 表格相关操作
/**
 * 表格列
 * @type {Ref<UnwrapRef<*[]>>}
 */
const columns = ref([]);

/**
 * 基础列数据
 * @type {[{slots: {default: string}, field: string, width: number, title: string, align: string}, {slots: {default: string}, field: string, width: number, title: string, align: string}, {field: string, children: [{formatter: string[], slots: {default: string}, field: string, width: number, title: string, align: string}, {formatter: string[], slots: {default: string}, field: string, width: number, title: string, align: string}], width: number, sortable: boolean, title: string}]}
 */
const columnsBasic = [
	{
		field: 'BAL_TYPE_NAME',
		title: '收支类别',
		width: 200,
		align: 'left',
		fixed: 'left',
		slots: { default: 'rk_type_name' },
	},
	{ field: 'BAL_FORMULA', title: '公式', width: 160, align: 'left', fixed: 'left', slots: { default: 'rk_formula' } },
	{
		field: 'TOTAL',
		title: '合计',
		width: 300,
		sortable: false,
		fixed: 'left',
		children: [
			{
				field: 'SRAMT_Y',
				title: '收入',
				width: 150,
				align: 'right',
				formatter: ['formatAmountBit'],
				slots: { default: 'rk_sr_input' },
			},
			{
				field: 'ZCAMT_Y',
				title: '支出',
				width: 150,
				align: 'right',
				formatter: ['formatAmountBit'],
				slots: { default: 'rk_zc_input' },
			},
		],
	},
];

/**
 * 模板下载
 */
const modelDownload = async () => {
	ElMessage({ message: '文件正在下载，请稍后！', type: 'info' });
	const result = await downloadSzysTemplate();
	dowloadFile(result, '收支预算模板', fileType.excel);
};

/**
 * 处理动态列
 */
const handleDynamicColumn = () => {
	columns.value = [...columnsBasic];
	// 建设期限，运营期限
	const { PRO_BUID_TERM, PRO_OPER_TERM } = props.formData;
	let tremNum = formatNumber(PRO_BUID_TERM) + formatNumber(PRO_OPER_TERM);
	if (!tremNum) {
		tremNum = 4;
	}
	//是否超过30年
	let exceedLimit = false;
	if (tremNum > 30) {
		exceedLimit = true;
		tremNum = 30;
	}
	let cDate = new Date();
	let yearStr = cDate.getFullYear() + '';
	if (props.formData.START_DATE) {
		yearStr = props.formData.START_DATE.substring(0, 4);
	}
	let templateCol = {
		field: 'TOTAL_Y23',
		title: '2023',
		width: 300,
		sortable: false,
		children: [
			{
				field: 'SRAMT_Y23',
				title: '收入',
				width: 150,
				align: 'right',
				formatter: ['formatAmountBit'],
				editRender: { autofocus: '.el-input__inner' },
				slots: { default: 'rk_sr_23_input', edit: 'rk_sr_23_input_edit' },
			},
			{
				field: 'ZCAMT_Y23',
				title: '支出',
				width: 150,
				align: 'right',
				formatter: ['formatAmountBit'],
				editRender: { autofocus: '.el-input__inner' },
				slots: { default: 'rk_zc_23_input', edit: 'rk_zc_23_input_edit' },
			},
		],
	};
	for (let i = 0; i <= tremNum; i++) {
		let yFullName = formatNumber(yearStr) + i;
		if (i === tremNum && exceedLimit) {
			yFullName += '及以后';
		}
		let tempCol = Object.assign({}, templateCol, {
			field: `TOTAL_Y${i}`,
			title: yFullName,
		});
		let tempChild_0 = Object.assign({}, tempCol.children[0], {
			field: `SRAMT_Y${i}`,
			slots: { default: `rk_sr_${i}_input`, edit: `rk_sr_${i}_input_edit` },
		});
		let tempChild_1 = Object.assign({}, tempCol.children[1], {
			field: `ZCAMT_Y${i}`,
			slots: { default: `rk_zc_${i}_input`, edit: `rk_zc_${i}_input_edit` },
		});
		Object.assign(tempCol, { children: [tempChild_0, tempChild_1] });
		columns.value.push(tempCol);
	}
	//重新计算
	totalCalculation();
};

/**
 * 动态处理插槽
 * @returns {{zcDefaults: *[], zcEdits: *[], srDefaults: *[], srEdits: *[]}}
 */
const handleSlotName = () => {
	// 建设期限，运营期限
	const { PRO_BUID_TERM, PRO_OPER_TERM } = props.formData;
	let tremNum = (formatNumber(PRO_BUID_TERM) || 0) + (formatNumber(PRO_OPER_TERM) || 0);
	if (!tremNum || tremNum === 0) {
		tremNum = 4;
	}
	if (tremNum > 30) tremNum = 30;
	let srDefaults = [];
	let srEdits = [];
	let zcDefaults = [];
	let zcEdits = [];
	for (let i = 0; i <= tremNum; i++) {
		srDefaults.push(`rk_sr_${i}_input`);
		srEdits.push(`rk_sr_${i}_input_edit`);
		zcDefaults.push(`rk_zc_${i}_input`);
		zcEdits.push(`rk_zc_${i}_input_edit`);
	}
	return {
		srDefaults,
		srEdits,
		zcDefaults,
		zcEdits,
	};
};

/**
 * 处理数据监听
 * 触发条件 当数据发生改变/导入数据
 */
const handleDataMonitoring = () => {
	if (!allowTypes.includes(props.formType)) return;
	if (!rkGridRef.value) {
		return;
	}
	const { tableData } = rkGridRef.value.getTableData();
	if (!tableData) return;
	let row = {
		code_12: void 0,
		code_1: void 0,
		code_13: void 0,
	};
	for (let data of tableData) {
		if (data['BAL_TYPE_CODE'] === '12') {
			row.code_12 = data;
		} else if (data['BAL_TYPE_CODE'] === '1') {
			row.code_1 = data;
		} else if (data['BAL_TYPE_CODE'] === '13') {
			row.code_13 = data;
		}
	}
	//处理code==12的数据变化
	if (row.code_12) {
		let cDate = new Date();
		let yearStr = cDate.getFullYear() + '';
		if (props.formData.START_DATE) {
			yearStr = props.formData.START_DATE.substring(0, 4);
		}
		let fiscalYear = props.formData.FISCAL_YEAR;
		let fy = -1;
		if (fiscalYear) {
			fiscalYear = fiscalYear.substring(0, 4);
			fy = formatNumber(fiscalYear) - formatNumber(yearStr);
		}
		//本次申报金额
		if (fy >= 0) {
			emitSetFormItemValue('APPLY_AMT', row.code_12[`SRAMT_Y${fy}`]);
		} else {
			emitSetFormItemValue('APPLY_AMT', '0.00');
		}
		emitSetFormItemValue('TOTAL_APP_AMT', row.code_12['SRAMT_Y']);
	}
	if (row.code_13) {
		emitSetFormItemValue('BOND_FUND_AMT', row.code_13['SRAMT_Y']);
	}
	if (row.code_1) {
		emitSetFormItemValue('PRO_TOTAL_AMT', row.code_1['SRAMT_Y']);
	}
};

/**
 * 初始化计算公式
 */
const initFormulas = () => {
	let tempFormulas = {};
	SzysTableData.forEach((item) => {
		if (item.BAL_FORMULA && item.BAL_FORMULA.includes('=')) {
			//去除空格
			let trimFormulaStr = item.BAL_FORMULA.trim();
			let s = trimFormulaStr.split('=');
			if (s && s.length === 2) {
				let calculationRules = [trimFormulaStr];
				let strs = s[1].split(/(\-|\+|\*|\/)/);
				calculationRules.push(...strs);
				tempFormulas[s[0]] = calculationRules;
				let params = s[1].split(/[-+*/]/);
				params.forEach((param) => {
					tempFormulas[param] = calculationRules;
				});
			}
			formulas.value = tempFormulas;
		}
	});
};

/**
 * 计算行总支出/总收入
 * @param row
 * @param colName
 * @returns {{zc: number, sr: number}}
 */
const calculateRowTotalAmt = (row, colName) => {
	// 建设期限，运营期限
	const { PRO_BUID_TERM, PRO_OPER_TERM } = props.formData;
	let tremNum = formatNumber(PRO_BUID_TERM) + formatNumber(PRO_OPER_TERM);
	if (!tremNum) {
		tremNum = 4;
	}
	let totalMoney = { sr: 0, zc: 0 };
	let tempRow = Object.assign({}, row);
	for (let i = 0; i <= tremNum; i++) {
		if (colName.includes('SRAMT_Y')) {
			totalMoney.sr += formatNumber(tempRow[`SRAMT_Y${i}`]) || 0;
		} else if (colName.includes('ZCAMT_Y')) {
			totalMoney.zc += formatNumber(tempRow[`ZCAMT_Y${i}`]) || 0;
		}
	}
	if (colName.includes('SRAMT_Y') && row.IS_SR_EDIT !== 1) {
		totalMoney.sr = totalMoney.sr || tempRow['SRAMT_Y'];
	}
	if (colName.includes('ZCAMT_Y') && row.IS_ZC_EDIT !== 1) {
		totalMoney.zc = totalMoney.zc || tempRow['ZCAMT_Y'];
	}
	return totalMoney;
};

/**
 * 计算
 * @param row
 * @param column
 */
const calculate = async (row, column) => {
	if (!formulas.value) {
		initFormulas();
	}
	const { tableData } = rkGridRef.value.getTableData();
	let formulaArray = formulas.value[row.BAL_FORMULA];
	if (!formulaArray) {
		const { zc, sr } = calculateRowTotalAmt(row, column.field);
		if (column.field.includes('SRAMT_Y')) {
			row['SRAMT_Y'] = sr;
		} else if (column.field.includes('ZCAMT_Y')) {
			row['ZCAMT_Y'] = zc;
		}
		if (rkGridRef.value.reloadRow) await rkGridRef.value.reloadRow(row);
	} else {
		let formula = formulaArray[0];

		let totalAmtRow = tableData.filter((item) => {
			return item.BAL_FORMULA.trim() === formula;
		});
		if (!totalAmtRow || !totalAmtRow[0]) {
			return;
		}
		let newRow = Object.assign({}, totalAmtRow);
		let totalMoney = 0;
		let totalZCSR = { sr: 0, zc: 0 };
		let operator = '';
		//计算行的总支出总收入
		let rowTotalMoney = calculateRowTotalAmt(row, column.field);
		for (let i = 1; i < formulaArray.length; i++) {
			if (i % 2 === 0) {
				operator += formulaArray[i];
			} else {
				let cellValue = 0;
				let cRow = tableData.filter((item) => {
					return item.BAL_FORMULA.trim() === formulaArray[i];
				});
				if (!cRow || !cRow[0]) {
					return;
				}
				const { sr, zc } = calculateRowTotalAmt(cRow[0], column.field);
				totalZCSR.zc += formatNumber(zc);
				totalZCSR.sr += formatNumber(sr);
				cellValue = cRow[0][column.field] || 0;
				totalMoney =
					operator === '-'
						? formatNumber(totalMoney) - formatNumber(cellValue)
						: operator === '*'
						? formatNumber(totalMoney) * formatNumber(cellValue)
						: operator === '/'
						? formatNumber(totalMoney) / formatNumber(cellValue)
						: formatNumber(totalMoney) + formatNumber(cellValue);
			}
		}
		if (column.field.includes('SRAMT_Y')) {
			row['SRAMT_Y'] = rowTotalMoney.sr;
			newRow[0]['SRAMT_Y'] = totalZCSR.sr;
		} else if (column.field.includes('ZCAMT_Y')) {
			row['ZCAMT_Y'] = rowTotalMoney.zc;
			newRow[0]['ZCAMT_Y'] = totalZCSR.zc;
		}
		newRow[0][column.field] = totalMoney || 0;
		await rkGridRef.value.reloadRow(newRow);
		await rkGridRef.value.reloadRow(row);
		//数据变动监听
		handleDataMonitoring();
	}
};

/**
 * 全表计算
 */
const totalCalculation = () => {
	if (!allowTypes.includes(props.formType)) return;
	if (!rkGridRef.value) {
		return;
	}
	const { tableData } = rkGridRef.value.getTableData();
	for (let row of tableData) {
		if (row.BAL_FORMULA.includes('=')) {
			continue;
		}
		calculate(row, { field: 'ZCAMT_Y' });
		calculate(row, { field: 'SRAMT_Y' });
	}
};

const resetLxCs = async () => {
	const { tableData } = rkGridRef.value.getTableData();
	//数据发生改变将利息全部设置为0
	tableData[9]['ZCAMT_Y'] = parseFloat('0').toFixed(2); //（二）财务费用-专项债券付息
	tableData[18]['ZCAMT_Y'] = parseFloat('0').toFixed(2); //（二）财务费用-专项债券付息支出
	await rkGridRef.value.reloadRow(tableData[9]);
	await rkGridRef.value.reloadRow(tableData[18]);
	await calculate(tableData[9], { field: 'ZCAMT_Y' });
	await calculate(tableData[18], { field: 'ZCAMT_Y' });
};

/**
 * 全局利息测算
 */
const interestCalculation = async () => {
	const { PRO_BUID_TERM: jsqx, PRO_OPER_TERM: yyqx } = props.formData;
	let { tableData } = rkGridRef.value.getTableData();
	let cacheArray = [];
	let zqfxMap = tableData[2];
	if (jsqx + yyqx <= 0) {
		globalProxy.$message.error('请输入项目建设期限和项目运营期限！');
		return;
	}
	// 获取每年专项债券还本额
	let zqhbMap = tableData[21];
	let qxStart = -1,
		qxEnd = -1;
	// 计算债券期限
	for (let i = 0; i <= jsqx + yyqx; i++) {
		// 最先发债年
		let syKey = 'SRAMT_Y' + i;
		if (formatNumber(zqfxMap[syKey]) > 0 && qxStart < 0) {
			qxStart = i;
		}
		// 最后还本年
		let zcKey = 'ZCAMT_Y' + i;
		if (zqhbMap[zcKey] * 1 > 0) {
			qxEnd = i;
		}
	}
	// 债券发行期限 = 最后还本年 - 最先发债年
	let zqqx = qxEnd - qxStart;
	if (zqqx < 0) {
		globalProxy.$message.error('请输入地方政府债券发行额和专项债券还本额！');
		return;
	}
	zqqx = jsqx + yyqx;
	// 债券利率
	let zqlv = zqqx > 5 ? 0.032 : 0.03;
	// 根据第一年债券发行，计算第二年付息
	let Amt_all = 0;
	for (let i = 0; i <= jsqx; i++) {
		// 计算建设期总金额
		let srKey = 'SRAMT_Y' + i;
		Amt_all += tableData[2][srKey] * 1;
	}

	for (let i = 0; i <= zqqx; i++) {
		let zcKey = 'ZCAMT_Y' + (i + 1);
		tableData[9][zcKey] = 0;
		tableData[18][zcKey] = 0;
	}
	// 赋值合计金额
	tableData[9]['ZCAMT_Y'] = parseFloat((Amt_all * zqlv * jsqx).toString()).toFixed(2); //（二）财务费用-专项债券付息
	tableData[18]['ZCAMT_Y'] = parseFloat((Amt_all * zqlv * yyqx).toString()).toFixed(2); //（二）财务费用-专项债券付息支出
	await rkGridRef.value.reloadRow(tableData[9]);
	await rkGridRef.value.reloadRow(tableData[18]);
	for (const item of tableData) {
		const { sr } = calculateRowTotalAmt(item, 'SRAMT_Y');
		const { zc } = calculateRowTotalAmt(item, 'ZCAMT_Y');
		item['SRAMT_Y'] = sr;
		item['ZCAMT_Y'] = zc;
		if (!item.BAL_FORMULA.includes('=')) {
			if (!formulas.value) {
				initFormulas();
			}
			let formulaArray = formulas.value[item.BAL_FORMULA];
			if (formulaArray) {
				if (!cacheArray.includes(formulaArray[0])) {
					cacheArray.push(formulaArray[0]);
					let totalAmtRow = tableData.filter((item) => {
						return item.BAL_FORMULA.trim() === formulaArray[0];
					});
					let totalAmt = { sr: 0, zc: 0 };
					for (let i = 1; i < formulaArray.length; i++) {
						if (i % 2 !== 0) {
							let cRow = tableData.filter((val) => {
								return val.BAL_FORMULA.trim() === formulaArray[i];
							});
							const { sr } = calculateRowTotalAmt(cRow[0], 'SRAMT_Y');
							const { zc } = calculateRowTotalAmt(cRow[0], 'ZCAMT_Y');
							totalAmt.sr += formatNumber(sr);
							totalAmt.zc += formatNumber(zc);
						}
					}
					totalAmtRow[0]['SRAMT_Y'] = parseFloat(totalAmt.sr).toFixed(2);
					totalAmtRow[0]['ZCAMT_Y'] = parseFloat(totalAmt.zc).toFixed(2);
					await rkGridRef.value.reloadRow(totalAmtRow);
				}
			}
		}
		await rkGridRef.value.reloadRow(item);
	}
	globalProxy.$message.success('利息测算成功！');
};
let headerJson = {
	BAL_TYPE_NAME: '收支类别',
	BAL_FORMULA: '公式',
	SRAMT_Y: '收入求和',
	ZCAMT_Y: '支出求和',
	SRAMT_Y0: 'T年收入金额',
	ZCAMT_Y0: 'T年支出金额',
	SRAMT_Y1: 'T+1年收入金额',
	ZCAMT_Y1: 'T+1年支出金额',
	SRAMT_Y2: 'T+2年收入金额',
	ZCAMT_Y2: 'T+2年支出金额',
	SRAMT_Y3: 'T+3年收入金额',
	ZCAMT_Y3: 'T+3年支出金额',
	SRAMT_Y4: 'T+4年收入金额',
	ZCAMT_Y4: 'T+4年支出金额',
	SRAMT_Y5: 'T+5年收入金额',
	ZCAMT_Y5: 'T+5年支出金额',
	SRAMT_Y6: 'T+6年收入金额',
	ZCAMT_Y6: 'T+6年支出金额',
	SRAMT_Y7: 'T+7年收入金额',
	ZCAMT_Y7: 'T+7年支出金额',
	SRAMT_Y8: 'T+8年收入金额',
	ZCAMT_Y8: 'T+8年支出金额',
	SRAMT_Y9: 'T+9年收入金额',
	ZCAMT_Y9: 'T+9年支出金额',
	SRAMT_Y10: 'T+10年收入金额',
	ZCAMT_Y10: 'T+10年支出金额',
	SRAMT_Y11: 'T+11年收入金额',
	ZCAMT_Y11: 'T+11年支出金额',
	SRAMT_Y12: 'T+12年收入金额',
	ZCAMT_Y12: 'T+12年支出金额',
	SRAMT_Y13: 'T+13年收入金额',
	ZCAMT_Y13: 'T+13年支出金额',
	SRAMT_Y14: 'T+14年收入金额',
	ZCAMT_Y14: 'T+14年支出金额',
	SRAMT_Y15: 'T+15年收入金额',
	ZCAMT_Y15: 'T+15年支出金额',
	SRAMT_Y16: 'T+16年收入金额',
	ZCAMT_Y16: 'T+16年支出金额',
	SRAMT_Y17: 'T+17年收入金额',
	ZCAMT_Y17: 'T+17年支出金额',
	SRAMT_Y18: 'T+18年收入金额',
	ZCAMT_Y18: 'T+18年支出金额',
	SRAMT_Y19: 'T+19年收入金额',
	ZCAMT_Y19: 'T+19年支出金额',
	SRAMT_Y20: 'T+20年收入金额',
	ZCAMT_Y20: 'T+20年支出金额',
	SRAMT_Y21: 'T+21年收入金额',
	ZCAMT_Y21: 'T+21年支出金额',
	SRAMT_Y22: 'T+22年收入金额',
	ZCAMT_Y22: 'T+22年支出金额',
	SRAMT_Y23: 'T+23年收入金额',
	ZCAMT_Y23: 'T+23年支出金额',
	SRAMT_Y24: 'T+24年收入金额',
	ZCAMT_Y24: 'T+24年支出金额',
	SRAMT_Y25: 'T+25年收入金额',
	ZCAMT_Y25: 'T+25年支出金额',
	SRAMT_Y26: 'T+26年收入金额',
	ZCAMT_Y26: 'T+26年支出金额',
	SRAMT_Y27: 'T+27年收入金额',
	ZCAMT_Y27: 'T+27年支出金额',
	SRAMT_Y28: 'T+28年收入金额',
	ZCAMT_Y28: 'T+28年支出金额',
	SRAMT_Y29: 'T+29年收入金额',
	ZCAMT_Y29: 'T+29年支出金额',
	SRAMT_Y30: 'T+30年收入金额',
	ZCAMT_Y30: 'T+30年支出金额',
};

const importFile = () => {
	const { PRO_BUID_TERM: jsqx, PRO_OPER_TERM: yyqx } = props.formData;
	if (jsqx + yyqx <= 0) {
		globalProxy.$message.error('请输入项目建设期限和项目运营期限！');
		return;
	}
	fileInputRef.value.click();
};
const copyData = (data) => {
	let tempRows = [];
	for (let row of SzysTableData) {
		let cRow = data.filter((item) => {
			return item.BAL_FORMULA.trim() === row.BAL_FORMULA.trim();
		});
		let tempRow = row;
		tempRow = Object.assign({}, cRow[0] || {}, row);
		if (cRow && cRow[0]) {
			for (let key in tempRow) {
				if (key.includes('SRAMT_Y') || key.includes('ZCAMT_Y')) {
					tempRow[key] = cRow[0][key];
				}
			}
		}
		tempRows.push(tempRow);
	}
	return tempRows;
};
const fileInputChange = async (e) => {
	let files = e.target.files;
	let rowFile = files[0];
	if (!rowFile) return;
	let formData = new FormData();
	formData.append('excelFile', rowFile);
	formData.append('headerJson', JSON.stringify(headerJson));
	formData.append('headerRowNumber', 2);
	const resp = await uploadSzysFile(formData);
	fileInputRef.value.value = null;

	if (resp && resp.length > 0) {
		globalProxy.$message.success('导入成功');
		let tempRows = copyData(resp);
		rkGridRef.value.reloadData(tempRows).then(() => {
			//数据监听
			handleDataMonitoring();
		});
	} else {
		globalProxy.$message.success('导入失败,未能匹配到数据!');
	}
};
const fillingInstructions = () => {
	window.open('/html/szys-tbsm.html', '_blank');
};
const blurEvent = (row, column) => {
	resetLxCs();
	calculate(row, column);
};
const cleanEvent = (row, column) => {
	resetLxCs();
	calculate(row, column);
};

const loadData = async () => {
	const { proId } = props.formData;
	if (proId) {
		const resp = await queryBgtBalanceByProId({ proId, proTypeId: '' });
		if (resp.code === 200) {
			let tempRows = copyData(resp.data);
			rkGridRef.value.reloadData(tempRows);
		} else {
			globalProxy.$message.error(resp.msg);
			tableData.value = SzysTableData;
		}
	} else {
		tableData.value = SzysTableData;
	}
};

const initEditDisable = () => {
	editDisable.value = !allowTypes.includes(props.formType);
};

onMounted(async () => {
	//加载数据
	await loadData();
	//动态列表
	await handleDynamicColumn();
	//处理监听
	await handleDataMonitoring();
});
onBeforeMount(() => {
	initEditDisable();
});

// ----- emits 方法定义
/**
 * 向上触发的方法，修改表单中的字段信息
 *
 * @param {String} fieldName 字段名称
 * @param {String} fieldValue 字段值
 */
const emitSetFormItemValue = function (fieldName, fieldValue) {
	try {
		emits('setFormItemValue', fieldName, fieldValue);
	} catch (e) {}
};

// ----- 获取组件数据
/**
 * 获取收支预算数据的方法，暴露给表单调用，固定名称getCompData
 */
const getCompData = function () {
	const { tableData } = rkGridRef.value.getTableData();
	//数据过滤过滤掉隐藏列的数据
	const { PRO_BUID_TERM, PRO_OPER_TERM } = props.formData;
	let zqqx = formatNumber(PRO_BUID_TERM + PRO_OPER_TERM) || 4;
	tableData.forEach((item) => {
		for (let itemKey in item) {
			if (itemKey.includes('SRAMT_Y') || itemKey.includes('ZCAMT_Y')) {
				let year = formatNumber(itemKey.replace('SRAMT_Y', '').replace('ZCAMT_Y', '')) || 0;
				item[itemKey] = formatNumber(item[itemKey]);
				if (year > zqqx) {
					// console.log(item[itemKey], itemKey);
					item[itemKey] = 0;
				}
			}
		}
	});
	return {
		bgtbalance_data: JSON.parse(JSON.stringify(tableData)),
	};
};

const SZYS_TAB_NAME = '收支预算';

const szysCheck = (szysArr, formData) => {
	let result = { allowPass: true, msg: '' };
	if (szysArr.length == 0) {
		result = { allowPass: false, msg: SZYS_TAB_NAME + '：收支预算不能为空' };
		return result;
	}

	let jsqx = formData.PRO_BUID_TERM; //建设期限
	if (jsqx == 0) {
		result = { allowPass: false, msg: SZYS_TAB_NAME + '：建设期限不能为空' };
		return result;
	}
	let yyqx = formData.PRO_OPER_TERM; //运营期限

	let xmqx = yyqx + jsqx; //项目期限
	if (xmqx > 30) {
		xmqx = 30;
	}

	let zqze = 0; // 债券总额
	let zqhbze = 0; // 债券还本总额
	let jscb = 0; //建设成本
	let xmyyqsr = 0; // 项目运营期收入
	let xmzsjysr = 0; //项目自身经营收入
	let xmyycb = 0; //项目运营成本
	let schrz = 0; //项目单位市场化融资
	let schrzhb = 0; //市场化融资还本
	let zxzqfx = 0; //财务费用-专项债券付息
	let schrzfx = 0; //财务费用-市场化融资付息
	let zxzqfxzc = 0; //财务费用-专项债券付息支出
	let schrzfxzc = 0; //财务费用-市场化融资付息支出
	let temp1 = 0;
	let temp2 = 0;
	for (let i in szysArr) {
		if (szysArr[i].BAL_TYPE_CODE == '12') {
			zqze = szysArr[i].SRAMT_Y;
			for (let v = xmqx; v > jsqx; v--) {
				temp1 = szysArr[i]['SRAMT_Y' + v];
				if (temp1 != 0) {
					result = { allowPass: false, msg: SZYS_TAB_NAME + '：地方政府专项发债年限不能超过建设期限' };
					return result;
				}
			}
		}
		if (szysArr[i].BAL_TYPE_CODE == '5') {
			// zqhbze = szysArr[i].SRAMT_Y;
			zqhbze = szysArr[i].ZCAMT_Y;
			temp1 = szysArr[i]['ZCAMT_Y' + 0];
			if (temp1 == zqhbze) {
				result = { allowPass: false, msg: SZYS_TAB_NAME + '：请输入地方政府债券发行额和专项债券还本额！' };
				return result;
			}
		}
		if (szysArr[i].BAL_TYPE_CODE == '21') {
			jscb = szysArr[i].ZCAMT_Y;
		}
		if (szysArr[i].BAL_TYPE_CODE == '3') {
			xmyyqsr = szysArr[i].SRAMT_Y;
		}
		if (szysArr[i].BAL_TYPE_CODE == '32') {
			xmzsjysr = szysArr[i].SRAMT_Y;
		}
		if (szysArr[i].BAL_TYPE_CODE == '41') {
			for (let v = xmqx; v > jsqx; v--) {
				xmyycb += szysArr[i]['ZCAMT_Y' + v];
			}
		}
		if (szysArr[i].BAL_TYPE_CODE == '14') {
			schrz = szysArr[i].SRAMT_Y;
		}
		if (szysArr[i].BAL_TYPE_CODE == '6') {
			schrzhb = szysArr[i].ZCAMT_Y;
		}
		if (szysArr[i].BAL_TYPE_CODE == '13') {
			for (let v = 0; v <= jsqx; v++) {
				temp1 = szysArr[i]['SRAMT_Y' + v];
				temp2 = szysArr[i - 1]['SRAMT_Y' + v];
				if (formatNumber(temp2) < formatNumber(temp1)) {
					result = {
						allowPass: false,
						msg: SZYS_TAB_NAME + '：每年的其中：用于资本金应小于等于地方政府专项债券',
					};
					return result;
				}
			}
		}
		if (szysArr[i].BAL_TYPE_CODE == '22') {
			zxzqfx = szysArr[i].ZCAMT_Y;
		}
		if (szysArr[i].BAL_TYPE_CODE == '23') {
			schrzfx = szysArr[i].ZCAMT_Y;
		}
		if (szysArr[i].BAL_TYPE_CODE == '42') {
			zxzqfxzc = szysArr[i].ZCAMT_Y;
		}
		if (szysArr[i].BAL_TYPE_CODE == '43') {
			schrzfxzc = szysArr[i].ZCAMT_Y;
		}
	}
	if (zqze == 0) {
		result = { allowPass: false, msg: SZYS_TAB_NAME + '：建设期限内地方政府专项债券总额不能为0' };
		return result;
	}
	if (zqze != zqhbze) {
		result = { allowPass: false, msg: SZYS_TAB_NAME + '：专项债券还本总额应等于地方政府专项债券总额' };
		return result;
	}
	if (jscb == 0) {
		result = { allowPass: false, msg: SZYS_TAB_NAME + '：项目建设成本不能为0' };
		return result;
	}
	if (xmyycb == 0) {
		result = { allowPass: false, msg: SZYS_TAB_NAME + '：运营期间项目运营成本不能为0' };
		return result;
	}
	if (xmyyqsr == 0) {
		result = { allowPass: false, msg: SZYS_TAB_NAME + '：项目运营期收入不能为0' };
		return result;
	}
	if (xmzsjysr == 0) {
		result = { allowPass: false, msg: SZYS_TAB_NAME + '：项目自身经营收入不能为0' };
		return result;
	}
	if (schrz != schrzhb) {
		result = { allowPass: false, msg: SZYS_TAB_NAME + '：市场化融资还本额应等于市场化融资总金额' };
		return result;
	}
	if (zqze != 0 && zxzqfx == 0) {
		result = { allowPass: false, msg: SZYS_TAB_NAME + '：收支预算信息存在变更操作,请重新进行利息测算！' };
		return result;
	}
	if (yyqx != 0) {
		if (zqze != 0 && zxzqfxzc == 0) {
			result = { allowPass: false, msg: SZYS_TAB_NAME + '：收支预算信息存在变更操作,请重新进行利息测算！' };
			return result;
		}
	}
	/*if(){
      result = {allowPass: false, msg: SZYS_TAB_NAME + "：市场化融资还本额应等于市场化融资总金额"};
      return result;
  }
  if(){
      result = {allowPass: false, msg: SZYS_TAB_NAME + "：市场化融资还本不为0时，市场化融资付息不能为0"};
      return result;
  }*/
	return result;
};

const validateData = function () {
	if (allowTypes.includes(props.formType)) {
		const { fullData } = rkGridRef.value.getTableData();
		let checkResult = szysCheck(fullData, props.formData);
		return {
			valid: checkResult.allowPass,
			message: checkResult.msg,
		};
	} else {
		return {
			valid: true,
			message: '校验通过',
		};
	}
};

defineExpose({
	getCompData,
	validateData,
});
</script>

<style lang="scss" scoped>
.operation-box {
	display: flex;
	justify-content: space-around;
}

.VFormTable-container {
	height: 500px;
}

.vform-table-search {
	margin-right: 15px;
}

.full-size {
	position: absolute;
	width: calc(100% - 1px);
	height: calc(100% - 1px);
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding: 0 10px;
}

.bgc {
	background-color: #e6e6e6;
}

.align-left {
	justify-content: flex-start;
}

:deep(.vxe-input.type--float .vxe-input--inner) {
	padding-right: 1.8em !important;
}

:deep(.vxe-input.type--float .vxe-input--suffix.is--clear) {
	right: 0.2em !important;
}

:deep(.vxe-input.type--float .vxe-input--extra-suffix) {
	display: none !important;
}
</style>
