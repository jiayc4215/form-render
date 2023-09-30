<template>
    <div class="box">slot-label</div>

    <el-form-renderer label-width="100px" :content="content" />
</template>
<script setup>
import { reactive, h } from "vue";
import elFormRenderer from "../components/femessage/el-form-renderer.vue";
const content = reactive([
    {
        type: 'input',
        id: 'name',
        label: h(
            'span',
            [
                '名称',
                h(
                    'i',
                    {
                        class: 'el-icon-edit'
                    }
                )
            ]
        ),
    }, {
        type: 'select',
        id: 'region',
        label: h('span', [
            '地点',
            h('i', {
                class: 'el-icon-eleme'
            })
        ]),
        options: [{
            label: 'area1',
            value: 'shanghai'
        }, {
            label: 'area2',
            value: 'beijing'
        }],
    }
]);
</script>
<style scoped>
.box {
    margin: 20px 0;
    font-size: 20px;
}
</style>
