<template>
    <div class="project-review-body">
        <div class="project-review-overview">
            <p>项目评审专家共{{ dataSource['expertCount'] || 0 }}人，其中评审结论为 <b>通过</b> 的有
                {{ dataSource['reviewPassedCount'] || 0 }} 位，评审结论为 <b>不通过</b> 的有
                {{ dataSource['reviewFailedCount'] || 0 }} 位。
            </p>
            <p>
                <span v-if="dataSource.score"> 项目终审得分：<b style="color: red">{{
                    dataSource.score || "—"
                    }}&nbsp;分，</b></span>
                系统自动评审结论：<b style="color: red">{{
                dataSource['reviewSummary'] || '不通过'
                }}</b>
                <span v-if="dataSource.agencySummary">，机构终审结论：<b style="color: red">{{
                    dataSource.agencySummary
                    }}。</b></span>
                <span v-else>。</span>
            </p>
            <p>以下为规则评审详情：</p>
        </div>
        <div class="project-review-detail">
            <div style="height: 100%;">
                <rk-grid ref="rkGridRef"
                         title="评审详情"
                         :boxConfig="false"
                         :seqConfig="false"
                         :loading="loading"
                         :data="tableData"
                         :columns="tableColumns"
                         :rowConfig="{ isHover: false, isCurrent: false }"
                         :spanMethod="mergeRowMethod"
                         :pagerConfig="false"
                         :showOverflow="false"
                         :toolbarConfig="true">
                </rk-grid>
            </div>
        </div>
    </div>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import {useTaskApi} from "@/api/index.js";
const { reviewTask } = useTaskApi();


const props = defineProps({
    source: {
        type: Object,
        default: {}
    },
    config: {
        type: Object,
    }
})

const dataSource = ref(props.source)
const loading = ref(true)

watch(() => props.source, (v) => {
    dataSource.value = v
    handlerTableData()
})
watch(() => props.config, () => {
    handlerTableData()
})

const rkGridRef = ref(null)
const tableData = ref([])

const tableColumns = [
    {field: 'entryLev1', title: '评审规则名称一级条目', width: 180, align: 'center'},
    {field: 'entryLev2', title: '评审规则名称二级条目', width: 180, align: 'left'},
    {field: 'reviewDesc', title: '评审内容', width: 450, align: 'left'},
    // {field: 'scoreTypeName', title: '评审类型', width: 120, align: 'center'},
    {field: 'reviewStandard', title: '评分标准', width: 120, align: 'center'},
    {field: 'expertName', title: '姓名', width: 200, align: 'center'},
    {field: 'expertScore', title: '评审结果', width: 200, align: 'center'},
    {field: 'score', title: '总得分', width: 150, align: 'center'},
]

const mergeRowMethod = ({row, _rowIndex, column, visibleData}) => {
    const fields = ['entryLev1', 'entryLev2', 'reviewDesc', 'reviewStandard', 'score']
    const cellValue = row[column.field]
    if (cellValue && fields.includes(column.field)) {
        if (column.field !== 'score' && column.field !== 'reviewStandard') {
            const prevRow = visibleData[_rowIndex - 1]
            let nextRow = visibleData[_rowIndex + 1]
            if (prevRow && prevRow[column.field] === cellValue) {
                return {rowspan: 0, colspan: 0}
            } else {
                let countRowspan = 1
                while (nextRow && nextRow[column.field] === cellValue) {
                    nextRow = visibleData[++countRowspan + _rowIndex]
                }
                if (countRowspan > 1) {
                    return {rowspan: countRowspan, colspan: 1}
                }
            }
        } else {
            let tempC = Object.assign({}, column, {
                field: 'reviewDesc'
            })
            // console.log(tempC);
            return mergeRowMethod({row, _rowIndex, column: tempC, visibleData})
        }
    }
}

const handlerTableData = async () => {
    loading.value = true
    if (!dataSource.value.ruleList && props.config) {
        const {applyId, taskId} = props.config
        let resp = await reviewTask({applyId, taskId})
        dataSource.value = resp.data
        await handlerTableData()
    }
    const {ruleList} = dataSource.value
    if (!dataSource.value || !ruleList) {
        loading.value = false
        return
    }
    let tempMap = {}
    for (let rule of ruleList) {
        let basicInfo = {}
        let infoKey = rule.entryLev2 + "$;$" + rule.reviewDesc
        if (tempMap.hasOwnProperty(infoKey)) {
            basicInfo = tempMap[infoKey]['basic']
        } else {
            let temp = Object.assign({}, rule)
            delete temp.expertList
            tempMap[infoKey] = {basic: temp, values: []}
            basicInfo = tempMap[infoKey]['basic']
        }

        if (rule.expertList && rule.expertList.length > 0) {
            for (let expert of rule.expertList) {
                let tempexport = Object.assign({}, expert, {expertScore: expert.score})
                delete tempexport.score
                let tempExportData = Object.assign({}, basicInfo, tempexport)
                let values = tempMap[infoKey].values
                values.push(tempExportData)
            }
        }
    }
    let datas = []
    for (let key in tempMap) {
        datas.push(...(tempMap[key].values || []))
    }
    tableData.value = datas
    loading.value = false
}
onMounted(() => {
    handlerTableData()
})
</script>

<style scoped lang="scss">
.project-review-body {
  height: 100%;
  display: flex;
  flex-direction: column;

  .project-review-overview {
    p {
      font-size: 16px;
      margin-bottom: 5px;
    }
  }

  .project-review-detail {
    flex: 1;
    min-height: 200px;
  }
}
</style>
