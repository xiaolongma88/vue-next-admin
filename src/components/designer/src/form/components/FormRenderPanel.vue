<template>
	<div class="rk-form-render-container">
		<v-form-render
			v-if="formDataLoaded"
			ref="formRenderRef"
			:formJson="aFormJson"
			:busiConfig="busiConfig"
			:enumsConfig="enumsConfig"
			:axiosConfig="axiosConfig"
			@formChange="renderFormChange"
			@loadedMounted="renderFormJsonLoaded"
		>
			<template v-for="item in aSlotJson" #[item.value]>
				<component
					v-if="RkFormSlotModules.names.includes(item.value)"
					:is="item.value"
					:ref="item.value"
					:busiId="formData.proId || busiId"
					:preview="preview"
					:formData="renderFormData"
					:formType="formType"
					:busiType="busiType"
					:useInForm="true"
					:slotDataHouse="slotDataHouse"
					@setFormItemValue="setFormItemValue"
				>
				</component>
			</template>
		</v-form-render>
	</div>
</template>

<script>
import { defAxios } from '@/utils/http';
import { ElMessage } from 'element-plus';

import XEUtils from 'xe-utils';
import IsUtils from '@/utils/is-utils.js';
import FormUtils from '@/components/designer/cfg/rk-form-utils.js';

import { useUserStore } from '@/stores/modules';
import { FormBaseConfigPojo } from '@/components/designer/cfg/rk-form-pojo.js';
import { useFormDesignerApi } from '@/api';

import { EnumsDataPools } from '@/enums';
import RkFormSlotModules from '@/components/designer/src/slots';

const { getPrdFormInfoByFormCode } = useFormDesignerApi();
export default {
	name: 'RkFormRenderBusi',
	components: {
		...RkFormSlotModules.values,
	},
	props: {
		// 是否预览状态
		preview: { type: Boolean, default: false },
		// 表单设计配置
		formJson: { type: Object },
		// 插槽配置
		slotJson: { type: Object },
		// 表单设计编码，必传
		formCode: { type: String, required: false },
		// 表单回显数据
		formData: { type: Object, default: () => ({}) },
		// 表单类型：add|edit|view|yhs|atty|acct|finance
		formType: {
			type: String,
			default: 'view',
			validator(value) {
				return FormUtils.vaildateFormType(value);
			},
		},
		//
		busiId: { type: String, default: 'preview' },
		// 附件业务类型
		busiType: { type: String, default: 'ET001' },
		// tabs组件默认选中的页签
		defaultTabActiveName: { type: String },
	},
	data() {
		return {
			loading: false,
			formInfo: {},
			// 表单设计信息
			aFormJson: {},
			// 插槽设计信息
			aSlotJson: {},
			// 业务数据配置
			busiConfig: { userInfo: {}, dataHouse: {} },
			// 本地枚举数据池
			enumsConfig: { dataPools: EnumsDataPools },
			//
			axiosConfig: { request: defAxios },
			// 插槽数据空间
			slotDataHouse: {},
			// 表单数据
			renderFormData: this.formData,
			// 表单数据加载完毕
			formDataLoaded: false,
			// 表单使用插槽对象
			RkFormSlotModules,
		};
	},
	computed: {
		formRenderRef() {
			return this.$refs.formRenderRef;
		},
	},
	created() {
		this.loadFormInfo();
		this.initDataHouse();
		this.initBusiConfig();
	},
	beforeMount() {},
	mounted() {},
	methods: {
		/**
		 * 初始化数据空间
		 */
		initDataHouse() {
			RkFormSlotModules.names.forEach((item) => {
				this.slotDataHouse[`${item}`] = {};
			});
		},
		/**
		 * 初始化业务参数配置
		 */
		initBusiConfig() {
			this.busiConfig.userInfo = useUserStore().userInfo;
		},
		/**
		 * 加载表单信息
		 */
		async loadFormInfo() {
			this.loading = true;
			this.formDataLoaded = false;
			let formInfo = {};
			if (this.formJson) {
				formInfo = {
					formJson: XEUtils.clone(this.formJson),
					slotJson: XEUtils.clone(this.slotJson),
				};
			} else {
				formInfo = await this.getRenderFormInfo(this.formCode);
			}
			this.formInfo = formInfo;
			this.setRenderFormInfo(formInfo);
			this.formDataLoaded = true;
			this.setRenderFormData();
			this.busiConfig.dataHouse = { ...this.formData };
		},

		/**
		 * 获取表单设计信息
		 *
		 * @param {String} formCode 表单ID
		 */
		getRenderFormInfo(formCode) {
			return new Promise((resolve) => {
				getPrdFormInfoByFormCode(formCode)
					.then((res) => {
						// console.log('getRenderFormInfo', res)
						const { code, data, msg } = res;
						if (code === 200) {
							let baseForm = {};
							XEUtils.objectEach(FormBaseConfigPojo, (item, key) => {
								baseForm[key] = data[key] || data.prdFormContent[key] || item;
							});
							resolve({
								...baseForm,
								baseForm,
								formJson: JSON.parse(data.prdFormContent.structureJson),
								slotJson: JSON.parse(data.prdFormContent.slotJson),
							});
						} else {
							console.error(msg);
							resolve({});
						}
					})
					.catch((err) => {
						console.error(err);
						resolve({});
					});
			});
		},
		/** 设置渲染表单信息 */
		setRenderFormInfo(formInfo) {
			this.aFormJson = formInfo.formJson;
			this.aSlotJson = formInfo.slotJson;
		},
		/**
		 * 表单数据变更触发
		 * @param {String} fieldName 修改字段名称
		 * @param {Any} newValue 字段修改后的内容
		 * @param {Any} oldValue 字段修改前的内容
		 * @param {Object} formModel 表单数据
		 */
		renderFormChange(fieldName, newValue, oldValue, formModel) {
			const {
				renderFormData,
				$refs: { formRenderRef },
			} = this;
			if (formRenderRef && !this.loading) {
				// console.log('fieldName', fieldName[0], toRaw(formModel))
				this.renderFormData = { ...renderFormData, ...formModel };
			}
		},
		/**
		 * 表单渲染组件，渲染完成后触发
		 */
		renderFormJsonLoaded() {
			const { defaultTabActiveName, setTabWidgetActive } = this;
			this.setRenderFormStatus();
			if (defaultTabActiveName) {
				setTabWidgetActive(defaultTabActiveName);
			}
			this.emitLoaded();
			this.loading = false;
		},
		/** 设置表单数据 */
		setRenderFormData() {
			this.renderFormData = this.formData;
			this.$nextTick(() => {
				this.$refs.formRenderRef.setFormData(this.renderFormData, true);
				const resultData = this.$refs.formRenderRef.getFormData(false);
				this.renderFormData = { ...this.renderFormData, ...resultData };
			});
		},
		/**
		 * 设置单个表单字段的值
		 *
		 * @param {String} fieldName 表单字段名称
		 * @param {String} fieldValue 表单字段内容
		 */
		setFormItemValue(fieldName, fieldValue) {
			const {
				$refs: { formRenderRef },
			} = this;
			formRenderRef.setFieldValue(fieldName, fieldValue);
		},
		/**
		 * 设置表单状态
		 */
		setRenderFormStatus() {
			const { preview } = this;
			this.$nextTick(() => {
				if (preview) {
					this.$refs.formRenderRef.disableForm();
				}
			});
		},
		/**
		 * 获取渲染表单数据
		 */
		getRenderFormData(async = true) {
			const { renderFormData, aSlotJson, $refs } = this;
			const { formRenderRef } = $refs;
			const fieldWidgets = formRenderRef.getFieldWidgets();
			const formRenderData = formRenderRef.getFormData(false);
			const finalFormData = { ...renderFormData, ...formRenderData };
			const dataObj = {};
			const formData = {};
			let dataArray = [];
			dataArray = fieldWidgets
				.filter((item) => item.type !== 'slot')
				.map((item) => {
					const itemObj = {
						label: item.label,
						value: IsUtils.isNotEmpty(finalFormData[item.name]) ? finalFormData[item.name] : '',
						dataField: item.dataField,
					};
					// 如果是开关组件，就将【true|false】转换为【1|0】
					if (item.type === 'switch') {
						itemObj.value = itemObj.value ? 1 : 0;
					}
					dataObj[item.name] = itemObj;
					formData[item.name] = itemObj.value;
					return itemObj;
				});
			// 封装插槽数据信息
			let slotsData = {};
			// 遍历插槽
			aSlotJson.forEach((item) => {
				if ($refs[item.value]) {
					const { getCompData } = $refs[item.value];
					// 如果获取组件信息的方法不存在，跳过
					if (!getCompData) {
						return false;
					}
					const compData = $refs[item.value].getCompData();
					slotsData = { ...slotsData, ...compData };
				}
			});
			const resultData = { slotsData, dataArray, dataObj, formData };
			if (async) {
				return new Promise((reslove) => {
					reslove(resultData);
				});
			} else {
				return resultData;
			}
		},
		/**
		 * 校验表单基本信息
		 */
		async validateFormData() {
			const { getFieldWidgets, getContainerWidgets } = this.formRenderRef;
			// 获取tab容器
			const containerWidgets = getContainerWidgets();
			const tabWidget = containerWidgets.filter((item) => item.type === 'tab')[0];
			// 获取字段容器 key - value
			const fieldWidgets = getFieldWidgets();
			const fieldWidgetObj = {};
			const slotsWidgetObj = {};
			fieldWidgets.forEach((item) => {
				if (item.type === 'slot') {
					slotsWidgetObj[item.name] = item;
				} else {
					fieldWidgetObj[item.name] = item;
				}
			});
			// console.log({ tabWidget, fieldWidgets, fieldWidgetObj, slotsWidgetObj })
			const baseValid = await this.validateBaseField({ tabWidget, fieldWidgetObj });
			if (!baseValid) {
				return baseValid;
			}
			const slotValid = this.validateSlotField({ tabWidget, slotsWidgetObj });
			return baseValid && slotValid;
		},
		/**
		 * 校验基础表单数据
		 * @param {Object} param
		 */
		validateBaseField({ fieldWidgetObj }) {
			const { setTabWidgetActive } = this;
			const { validateForm } = this.formRenderRef;
			const tranfTabFields = {};
			return new Promise((resolve) => {
				validateForm((valid, invalidFields) => {
					if (!valid) {
						// 处理校验字段信息
						Object.keys(invalidFields).forEach((key) => {
							const tabInfo = fieldWidgetObj[key]?.tabInfo;
							if (tabInfo) {
								let tabField = tranfTabFields[tabInfo.name];
								if (tabField) {
									tabField.fields.push(key);
								} else {
									tabField = { name: tabInfo.name, label: tabInfo.label, fields: [key] };
								}
								tranfTabFields[tabInfo.name] = tabField;
							}
						});
						const tabFieldsValues = Object.values(tranfTabFields);
						if (tabFieldsValues && tabFieldsValues.length > 0) {
							setTabWidgetActive(tabFieldsValues[0].name);
							ElMessage.error(`${tabFieldsValues[0].label}：请检查必填项，以及未通过校验项！`);
						}
						resolve(false);
					} else {
						resolve(true);
					}
				});
			});
		},
		/**
		 * 校验插槽字段数据
		 * @param {Object} param
		 */
		validateSlotField({ slotsWidgetObj }) {
			const { $refs, setTabWidgetActive } = this;
			let flag = true;
			Object.values(slotsWidgetObj).some((slotItem) => {
				if ($refs[slotItem.name]) {
					const { validateData } = $refs[slotItem.name];
					if (validateData) {
						const validMsg = validateData();
						flag = validMsg.valid;
						if (!validMsg.valid) {
							setTabWidgetActive(slotItem.tabInfo.name);
							ElMessage.error(`${validMsg.message}`);
							return;
						}
					}
				}
			});
			return flag;
		},
		/**
		 * 校验单个字段
		 * @param {String} fieldName 字段名称
		 */
		validateField(fieldName) {
			const { validateField, getWidgetRef, getFieldWidgets, getContainerWidgets } = this.$refs.formRenderRef;
			const fieldWidgets = getFieldWidgets();
			const containerWidgets = getContainerWidgets();
			// 获取tab容器
			let tabWidget = {};
			containerWidgets.forEach((item) => {
				if (item.type === 'tab') {
					tabWidget = item;
				}
			});
			const fieldWidgetObj = {};
			fieldWidgets.forEach((item) => {
				fieldWidgetObj[item.name] = item;
			});
			const tabRef = getWidgetRef(tabWidget.name);
			return new Promise((reslove) => {
				validateField(fieldName, (valid, invalidFields) => {
					if (!valid) {
						tabRef.activeTabName = fieldWidgetObj[fieldName].tabInfo.name;
					}
					reslove(valid);
				});
			});
		},
		/**
		 * 设置tab默认选中
		 * @param {String} activeName tab选中的面板
		 */
		setTabWidgetActive(activeName) {
			if (!activeName) return;
			const { getContainerWidgets, getWidgetRef } = this.formRenderRef;
			const containerWidgets = getContainerWidgets();
			const tabWidget = containerWidgets.filter((item) => item.type === 'tab')[0];
			if (tabWidget) {
				const tabRef = getWidgetRef(tabWidget.name);
				tabRef.activeTabName = activeName;
			}
		},
		// ----- 以下为emit向上触发事件
		emitLoaded() {
			this.$emit('loaded', this.formInfo);
		},
		emitRenderLoaded() {
			this.$emit('renderLoaded');
		},
	},
};
</script>

<style lang="scss" scoped>
@use '@/components/designer/styles/form-render.scss' as *;
</style>
