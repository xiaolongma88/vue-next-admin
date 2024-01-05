<template>
	<div class="comp-examples">
		<div class="comp-examples-tree" v-show="!treeHidden">
			<RkAdAgTree
				:adTreeHidden="true"
				:agTreeHidden="false"
				@adNodeClick="adNodeClick"
				@adCurrentChange="adCurrentChange"
				@agNodeClick="agNodeClick"
				@agCurrentChange="agCurrentChange"
				@nodeClick="nodeClickMethod"
				@currentChange="currentChangeMethod"
				@toggleHidden="(hidden) => (treeHidden = hidden)"
			>
			</RkAdAgTree>
		</div>
		<div class="comp-examples-options">
			<div class="comp-examples-item">
				<div class="comp-examples-tree-node">
					<div class="node-title">
						<span>区划树点击节点-adNodeClick</span>
					</div>
					<div class="node-content">
						<div class="node-content-center">
							<pre>{{ adNodeClickItem }}</pre>
						</div>
					</div>
				</div>
				<div class="comp-examples-tree-node">
					<div class="node-title">
						<span>区划树变化节点-adCurrentChange</span>
					</div>
					<div class="node-content">
						<div class="node-content-center">
							<pre>{{ adCurrentItem }}</pre>
						</div>
					</div>
				</div>
			</div>
			<div class="comp-examples-item">
				<div class="comp-examples-tree-node">
					<div class="node-title">
						<span>单位树点击节点-agNodeClick</span>
					</div>
					<div class="node-content">
						<div class="node-content-center">
							<pre>{{ agNodeClickItem }}</pre>
						</div>
					</div>
				</div>
				<div class="comp-examples-tree-node">
					<div class="node-title">
						<span>单位树变化节点-agCurrentChange</span>
					</div>
					<div class="node-content">
						<div class="node-content-center">
							<pre>{{ agCurrentItem }}</pre>
						</div>
					</div>
				</div>
			</div>
			<div class="comp-examples-item">
				<div class="comp-examples-tree-node">
					<div class="node-title">
						<span>树点击节点</span>
					</div>
					<div class="node-content">
						<div class="node-content-center">
							<strong>adItem</strong>
							<pre>{{ nodeClickAdItem }}</pre>
							<strong>agItem</strong>
							<pre>{{ nodeClickAgItem }}</pre>
						</div>
					</div>
				</div>
				<div class="comp-examples-tree-node">
					<div class="node-title">
						<span>树变化节点-currentChange</span>
					</div>
					<div class="node-content">
						<div class="node-content-center">
							<strong>adItem</strong>
							<pre>{{ currentAdItem }}</pre>
							<strong>agItem</strong>
							<pre>{{ currentAgItem }}</pre>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
const treeHidden = ref(false);

const adCurrentItem = ref({});
const adNodeClickItem = ref({});
const adNodeClick = function (data, treeNode) {
	adNodeClickItem.value = data;
	console.log('TreePanelView-adNodeClick');
};
const adCurrentChange = function (data, treeNode) {
	adCurrentItem.value = data;
	console.log('TreePanelView-adCurrentChange');
};

const agCurrentItem = ref({});
const agNodeClickItem = ref({});
const agNodeClick = function (data, treeNode) {
	agNodeClickItem.value = data;
	console.log('TreePanelView-agNodeClick');
};
const agCurrentChange = function (data, treeNode) {
	agCurrentItem.value = data;
	console.log('TreePanelView-agCurrentChange');
};

const currentAdItem = ref({});
const currentAgItem = ref({});
const currentChangeMethod = function (adNode, agNode) {
	console.log('TreePanelView-currentChangeMethod');
	currentAdItem.value = adNode;
	currentAgItem.value = agNode;
};

const nodeClickAdItem = ref({});
const nodeClickAgItem = ref({});
const nodeClickMethod = (adNode, agNode) => {
	console.log('TreePanelView-nodeClickMethod');
	nodeClickAdItem.value = adNode;
	nodeClickAgItem.value = agNode;
};
</script>

<style lang="scss" scoped>
.comp-examples {
	// padding: 15px;
	height: 100%;
	display: flex;
	.comp-examples-tree {
		width: 400px;
	}
	.comp-examples-options {
		flex: 1;
		display: flex;
		.comp-examples-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			.comp-examples-tree-node {
				border: 1px solid;
				flex: 1;
				display: flex;
				flex-direction: column;
				margin-left: 5px;
				margin-bottom: 5px;
				.node-title {
					height: 25px;
					font-size: 16px;
					font-weight: 600;
					display: flex;
					align-items: center;
					padding: 15px;
					border-bottom: 1px solid;
				}
				.node-content {
					flex: 1;
					width: 100%;
					overflow: auto;
					display: flex;
					.node-content-center {
						position: relative;
						height: 0;
						flex-grow: 2;
						flex-shrink: 0;
						display: flex;
						flex-direction: column;
					}
				}
			}
		}
	}
}
</style>
