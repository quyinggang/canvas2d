<template>
  <div class="box" ref="boxElementRef"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const boxElementRef = ref(null)

onMounted(() => {
  const boxElement = boxElementRef.value
  class BarChat {
    constructor(rootElement, option) {
      this.defaultConfig = {
        pixelRatio: window.devicePixelRatio,
        width: 400,
        height: 300,
        gridMargin: {
          top: 40,
          bottom: 40,
          left: 100,
          right: 80
        },
        space: 30
      }
      this.option = option
      this.rootElement = rootElement
      this.canvas = this.createCanvas()
      this.ctx = this.canvas.getContext('2d')
      this.mountCanvas()
    }
    createCanvas() {
      const { width, height, pixelRatio } = this.defaultConfig
      const canvas = document.createElement('canvas')
      canvas.width = width * pixelRatio
      canvas.height = height * pixelRatio
      canvas.style.cssText = `width:${width}px;height:${height}px`
      return canvas
    }
    mountCanvas() {
      this.rootElement.appendChild(this.canvas)
    }
    processInfo() {
      const { defaultConfig, option } = this
      const { width, height, pixelRatio, gridMargin, space } = defaultConfig
      const { top, bottom, left, right } = gridMargin
      const realWidth = width * pixelRatio
      const realHeight = height * pixelRatio
      const { xAxisField, yAxisField, series, showBackground } = option
      const len = series.length
      const ticks = []
      const xAxis = []
      const yAxis = []
      const bars = []
      const backgrounds = []
      const start = {
        x: left,
        y: realHeight - bottom
      }
      const end = {
        x: realWidth - right,
        y: realHeight - bottom
      }
      const regionHeight = realHeight - top - bottom
      const xStep = Math.floor((end.x - start.x) / len)
      // y轴数值刻度写死，具体计算逻辑感兴趣可参考echarts等
      const yAxisTicks = [1000, 2000, 3000, 4000]
      const maxYTickValue = Math.max(...yAxisTicks)
      const yStep = Math.floor(regionHeight / yAxisTicks.length)
      for (let index = 0; index <= len; index++) {
        const item = series[index]
        const position = {
          x: start.x + index * xStep,
          y: start.y
        }
        if (item) {
          const xAxisValue = item[xAxisField]
          const yAxisValue = item[yAxisField]
          const barHeight = Math.floor((yAxisValue / maxYTickValue) * regionHeight) - 1
          const bar = {
            x: position.x + space,
            y: top + regionHeight - barHeight,
            width: xStep - space * 2,
            height: barHeight
          }
          xAxis.push(xAxisValue)
          bars.push(bar)
          if (showBackground) {
            const background = {
              x: bar.x,
              y: top,
              width: bar.width,
              height: regionHeight
            }
            backgrounds.push(background)
          }
        }
        ticks.push(position)
      }
      for (let index = 0, len = yAxisTicks.length; index < len; index++) {
        const value = yAxisTicks[index]
        const y = start.y - (index + 1) * yStep
        yAxis.push({
          start: {
            x: start.x,
            y
          },
          end: {
            x: end.x,
            y
          },
          value
        })
      }
      return {
        start,
        end,
        bars,
        backgrounds,
        ticks,
        xAxis,
        yAxis
      }
    }
    drawRect(rect, fillColor) {
      const ctx = this.ctx
      ctx.save()
      ctx.fillStyle = fillColor
      ctx.moveTo(rect.x, rect.y)
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
      ctx.restore()
    }
    drawText(value, tick, nextTick) {
      const ctx = this.ctx
      const textWidth = ctx.measureText(value).width
      const center = {
        x: Math.floor(tick.x + (nextTick.x - tick.x) / 2 - textWidth / 2),
        y: tick.y + 25
      }
      ctx.moveTo(center.x, center.y)
      ctx.fillText(value, center.x, center.y)
    }
    drawAxisTick(tick) {
      const ctx = this.ctx
      ctx.moveTo(tick.x, tick.y)
      ctx.lineTo(tick.x, tick.y + 8)
    }
    drawXAxis(start, end) {
      const ctx = this.ctx
      ctx.moveTo(start.x, start.y)
      ctx.lineTo(end.x, end.y)
    }
    drawYAxis(yAxis, start) {
      const { ctx, defaultConfig } = this
      const { left } = defaultConfig.gridMargin
      const offset = left - 15
      ctx.save()
      ctx.beginPath()
      ctx.textAlign = 'right'
      ctx.strokeStyle = 'rgb(225,230,240)'
      for (const item of yAxis) {
        const { start: ys, end: ye, value } = item
        ctx.moveTo(ys.x, ys.y)
        ctx.lineTo(ye.x, ye.y)
        ctx.fillText(value, offset, ys.y + 6)
      }
      ctx.fillText('0', offset, start.y + 6)
      ctx.stroke()
      ctx.closePath()
      ctx.restore()
    }
    renderBackground(backgrounds, tickLen) {
      for (let index = 0; index < tickLen; index++) {
        const background = backgrounds[index]
        background && this.drawRect(background, 'rgb(244,244,244)')
      }
    }
    render() {
      const { ctx, option } = this
      const { showBackground } = option
      const { start, end, ticks, xAxis, yAxis, bars, backgrounds } = this.processInfo()
      ctx.save()
      ctx.font = '20px serif'
      showBackground && this.renderBackground(backgrounds, ticks.length)
      this.drawYAxis(yAxis, start)
      ctx.beginPath()
      this.drawXAxis(start, end)
      for (let index = 0, len = ticks.length; index < len; index++) {
        const tick = ticks[index]
        const nextTick = ticks[index + 1]
        const xAxisValue = xAxis[index]
        const bar = bars[index]
        this.drawAxisTick(tick)
        bar && this.drawRect(bar, 'rgb(89,113,192)')
        nextTick && this.drawText(xAxisValue, tick, nextTick)
      }
      ctx.stroke()
      ctx.closePath()
      ctx.restore()
    }
  }

  const option = {
    xAxisField: 'day',
    yAxisField: 'value',
    showBackground: true,
    series: [
      { day: '周一', value: 1000 },
      { day: '周二', value: 2000 },
      { day: '周三', value: 4000 },
      { day: '周四', value: 2500 },
      { day: '周五', value: 3000 }
    ]
  }
  const bar = new BarChat(boxElement, option)
  bar.render()
})
</script>
