<template>
  <div class="is-loading"></div>
</template>

<style scoped lang="sass">
@import 'bulma/bulma'

div
  height: calc(100vh - 52px)

  &.is-loading
    position: relative
    pointer-events: nones

    &:after
      @include loader
      position: absolute
      top: calc(50% - 2.5em)
      left: calc(50% - 2.5em)
      width: 5em
      height: 5em
      border-width: 0.25em
</style>
