import { h, resolveComponent, markRaw } from "vue";

// Vue3 中函数式组件需要提供一个渲染函数
const VNode = (props, content) => {
    console.log(props, content);
    return h(props.content)


};

function hyphenToPascal(str) {
    let arr = str.split("-");

    let resStr = arr.reduce(function (prev, cur) {
        let str = prev + cur.slice(0, 1).toUpperCase() + cur.slice(1);
        return str;
    });

    // 转小驼峰这一行不需要
    resStr = resStr.slice(0, 1).toUpperCase() + resStr.slice(1);

    return resStr;
}

export default VNode;
