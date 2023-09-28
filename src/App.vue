<template>
  <nav class="box">
    content
    <router-link to="/">Home</router-link> |

    <router-link to="/about">on</router-link> |

    <router-link to="/checkboxGroup">checkboxGroup</router-link> |

    <router-link to="/content">content</router-link> |

    <router-link to="/setoptios">setoptios</router-link>
  </nav>
  <router-view></router-view>
</template>
<style>
.box {
  margin: 20px 0;
}
</style>
