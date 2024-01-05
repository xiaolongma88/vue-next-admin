<template>
	<div class="comp-examples">
		<el-form :label-width="150">
			<el-divider content-position="left">【下拉树-基础数据】</el-divider>
			<el-row :gutter="20">
				<el-col :span="6">
					<el-form-item label="模式一">
						<RkTreeSelect
							:filterable="false"
							v-model="form.dwlx"
							:dist="{
								name: 'DSY_V_ELE_ITEM',
								// params: { condition: `AND T1.YEAR = '2023'` }
							}"
						>
						</RkTreeSelect>
					</el-form-item>
					<el-form-item label="选中值（value）">
						<el-input v-model="form.dwlx" />
					</el-form-item>
					<el-form-item label="选中值（label）">
						<el-input v-model="treeBaseModel.mode1.label" />
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="模式二">
						<RkTreeSelect
							:filterable="false"
							v-model="treeBaseModel.mode2.value"
							v-model:label="treeBaseModel.mode2.label"
							:dist="{
								name: 'DSY_V_ELE_XMLB',
								params: { condition: `AND CODE LIKE '3%'` },
							}"
						>
						</RkTreeSelect>
					</el-form-item>
					<el-form-item label="选中值（value）">
						<el-input v-model="treeBaseModel.mode2.value" />
					</el-form-item>
					<el-form-item label="选中值（label）">
						<el-input v-model="treeBaseModel.mode2.label" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-divider content-position="left">【下拉树-动态数据】</el-divider>
			<el-row :gutter="20">
				<el-col :span="6">
					<el-form-item label="模式一">
						<RkTreeSelect
							v-model="treeServerModel.mode1.value"
							v-model:label="treeServerModel.mode1.label"
							placeholder="请选择单位"
							:props="{ label: 'name', value: 'id', code: 'code' }"
							:server="selectServer"
							@change="handleChange"
						>
						</RkTreeSelect>
					</el-form-item>
					<el-form-item label="选中值（value）">
						<el-input v-model="treeServerModel.mode1.value" />
					</el-form-item>
					<el-form-item label="选中值（label）">
						<el-input v-model="treeServerModel.mode1.label" />
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="模式二">
						<RkTreeSelect
							v-model="treeServerModel.mode2.value"
							v-model:label="treeServerModel.mode2.label"
							placeholder="请选择单位"
							:props="{ label: 'name', value: 'code' }"
							:server="{
								url: '/dict/getSysAdata',
								method: 'post',
								data: { adCode: userInfo.adCode },
							}"
							@change="handleChange"
						>
						</RkTreeSelect>
					</el-form-item>
					<el-form-item label="选中值（value）">
						<el-input v-model="treeServerModel.mode2.value" />
					</el-form-item>
					<el-form-item label="选中值（label）">
						<el-input v-model="treeServerModel.mode2.label" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-divider content-position="left">【下拉树-枚举数据、静态数据】</el-divider>
			<el-row :gutter="20">
				<el-col :span="6">
					<el-form-item label="下拉树（静态数据）">
						<RkTreeSelect
							v-model="treeStaticModel.mode1.value"
							v-model:label="treeStaticModel.mode1.label"
							:data="treeSelectData"
							:showCode="false"
							@change="handleChange"
						>
						</RkTreeSelect>
					</el-form-item>
					<el-form-item label="选中值（value）">
						<el-input v-model="treeStaticModel.mode1.value" />
					</el-form-item>
					<el-form-item label="选中值（label）">
						<el-input v-model="treeStaticModel.mode1.label" />
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="下拉树（枚举数据）">
						<RkTreeSelect
							v-model="treeEnumModel.mode1.value"
							v-model:label="treeEnumModel.mode1.label"
							enum="EXPERT_INPUT_STATUS"
							:showCode="true"
							@change="handleChange"
						>
						</RkTreeSelect>
					</el-form-item>
					<el-form-item label="选中值（value）">
						<el-input v-model="treeEnumModel.mode1.value" />
					</el-form-item>
					<el-form-item label="选中值（label）">
						<el-input v-model="treeEnumModel.mode1.label" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-divider content-position="left">【下拉框】</el-divider>
			<el-row :gutter="20">
				<el-col :span="6">
					<el-form-item label="下拉树（动态数据）">
						<RkSelect
							v-model="selectValues.serverValue"
							:labelConfig="{
								label: 'name',
								value: 'code',
							}"
							:server="selectServer"
						>
						</RkSelect>
					</el-form-item>
					<el-form-item label="下拉树（选中的值）">
						<el-input v-model="selectValues.serverValue" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>

<script setup name="TreeSelectView">
import { useUserStore } from '@/stores/modules';
import { useTreeApi } from '@/api/tree';
const userInfo = useUserStore().userInfo;

const unitForm = {
	dwlx: undefined,
};

const form = reactive({
	...unitForm,
});

console.log('form', form);

const treeBaseModel = ref({
	mode1: {
		label: '',
		value: '',
	},
	mode2: {
		label: '',
		value: '',
	},
});

const treeEnumModel = ref({
	mode1: {
		label: '',
		value: '',
	},
});

const treeStaticModel = ref({
	mode1: {
		label: '',
		value: '',
	},
});

const treeServerModel = ref({
	mode1: {
		label: '',
		value: '',
	},
	mode2: {
		label: '',
		value: '',
	},
});

const treeModel = ref({
	base: {
		value: '',
		label: '',
	},
});

const treeSelectData = ref([
	{
		value: '1',
		label: 'Level one 1',
		children: [],
	},
	{
		value: '2',
		label: 'Level one 2',
		children: [
			{
				value: '2-1',
				label: 'Level two 2-1',
				children: [
					{
						value: '2-1-1',
						label: 'Level three 2-1-1',
					},
				],
			},
		],
	},
]);
const treeSelectParams = ref({
	baseValue: '',
	enumValue: '',
	staticValue: '',
	serverValue: '',
});
const selectValues = ref({
	serverValue: '',
});
const handleChange = (value, data) => {
	console.log(value, data);
};

const selectServer = () => {
	return new Promise((reslove) => {
		useTreeApi()
			.getSysAgData({
				agId: null,
				adCode: userInfo.adBjCode,
			})
			.then((res) => {
				const { code, msg, data } = res;
				if (code === 200) {
					reslove(data);
				} else {
					console.error(msg);
					reslove([]);
				}
			})
			.catch((err) => {
				console.error(err);
				reslove([]);
			});
	});
};
</script>

<style lang="scss" scoped>
.comp-examples {
	padding: 15px;
	padding-top: 0;
}
</style>
