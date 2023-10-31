<script>
export default {
  setup(props, data) {
    // setup是一个函数, 让这个函数再返回一个函数
    return () => data.attrs.render(data.attrs);
  },
};
</script>
