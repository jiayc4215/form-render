<template>
  <nav class="box">
    <router-link to="/">base</router-link> |

    <router-link to="/checkboxGroup">checkboxGroup</router-link> |

    <router-link to="/content">content</router-link> |

    <router-link to="/about">on</router-link> |

    <router-link to="/setoptios">setoptios</router-link> |

    <router-link to="/picker">picker</router-link> |

    <router-link to="/format">format</router-link> |

    <router-link to="/update">update</router-link> |

    <router-link to="/slot">slot</router-link> |

    <router-link to="/hidden">hidden</router-link> |

    <router-link to="/disabled">disabled</router-link> |
  </nav>
  <router-view></router-view>
</template>
<style>
.box {
  margin: 20px 0;
}
</style>
