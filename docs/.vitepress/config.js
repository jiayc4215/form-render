export default {
  themeConfig: {
    siteTitle: false,
    logo: "/logo.png",
    nav: [
      { text: "指南", link: "/guide/form" },
      { text: "组件", link: "/assembly/form/basic" },
    ],
    socialLinks: [{ icon: "github", link: "https://gitee.com/childe-jia" }],
    sidebar: {
      "/guide/": [
        {
          text: "快速开始",
          items: [
            {
              text: "表单Form",
              link: "/guide/form",
            },
            {
              text: "表格table",
              link: "/guide/table",
            },
          ],
        },
      ],
      "/assembly/": [
        {
          text: "表单Form",
          items: [
            { text: "base", link: "/assembly/form/basic" },
            { text: "checkbox-group", link: "/assembly/form/checkbox-group" },
            { text: "content", link: "/assembly/form/content" },
            { text: "date-picker", link: "/assembly/form/date-picker" },
            { text: "deprecated", link: "/assembly/form/deprecated" },
            { text: "disabled", link: "/assembly/form/disabled" },
            { text: "el", link: "/assembly/form/el" },
            {
              text: "get-component-by-id",
              link: "/assembly/form/get-component-by-id",
            },
            { text: "get-form-value", link: "/assembly/form/get-form-value" },
            { text: "hidden", link: "/assembly/form/hidden" },
            { text: "next-tick", link: "/assembly/form/next-tick" },
            { text: "on", link: "/assembly/form/on" },
            { text: "radio-group", link: "/assembly/form/radio-group" },
            { text: "readonly", link: "/assembly/form/readonly" },
            { text: "remote", link: "/assembly/form/remote" },
            { text: "rules-plus", link: "/assembly/form/rules-plus" },
            { text: "rules", link: "/assembly/form/rules" },
            { text: "set-options", link: "/assembly/form/set-options" },
            { text: "slot-label", link: "/assembly/form/slot-label" },
            { text: "slot", link: "/assembly/form/slot" },
            { text: "update-form", link: "/assembly/form/update-form" },
            { text: "v-model", link: "/assembly/form/v-model" },
            { text: "value-format", link: "/assembly/form/value-format" },
          ],
        },

        {
          text: "表格table",
          items: [{ text: "表格", link: "/assembly/table/table" }],
        },
        {
          text: "进阶",
          items: [
            { text: "form自定义组件", link: "/assembly/advanced/customForm" },
            {
              text: "form自定义组件设置自定义校验规则",
              link: "/assembly/advanced/customFormRoules",
            },
          ],
        },
      ],
    },
  },
};
