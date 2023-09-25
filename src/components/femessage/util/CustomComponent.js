import { h, resolveComponent } from "vue";
console.log(resolveComponent);

// Vue3 中函数式组件需要提供一个渲染函数
const CustomComponent = (props, context) => {
  // 返回一个渲染函数，可以使用 h 函数创建虚拟节点
  return h(
    resolveComponent(hyphenToPascal(props.component)),
    props,
    context.slots
  );
};

function hyphenToPascal(str) {
  console.log(str, "str");
  if (typeof str !== "string") {
    console.log(str);
    return "ElInput";
  }
  let arr = str.split("-");

  let resStr = arr.reduce(function (prev, cur) {
    let str = prev + cur.slice(0, 1).toUpperCase() + cur.slice(1);
    return str;
  });

  // 转小驼峰这一行不需要
  resStr = resStr.slice(0, 1).toUpperCase() + resStr.slice(1);

  return resStr;
}

export default CustomComponent;
