/**
 * create by liuhao
 * date 2018-04-13
 * 不建议使用filter，除非特殊情况或者vue有更好的更新，因为通过自己的了解vue2.0以后filter变为非纯管道
 * 在每次component中绑定数据发生变化的时候，fitler都会被触发，性能可能会出奇的低
 * 所以如非必要，不要使用filter了
 */