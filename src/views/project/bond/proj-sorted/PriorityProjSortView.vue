<!--
 * @Author: songdeyuan
 * @Date: 2023/5/18 16:30
 * @Description: 备选库重点项目排序（一般/专项）
-->
<template>
  <rk-container :isFooter="false"
    :isAside="false">
    <template #header_left>
      <RkButtonGroup :options="json_proj_sort"
        v-model="queryParams.queryType" />
    </template>
    <template #header_right>
      <!--            <el-button v-if="!showCondition" @click="showCondition=true">展开条件</el-button>-->
      <!--            <el-button v-else @click="showCondition=false">收起条件</el-button>-->
    </template>
    <template #main>
      <rk-center>
        <template #condition>
          <rk-center-bar v-show="showCondition">
            <template #content>
              <el-form ref="form"
                :inline="true">
                <el-form-item label="备选批次">
                  <rk-tree-select :filterable="false"
                    v-model="queryParams.batchCode"
                    :dist="{ name:'DEBT_V_CTS_ELE_BXPC',
                                                    params:{ condition:`AND STATUS='1'  AND YEAR >'2020'`}}"
                    @change="handleSearch"></rk-tree-select>
                </el-form-item>
                <el-form-item label="模糊搜索">
                  <el-input v-model="queryParams.mhcx"
                    placeholder="请输入申报单位/名称" />
                </el-form-item>
              </el-form>
            </template>
            <template #buttons>
              <el-button type="primary"
                @click="handleSearch">查询
              </el-button>
              <el-button type="primary"
                v-if="queryParams.queryType===0"
                @click="handleOperation('autoSort','自动排序','')">自动排序
              </el-button>
              <el-button type="danger"
                v-if="queryParams.queryType===1"
                @click="handleOperation('revokeSort','撤销排序','')">撤销排序
              </el-button>
              <el-button type="primary"
                v-if="queryParams.queryType===1"
                @click="handleOperation('confirm','确认','')">确认
              </el-button>
              <el-button type="danger"
                v-if="queryParams.queryType===2"
                @click="handleOperation('revokeConfirm','撤销确认','')">撤销确认
              </el-button>
              <el-button v-if="queryParams.queryType===0"
                @click="handleOperation('save','保存','')">保存
              </el-button>
              <el-button v-if="queryParams.queryType===0"
                @click="handleOperation('export','导出','')">导出
              </el-button>
            </template>
          </rk-center-bar>
        </template>
        <template #content>
          <rk-grid ref="reserveProjRef"
            :title="`重点项目排序(${queryParams.bondTypeCode==1?'一般':'专项'})`"
            dataUrl="/proAltApply/sortPage"
            boxConfig
            :seqConfig="false"
            :params="queryParams"
            :columns="tableColumns"
            :editConfig="true"
            @loaded="handleLoaded">
            <template #toolbar_title_buttons>
              <el-form-item label="单位"
                style="margin: 0px">
                <rk-select style="width: 80px;height: 30px"
                  :isSearch="false"
                  :options="toArray(COMMON_AMOUNT_UNIT)"
                  v-model="queryParams.dw"
                  @change="handleSearch"></rk-select>
              </el-form-item>
            </template>
            <template #sort_input_edit="{row,column}">
              <el-input v-if="showEdit"
                v-model="row[column.field]"
                :disabled="!showEdit"
                @focus="focusEvent(row,column)"
                @blur="blurEvent(row,column)"></el-input>
              <div v-else>
                {{ row[column.field] }}
              </div>
            </template>
          </rk-grid>
        </template>
      </rk-center>
    </template>
    <PrioriityProSortDialog :dialog-type="dialogType"
      v-model:visible="showDialog"
      :ok="clickOk" />
  </rk-container>
</template>

<script setup lang="jsx">
import {computed, getCurrentInstance, reactive, ref, unref, watch} from "vue";
import {json_proj_sort} from '@/common/button-data';
import PrioriityProSortDialog from "../dialogs/PrioriityProSortDialog.vue";
import {RkConfirmBox} from "@/components/message-box";
import {useSortApi} from "@/api/index";
import { useUserStore } from '@/stores/modules';
import {useRoute} from "vue-router";
import {COMMON_AMOUNT_UNIT, toArray} from "@/enums/enums-common.js";
import { useProjectApi} from "@/api/index";
import {dowloadFile, fileType} from "@/utils/file-utils.js";
import {ElLoading, ElMessage} from "element-plus";

const {cancelProjSort, confirmProjSort, revokeConfirmProjSort, saveProjSort, validateSort,getMaxSortId} = useSortApi();
const {proAltApplyExportSort} = useProjectApi();
const userInfo = useUserStore().userInfo
const showEdit = computed(() => {
    return queryParams.queryType === 1 || queryParams.queryType === 0
})
const route = useRoute()
const query = route.query
const activeRow = ref({})

const showCondition = ref(true)
const reserveProjRef = ref(null)
const {appContext} = getCurrentInstance();
const globalProxy = appContext.config.globalProperties;
const showDialog = ref(false)


// 查询参数
let queryParams = reactive({
    queryType:  parseInt(route.query.wfStatus) || 0,
    bondTypeCode: route.query.bondType,
    mhcx: '',
    batchCode: '',
    dw: 2,
    cityNodeId: query.cityNodeId,
    provinceNodeId: query.provinceNodeId
})

watch(() => queryParams.queryType, (v) => {
    handleSearch()
})

const dialogType = ref(0)

const sortData = ref([])
const tableColumns = ref([
    {
        field: 'sortId', title: '排序号', width: 100, align: 'left',
        editRender: {autofocus: '.el-input__inner'},
        slots: {edit: 'sort_input_edit'}
    },
    {field: 'agencyName', title: '申报单位', width: 180, align: 'left',},
    {
        field: 'proName', title: '项目名称', width: 250, align: 'left', cellRender: {name: 'stXmYHS'}
    },
    {field: 'proCode', title: '项目编码', width: 200, align: 'left',},
    {field: 'fiscalYear', title: '年度', width: 120, align: 'center',},
    {field: 'debtDeadlineName', title: '债券期限', width: 130, align: 'center',},
    {
        field: 'applyAmt',
        title: '申请金额（万元）',
        formatter: 'formatThousand',
        width: 150,
        sumable: true,
        align: 'right'
    },
    {
        field: 'expFuncName', title: '支出功能分类', width: 200
    },
    {
        field: 'govBgtEcoName', title: '政府预算支出经济分类', width: 200
    },
    {
        field: 'depBgtEcoName', title: '部门预算支出经济分类', width: 200
    },
    {
        field: 'proCapital',
        title: '项目资本金（万元）',
        formatter: 'formatThousand',
        width: 150,
        sumable: true,
        align: 'right'
    },
    {field: 'bondTypeName', title: '申请类型', width: 120, align: 'center'},
    {field: 'applyDate', title: '申报日期', width: 120, align: 'center'},
    {field: 'setupYear', title: '立项年度', width: 100, align: 'center'},
    {field: 'proTypeName', title: '项目类型', width: 150, align: 'left'},
    {field: 'fundInvestAreaName', title: '资金投向领域', width: 200},
    {
        field: 'totalBudget',
        title: '项目总概算',
        formatter: 'formatThousand',
        width: 150,
        sumable: true,
        align: 'right'
    },
    {field: 'proStatusName', title: '建设状态', width: 120},
    {field: 'startDate', title: '开工日期', width: 150, align: 'center'},
    {field: 'endDate', title: '竣工日期', width: 150, align: 'center'},
    {field: 'remark', title: '备注', width: 120, align: 'left'},
])
const clickOk = async () => {
    if (dialogType.value === 1) {
        let select = selectData()
        if (select.data) {
            RkConfirmBox({
                title: '提示',
                content: `请确认是否确认排序？`,
                onSubmit: async () => {
                    let applyIds = []
                    let sortIds = []
                    select.data.forEach(item => {
                        applyIds.push(item.applyId)
                        sortIds.push(item.sortId)
                    })
                    let params = Object.assign({}, {
                        applyIds: applyIds.join(","),
                        sortIds: sortIds.join(","),
                        bondTypeCode: queryParams.bondTypeCode
                    })
                    const res = await confirmProjSort(params)
                    if (res.code === 200) {
                        globalProxy.$message({message: `确认成功!`, type: 'success'})
                        handleSearch()
                    } else {
                        if (res.msg) {
                            globalProxy.$message({message: res.msg, type: 'error'})
                        } else {
                            globalProxy.$message({message: `确认失败!`, type: 'error'})
                        }
                    }
                },
                onCancel: () => {

                }
            })
        }
    } else if (dialogType.value === 0) {
        const resp = await getMaxSortId(queryParams.bondTypeCode)
        const {data, msg, code} = resp
        if (code === 200) {
            handleAutoSort(data)
        } else {
            globalProxy.$message({message: `${msg}`, type: "error"});
        }
    }
    showDialog.value = false
}

//点击自动排序
const handleAutoSort = (num) => {
    let select = selectData()
    if (select.empty) {
        globalProxy.$message({message: `请至少选择一条数据进行排序！`, type: "warning"});
        return;
    }
    let data = select.data
    data.forEach((item, index) => {
        item.sortId = (num + 1) + index
    })
    //重新载入数据
    reserveProjRef.value.reloadData(data)
}

//加载完成事件处理
const handleLoaded = (data) => {
    sortData.value = data
}

const handleOperation = async (buttonType, textName, buttonStatus) => {
    //自动排序
    if (buttonType === 'autoSort') {
        if (!sortData.value || sortData.value.length === 0) {
            globalProxy.$message({message: '没有可排序项目', type: "error"});
            return;
        }
        let select = selectData()
        if (select.empty) {
            globalProxy.$message({message: `请至少选择一条数据进行${textName}！`, type: "warning"});
            return;
        }
        dialogType.value = 0
        showDialog.value = true
    }//撤销排序
    else if (buttonType === 'revokeSort') {
        let select = selectData()
        if (select.empty) {
            globalProxy.$message({message: `请至少选择一条数据进行${textName}！`, type: "warning"});
            return;
        }
        if (select.data) {
            RkConfirmBox({
                title: '提示',
                content: `请确认是否${textName}？`,
                onSubmit: async () => {
                    let applyIds = []
                    select.data.forEach(item => {
                        applyIds.push(item.applyId)
                    })
                    const res = await cancelProjSort({applyIds: applyIds.join(","),})
                    if (res.code === 200) {
                        globalProxy.$message({message: `${textName}成功!`, type: 'success'})
                        handleSearch()
                    } else {
                        if (res.msg) {
                            globalProxy.$message({message: res.msg, type: 'error'})
                        } else {
                            globalProxy.$message({message: `${textName}失败!`, type: 'error'})
                        }
                    }
                },
                onCancel: () => {

                }
            })
        }

    }//撤销确认
    else if (buttonType === 'revokeConfirm') {
        let select = selectData()
        if (select.empty) {
            globalProxy.$message({message: `请至少选择一条数据进行${textName}！`, type: "warning"});
            return;
        }
        if (select.data) {
            RkConfirmBox({
                title: '提示',
                content: `请确认是否${textName}？`,
                onSubmit: async () => {
                    let applyIds = []
                    select.data.forEach(item => {
                        applyIds.push(item.applyId)
                    })
                    let params = Object.assign({}, {
                        applyIds: applyIds.join(","),
                        cityNodeId: queryParams.cityNodeId,
                        provinceNodeId: queryParams.provinceNodeId
                    })
                    const res = await revokeConfirmProjSort(params)
                    if (res.code === 200) {
                        globalProxy.$message({message: `${textName}成功!`, type: 'success'})
                        handleSearch()
                    } else {
                        if (res.msg) {
                            globalProxy.$message({message: res.msg, type: 'error'})
                        } else {
                            globalProxy.$message({message: `${textName}失败!`, type: 'error'})
                        }
                    }
                },
                onCancel: () => {

                }
            })
        }
    }//确认
    else if (buttonType === 'confirm') {
        let select = selectData()
        if (select.empty) {
            globalProxy.$message({message: `请至少选择一条数据进行${textName}！`, type: "warning"});
            return;
        }
        dialogType.value = 1
        showDialog.value = true
    }
    //保存
    else if (buttonType === 'save') {
        let select = selectData()
        if (select.empty) {
            globalProxy.$message({message: `请至少选择一条数据进行${textName}！`, type: "warning"});
            return;
        }
        if (select.data) {
            // console.log(select.data);
            let count = select.data.filter(item => !item.sortId).length
            if (count > 0) {
                RkConfirmBox({
                    title: '提示',
                    content: '排序号错误请重新排序否者无法保存!',
                })
                return;
            }
            RkConfirmBox({
                title: '提示',
                content: `请确认是否${textName}？`,
                onSubmit: async () => {
                    let applyIds = []
                    let sortIds = []
                    select.data.forEach(item => {
                        applyIds.push(item.applyId)
                        sortIds.push(item.sortId)
                    })
                    let params = Object.assign({}, {applyIds: applyIds.join(","), sortIds: sortIds.join(",")})
                    const res = await saveProjSort(params)
                    if (res.code === 200) {
                        globalProxy.$message({message: `${textName}成功!`, type: 'success'})
                        handleSearch()
                    } else {
                        if (res.msg) {
                            globalProxy.$message({message: res.msg, type: 'error'})
                        } else {
                            globalProxy.$message({message: `${textName}失败!`, type: 'error'})
                        }
                    }
                },
                onCancel: () => {

                }
            })
        }

    } //导出
    else if (buttonType === 'export') {
        ElMessage({
            message: `文件正在导出，请稍后！`,
            type: 'info',
        })
        const resp = await proAltApplyExportSort(queryParams)
        dowloadFile(resp.data, '', fileType.excel, resp)
    }
}
const selectData = () => {
    const rows = reserveProjRef.value.getCheckboxRecords()
    if (!rows || rows.length === 0) {
        return {empty: true, data: void 0}
    }
    return {empty: false, data: rows}
}
/**查询 */
const handleSearch = () => {
    reserveProjRef.value.searchEvent()
}

/**重置 */
const handleReset = () => {
    reserveProjRef.value.resetEvent()
}
const blurEvent = async (row, column) => {
    let sortId = row[column.field]
    let oldSortId = activeRow.value[column.field]
    // console.log(sortId, oldSortId);
    if (sortId && sortId != 0 && sortId != oldSortId) {
        let params = {applyId: row.applyId, bondTypeCode: queryParams.bondTypeCode, sortId}
        const resp = await validateSort(params)
        if (resp.code === 200) {
            if (resp.data) {
                if (queryParams.queryType !== 0) {
                    const res = await saveProjSort({applyIds: row.applyId, sortIds: sortId})
                    handleSearch()
                    if (res.code === 200) {
                        globalProxy.$message.success({message: '修改成功'})
                        return
                    } else {
                        globalProxy.$message({message: '不允许修改', type: 'error'})
                    }
                } else {
                    return
                }
            }
        }
    }
    if (activeRow.value) {
        if (queryParams.queryType !== 0) {
            row[column.field] = oldSortId
        } else {
            row[column.field] = ''
        }
    }
    reserveProjRef.value.reloadRow(row)


}
const focusEvent = (row, column) => {
    activeRow.value = Object.assign({}, row)
}

</script>

<style scoped>
</style>
