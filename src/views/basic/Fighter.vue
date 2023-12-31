<template>
  <div class="box" ref="boxElementRef">
    <canvas class="backgroundCanvas" ref="backgroundCanvasRef"></canvas>
    <canvas class="gameCanvas" ref="gameCanvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { loadImage } from '@/utils'
import backgroundAssets from '@/assets/plane/background.png'
import startAssets from '@/assets/plane/start.png'
import bulletAssets from '@/assets/plane/bullet.png'
import planeAssets from '@/assets/plane/plane.png'
import enemy1Assets from '@/assets/plane/enemy1.png'
import enemy1DownAssets from '@/assets/plane/enemy1_down.png'
import enemy2Assets from '@/assets/plane/enemy2.png'
import enemy2DownAssets from '@/assets/plane/enemy2_down.png'
import enemy3Assets from '@/assets/plane/enemy3.png'
import enemy3DownAssets from '@/assets/plane/enemy3_down.png'

const boxElementRef = ref(null)
const gameCanvasRef = ref(null)
const backgroundCanvasRef = ref(null)

onMounted(() => {
  const boxElement = boxElementRef.value
  const backgroundElement = backgroundCanvasRef.value
  const gameElement = gameCanvasRef.value
  const width = boxElement.clientWidth / 2
  const height = boxElement.clientHeight
  const dpr = window.devicePixelRatio
  backgroundElement.style.cssText = `width:${width}px;height:100%;`
  gameElement.style.cssText = `width: ${width}px;height:100%`
  backgroundElement.width = dpr * width
  backgroundElement.height = dpr * height
  gameElement.width = dpr * width
  gameElement.height = dpr * height
  const gameCanvasBounding = gameElement.getBoundingClientRect()
  const gameCanvasOffset = {
    left: gameCanvasBounding.left,
    top: gameCanvasBounding.top
  }

  const bgCanvasCtx = backgroundElement.getContext('2d')
  const gameCanvasCtx = gameElement.getContext('2d')
  bgCanvasCtx.scale(dpr, dpr)
  gameCanvasCtx.scale(dpr, dpr)

  const CANVAS_WIDTH = width
  const CANVAS_HEIGHT = height
  const ENEMY_FRAME_LIMIT = 10
  const STATE_ALIAS = {
    default: -1,
    ready: 0,
    started: 1,
    progress: 2,
    pause: 3,
    over: 4
  }
  const IMAGE_KEY_ALIAS = {
    bg: 'bg',
    start: 'start',
    plane: 'plane',
    bullet: 'bullet',
    enemy1: 'enemy1',
    enemy2: 'enemy2',
    enemy3: 'enemy3'
  }
  const LEVEL_INFO = {
    easy: 1,
    normal: 2,
    middle: 3,
    hard: 4
  }
  const LEVEL_ENEMY_LIMIT = {
    [LEVEL_INFO.easy]: {
      [IMAGE_KEY_ALIAS.enemy1]: 0.6 * ENEMY_FRAME_LIMIT,
      [IMAGE_KEY_ALIAS.enemy2]: 0.3 * ENEMY_FRAME_LIMIT,
      [IMAGE_KEY_ALIAS.enemy3]: 0.1 * ENEMY_FRAME_LIMIT
    },
    [LEVEL_INFO.normal]: {
      [IMAGE_KEY_ALIAS.enemy1]: 0.5 * ENEMY_FRAME_LIMIT,
      [IMAGE_KEY_ALIAS.enemy2]: 0.4 * ENEMY_FRAME_LIMIT,
      [IMAGE_KEY_ALIAS.enemy3]: 0.1 * ENEMY_FRAME_LIMIT
    },
    [LEVEL_INFO.middle]: {
      [IMAGE_KEY_ALIAS.enemy1]: 0.4 * ENEMY_FRAME_LIMIT,
      [IMAGE_KEY_ALIAS.enemy2]: 0.5 * ENEMY_FRAME_LIMIT,
      [IMAGE_KEY_ALIAS.enemy3]: 0.1 * ENEMY_FRAME_LIMIT
    },
    [LEVEL_INFO.hard]: {
      [IMAGE_KEY_ALIAS.enemy1]: 0.3 * ENEMY_FRAME_LIMIT,
      [IMAGE_KEY_ALIAS.enemy2]: 0.4 * ENEMY_FRAME_LIMIT,
      [IMAGE_KEY_ALIAS.enemy3]: 0.3 * ENEMY_FRAME_LIMIT
    }
  }
  const ENEMY_INFO = {
    [IMAGE_KEY_ALIAS.enemy1]: {
      score: 10,
      speed: 1.8,
      life: 20
    },
    [IMAGE_KEY_ALIAS.enemy2]: {
      score: 40,
      speed: 1.4,
      life: 60
    },
    [IMAGE_KEY_ALIAS.enemy3]: {
      score: 80,
      speed: 1,
      life: 100
    }
  }
  const imageNameMap = {
    [IMAGE_KEY_ALIAS.bg]: backgroundAssets,
    [IMAGE_KEY_ALIAS.start]: startAssets,
    [IMAGE_KEY_ALIAS.bullet]: bulletAssets,
    [IMAGE_KEY_ALIAS.plane]: planeAssets,
    [IMAGE_KEY_ALIAS.enemy1]: [enemy1Assets, enemy1DownAssets],
    [IMAGE_KEY_ALIAS.enemy2]: [enemy2Assets, enemy2DownAssets],
    [IMAGE_KEY_ALIAS.enemy3]: [enemy3Assets, enemy3DownAssets]
  }

  const clearGame = () => {
    gameCanvasCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  }
  const getNumberInRange = (min, max) => {
    const range = max - min
    const r = Math.random()
    return Math.round(r * range + min)
  }
  const checkInRange = (value, range) => {
    return value >= range[0] && value <= range[1]
  }
  const checkInArea = (position, area) => {
    const [x, y] = position
    const { tl, tr, bl, br } = area
    const isTl = x >= tl[0] && y >= tl[1]
    const isTr = x <= tr[0] && y >= tr[1]
    const isBl = x >= bl[0] && y <= bl[1]
    const isBr = x <= br[0] && y <= br[1]
    return isTl && isTr && isBl && isBr
  }

  class Background {
    constructor(image) {
      this.image = image
      this.raf = null
      this.offset = 0
      this.speed = 0.75
    }
    renderFrame() {
      const { image } = this
      bgCanvasCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      bgCanvasCtx.save()
      bgCanvasCtx.translate(0, this.offset)
      bgCanvasCtx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      bgCanvasCtx.drawImage(image, 0, -CANVAS_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT)
      bgCanvasCtx.restore()
      this.offset += this.speed
      if (this.offset >= CANVAS_HEIGHT) {
        this.offset = 0
      }
    }
    scroll() {
      this.renderFrame()
      this.raf = window.requestAnimationFrame(this.scroll.bind(this))
    }
    stop() {
      window.cancelAnimationFrame(this.raf)
      this.offset = 0
    }
  }

  // 敌机
  class Enemy {
    constructor(image, x, y, type, speed, life) {
      this.image = image
      this.x = x
      this.y = y
      this.width = image.width
      this.height = image.height
      this.type = type
      this.speed = speed
      this.life = life
      this.removable = false
    }
    render() {
      if (this.removable) return
      const { image, x, y } = this
      gameCanvasCtx.drawImage(image, x, y)
    }
    renderExploded(image) {
      if (this.removable) return
      const { x, y } = this
      gameCanvasCtx.drawImage(image, x, y)
    }
    attack() {
      if (this.removable) return
      this.y += this.speed
    }
    destroy() {
      this.removable = true
    }
    hit(damageValue) {
      this.life = Math.max(0, this.life - damageValue)
    }
  }

  // 子弹
  class Bullet {
    constructor(image, x, y) {
      this.image = image
      this.x = x
      this.y = y
      this.width = image.width
      this.height = image.height
      this.power = 10
      this.speed = 8
      this.removable = false
    }
    render() {
      if (this.removable) return
      const { image, x, y } = this
      gameCanvasCtx.drawImage(image, x, y)
    }
    fly() {
      this.y -= this.speed
    }
    destroy() {
      this.removable = true
    }
  }

  // 己方战机
  class Fighter {
    constructor(image, x, y) {
      this.image = image
      this.x = x
      this.y = y
      this.width = image.width
      this.height = image.height
    }
    render() {
      const { x, y, image } = this
      gameCanvasCtx.drawImage(image, x, y)
    }
    updatePosition(x, y) {
      this.x = x
      this.y = y
    }
  }

  class GameEngine {
    constructor(level) {
      this.state = STATE_ALIAS.default
      this.score = 0
      this.progress = 0
      this.background = null
      this.fighter = null
      this.raf = null
      this.level = level
      this.enemies = []
      this.bullets = []
      this.bulletRate = 0
      this.imageMap = new Map()
      this.enemyStats = {
        [IMAGE_KEY_ALIAS.enemy1]: 0,
        [IMAGE_KEY_ALIAS.enemy2]: 0,
        [IMAGE_KEY_ALIAS.enemy3]: 0
      }
      this.enemyFrameLimit = LEVEL_ENEMY_LIMIT[this.level]
      this.load()
    }
    // 加载所有图片资源并显示加载进度
    load() {
      this.renderProgress()
      const imageMap = this.imageMap
      const imageTotal = Object.values(imageNameMap).reduce((total, current) => {
        const count = Array.isArray(current) ? current.length : 1
        return total + count
      }, 0)
      const step = Number(parseFloat(1 / imageTotal).toPrecision(4))
      for (const [key, value] of Object.entries(imageNameMap)) {
        if (Array.isArray(value)) {
          const imageList = []
          for (let index = 0, len = value.length; index < len; index++) {
            const url = value[index]
            loadImage(url).then((image) => {
              imageList[index] = image
              this.progress += step
            })
          }
          imageMap.set(key, imageList)
        } else {
          loadImage(value).then((image) => {
            imageMap.set(key, image)
            this.progress += step
          })
        }
      }
    }
    // 加载进度显示
    renderProgress() {
      const progress = Math.ceil(this.progress * 100)
      const text = `${Math.min(100, progress)}%`
      gameCanvasCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      gameCanvasCtx.save()
      gameCanvasCtx.font = '30px arial'
      gameCanvasCtx.strokeStyle = 'rgba(0, 0, 0, 0.6)'
      const textWidth = gameCanvasCtx.measureText(text).width
      gameCanvasCtx.strokeText(text, (CANVAS_WIDTH - textWidth) / 2, CANVAS_HEIGHT / 2)
      gameCanvasCtx.restore()
      if (progress >= 100) {
        gameCanvasCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        this.progress = 1
        this.state = STATE_ALIAS.ready
        this.createScene()
        return
      }
      window.requestAnimationFrame(this.renderProgress.bind(this))
    }
    // 加载完成后渲染背景、开始页面
    createScene() {
      this.createBackground()
      this.renderStartScreen()
      this.bindClickEvent()
    }
    bindClickEvent() {
      gameElement.addEventListener('click', this.startGame.bind(this))
    }
    renderStartScreen() {
      const imageMap = this.imageMap
      const startImage = imageMap.get(IMAGE_KEY_ALIAS.start)
      gameCanvasCtx.drawImage(startImage, (CANVAS_WIDTH - startImage.width) * 0.5, 0)
    }
    finishGame() {
      clearGame()
      const score = this.score
      this.state = STATE_ALIAS.over
      this.reset()
      // 停止背景滚动
      this.background.stop()
      // 开始画面
      this.renderStartScreen()
      // 停止游戏渲染
      window.cancelAnimationFrame(this.raf)
      alert(`游戏结束，本轮总得分：${score}`)
    }
    reset() {
      this.enemies = []
      this.bullets = []
      this.bulletRate = 0
      this.score = 0
      this.enemyStats = {
        [IMAGE_KEY_ALIAS.enemy1]: 0,
        [IMAGE_KEY_ALIAS.enemy2]: 0,
        [IMAGE_KEY_ALIAS.enemy3]: 0
      }
    }
    destroy() {
      this.background.stop()
      window.cancelAnimationFrame(this.raf)
    }
    // 点击开始页面后开始5s倒计时后开始游戏
    startGame() {
      if (this.state === STATE_ALIAS.progress) return
      clearGame()
      this.state = STATE_ALIAS.started
      this.startCountDown().then(() => {
        this.state = STATE_ALIAS.progress
        // 背景滚动
        this.background.scroll()
        // 创建战机实例
        this.createFighter()
        this.controlFighter()
        // 渲染游戏每一帧内容
        this.renderGameFrame()
      })
    }
    renderGameFrame() {
      clearGame()
      this.bulletRate += 1
      // 控制当前页面上敌机数量限制
      if (this.enemies.length <= ENEMY_FRAME_LIMIT) {
        this.createEnemies()
      }
      // 控制战机子弹发射频率
      if (this.bulletRate % 10 === 0) {
        this.createBullets()
      }
      // 敌机移动开始攻击
      this.refreshEnemies()
      // 渲染战机
      this.fighter.render()
      // 战机开火
      this.refreshBullets()
      this.hitEnemy()
      this.renderScore()
      this.checkIsGameOver()
      if (this.state === STATE_ALIAS.over) return
      this.raf = requestAnimationFrame(this.renderGameFrame.bind(this))
    }
    startCountDown() {
      return new Promise((resolve) => {
        let count = 5
        const tipText = '5s倒计时开始，请准备！'
        gameCanvasCtx.save()
        gameCanvasCtx.font = '30px arial'
        const tipTextWidth = gameCanvasCtx.measureText(tipText).width
        gameCanvasCtx.fillText(tipText, (CANVAS_WIDTH - tipTextWidth) / 2, CANVAS_HEIGHT / 2)
        gameCanvasCtx.restore()
        const timer = setInterval(() => {
          clearGame()
          if (count <= 1) {
            clearInterval(timer)
            resolve()
            return
          }
          gameCanvasCtx.save()
          const text = count.toString()
          gameCanvasCtx.font = '60px arial'
          gameCanvasCtx.strokeStyle = 'rgba(0, 0, 0, 0.6)'
          const textWidth = gameCanvasCtx.measureText(text).width
          gameCanvasCtx.strokeText(count, (CANVAS_WIDTH - textWidth) / 2, CANVAS_HEIGHT / 2)
          gameCanvasCtx.restore()
          count -= 1
        }, 1000)
      })
    }
    renderScore() {
      gameCanvasCtx.save()
      gameCanvasCtx.font = '30px arial'
      gameCanvasCtx.fillText(`分数：${this.score}`, 10, 30)
      gameCanvasCtx.restore()
    }
    createBackground() {
      const imageMap = this.imageMap
      const backgroundImage = imageMap.get(IMAGE_KEY_ALIAS.bg)
      const background = new Background(backgroundImage)
      background.renderFrame()
      this.background = background
    }
    createFighter() {
      const imageMap = this.imageMap
      const planeImage = imageMap.get(IMAGE_KEY_ALIAS.plane)
      const x = (CANVAS_WIDTH - planeImage.width) / 2
      const y = CANVAS_HEIGHT - planeImage.height
      this.fighter = new Fighter(planeImage, x, y)
    }
    controlFighter() {
      const fighter = this.fighter
      let isDragging = false
      const width = fighter.width
      const height = fighter.height
      const xLimit = [0, CANVAS_WIDTH - width]
      const yLimit = [0, CANVAS_HEIGHT - height]
      gameElement.addEventListener('mousedown', () => {
        isDragging = true
      })
      gameElement.addEventListener('mousemove', (event) => {
        if (!isDragging) return
        const x = event.pageX - gameCanvasOffset.left - width / 2
        const y = event.pageY - gameCanvasBounding.top - height / 2
        fighter.updatePosition(
          Math.max(Math.min(x, xLimit[1]), xLimit[0]),
          Math.max(Math.min(y, yLimit[1]), yLimit[0])
        )
      })
      gameElement.addEventListener('mouseup', () => {
        isDragging = false
      })
    }
    createBullets() {
      const { imageMap, fighter } = this
      const leftBulletBasePos = {
        x: 13 + fighter.x,
        y: 21 + fighter.y
      }
      const rightBulletBasePos = {
        x: 77 + fighter.x,
        y: 21 + fighter.y
      }
      const bulletImage = imageMap.get(IMAGE_KEY_ALIAS.bullet)
      this.bullets.push(
        new Bullet(bulletImage, leftBulletBasePos.x, leftBulletBasePos.y),
        new Bullet(bulletImage, rightBulletBasePos.x, rightBulletBasePos.y)
      )
    }
    refreshBullets() {
      const bullets = this.bullets
      const liveBullets = []
      for (const bullet of bullets) {
        bullet.fly()
        if (bullet.y < 0) {
          bullet.destroy()
        }
        if (!bullet.removable) {
          liveBullets.push(bullet)
        }
        bullet.render()
      }
      this.bullets = liveBullets
    }
    createEnemies() {
      const enemies = []
      const { imageMap, enemyStats, enemyFrameLimit } = this
      const enemyTypes = [IMAGE_KEY_ALIAS.enemy1, IMAGE_KEY_ALIAS.enemy2, IMAGE_KEY_ALIAS.enemy3]
      const enemy1List = imageMap.get(enemyTypes[0])
      const enemy2List = imageMap.get(enemyTypes[1])
      const enemy3List = imageMap.get(enemyTypes[2])
      const enemyImages = [enemy1List[0], enemy2List[0], enemy3List[0]]
      for (let index = 0; index < 2; index++) {
        const typeIndex = Math.trunc(getNumberInRange(0, 2))
        const type = enemyTypes[typeIndex]
        const image = enemyImages[typeIndex]
        const { speed, life } = ENEMY_INFO[type]
        const x = getNumberInRange(0, CANVAS_WIDTH - image.width)
        const y = -image.height
        if (enemyStats[type] < enemyFrameLimit[type]) {
          enemyStats[type] += 1
          enemies.push(new Enemy(image, x, y, type, speed, life))
        }
      }
      this.enemies.push(...enemies)
    }
    refreshEnemies() {
      const { enemies, imageMap } = this
      const liveEnemies = []
      for (const enemy of enemies) {
        enemy.attack()
        if (enemy.y > CANVAS_HEIGHT) {
          this.destroyEnemy(enemy)
        }
        if (!enemy.removable) {
          const originLife = ENEMY_INFO[enemy.type].life
          const isAttacked = enemy.life < originLife
          const imageList = imageMap.get(enemy.type)
          isAttacked ? enemy.renderExploded(imageList[1]) : enemy.render()
          liveEnemies.push(enemy)
        }
      }
      this.enemies = liveEnemies
    }
    destroyEnemy(enemy) {
      this.enemyStats[enemy.type] -= 1
      enemy.destroy()
    }
    hitEnemy() {
      const { enemies, bullets } = this
      for (const enemy of enemies) {
        const { type, x, y, width, height } = enemy
        const enemyXRange = [x, x + width]
        const enemyYRange = [y, y + height]
        for (const bullet of bullets) {
          const isHit = checkInRange(bullet.x, enemyXRange) && checkInRange(bullet.y, enemyYRange)
          if (isHit) {
            bullet.destroy()
            enemy.hit(bullet.power)
            if (enemy.life <= 0) {
              this.score += ENEMY_INFO[type].score
              this.destroyEnemy(enemy)
            }
          }
        }
      }
    }
    checkIsGameOver() {
      const enemies = this.enemies
      const { x, y, width, height } = this.fighter
      const position = {
        tl: [x, y],
        tr: [x + width, y],
        bl: [x, y + height],
        br: [x + width, y + height]
      }
      for (const enemy of enemies) {
        const { x: ex, y: ey, width: ew, height: eh } = enemy
        const area = {
          tl: [ex, ey],
          tr: [ex + ew, ey],
          bl: [ex, ey + eh],
          br: [ex + ew, ey + eh]
        }
        if (
          checkInArea(position.tl, area) ||
          checkInArea(position.tr, area) ||
          checkInArea(position.bl, area) ||
          checkInArea(position.br, area)
        ) {
          this.finishGame()
          break
        }
      }
    }
  }

  const engine = new GameEngine(LEVEL_INFO.easy)

  onBeforeUnmount(() => engine.destroy())
})
</script>

<style scoped>
.box {
  position: relative;
}

canvas {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
}

.backgroundCanvas {
  z-index: 0;
}
</style>
