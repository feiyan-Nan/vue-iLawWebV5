<template lang="pug">
  .loading(:class="{'loading--full': fullscreen, 'loading--normal': !fullscreen}" :id="id")
    .loading_background(:class="background")
    .loading_content(:class="'loading_content--' + size")
        .loader
            .loader_icon
                i(:class="spinner")
            svg.loader_circle(viewBox="25 25 50 50" )
                circle.loader_path(cx="50" cy="50" r="20" fill="none" stroke-width="0.5")
        .loading_text {{text}}
</template>
<script>
export default {
  data () {
    return {
      text: '',
      spinner: '',
      background: '',
      customClass: '',
      size: '',
      fullscreen: true
    }
  },
  computed: {
    id () {
      return `dialog-${(Math.random() * 1000).toFixed(0)}`
    }
  }
}
</script>
<style lang="scss" scoped>
@keyframes loading_rotate {
    100% { transform: rotate(360deg); }
}
@keyframes loading_dash {
    0% {
        stroke-dasharray: 1,200;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 89,200;
        stroke-dashoffset: -35;
    }
    100% {
        stroke-dasharray: 89,200;
        stroke-dashoffset: -124;
    }
}
@keyframes loading_color {
    0% {
        stroke: $theme-color;
    }
    40% {
        stroke: fadeout($theme-color, 50%);
    }
    90% {
        stroke: $theme-color;
    }
}
$base_size: 6rem;
.loading {
    transition: all 1s;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 9999;
    @at-root #{&}--full {
        position: fixed;
    }
    @at-root #{&}--normal {
        position: absolute;
    }
    @at-root #{&}_background {
        height: 100%;
        width: 100%;
        background: $color-white;
        opacity: 0.7;
    }
    @at-root #{&}_content{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .loader {
            position: absolute;
            width: $base_size;
            height: $base_size;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            @at-root #{&}_icon {
                i:before {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    display: block;
                    text-align: center;
                    font-family: 'icon-bass';
                    font-size: 2.4rem;
                    color: $theme-color-lighter;
                    transform: translate(-50%, -50%);
                }
                i.default:before {
                    content: '\EA52';
                }
            }
            @at-root #{&}_circle {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                animation: loading_rotate 2s linear infinite;
                transform-origin: center center;
            }
            @at-root #{&}_path {
                stroke-dasharray: 150,200;
                stroke-dashoffset: -10;
                stroke-linecap: round;
                animation: loading_dash 1.5s ease-in-out infinite, loading_color 3s ease-in-out infinite;
            }
        }
        .loading_text {
            text-align: center;
            margin-top: 7.5rem;
            padding-right: 1px;
        }
        @at-root #{&}--medium {
            .loader {
                transform: translate(-50%, -50%) scale(0.5);
            }
            .loading_text {
                margin-top: 4.5rem;
                transform: scale(0.875);
            }
        }
        @at-root #{&}--small {
            .loader {
                transform: translate(-50%, -50%) scale(0.25);
            }
            .loading_text {
                margin-top: 3rem;
                transform: scale(0.5);
            }
        }
    }
}
</style>
