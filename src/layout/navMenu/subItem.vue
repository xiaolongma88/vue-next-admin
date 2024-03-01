<template>
	<template v-for="val in chils">
		<el-sub-menu :teleported="true" :index="val.path" :key="val.path" v-if="val.children && val.children.length > 0">
			<template #title>
				<SvgIcon :name="val.meta.icon" />
				<span>{{ val.meta.title }}</span>
			</template>
			<sub-item :chil="val.children" />
		</el-sub-menu>
		<template v-else>
			<AsideLink :to="other.resolvePath(val.path, val.query)">
        <el-menu-item :index="other.resolvePath(val.path)" :key="val.path" >
          <template v-if="!val.meta.isLink || (val.meta.isLink && val.meta.isIframe)" >
            <SvgIcon :name="val.meta.icon" />
            <span>{{ val.meta.title }}</span>
          </template>
          <template v-else>
            <a class="w100" @click.prevent="onALinkClick(val)">
              <SvgIcon :name="val.meta.icon" />
              {{ val.meta.title }}
            </a>
          </template>
        </el-menu-item>
			</AsideLink>
		</template>
	</template>
</template>

<script setup name="navMenuSubItem">
import { computed } from 'vue';
import other from '/@/utils/other';
import AsideLink from './asideLink.vue';

// 定义父组件传过来的值
const props = defineProps({
	// 菜单列表
	chil: {
		type: Array,
		default: () => [],
	},
});

// 获取父级菜单数据
const chils = computed(() => {
	return props.chil;
});
// 打开外部链接
const onALinkClick = (val) => {
	other.handleOpenLink(val);
};
</script>
