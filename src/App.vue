<template>
  <nav class="box">
    <router-link to="/">Home</router-link> | <router-link to="/about">on</router-link> |
    <router-link to="/checkboxGroup">checkboxGroup</router-link>
  </nav>
  <router-view></router-view>
</template>
<style>
.box {
  margin: 20px 0;
}
</style>
