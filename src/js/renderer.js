import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {scene} from './scene.js'
import {camera} from './camera.js'
import {toRoomByGuidepost, mousemoveEffect, toRoom, autoRoaming, videoControl} from './changeSceneEvent.js'

const width = window.innerWidth
const height = window.innerHeight

const renderer = new THREE.WebGLRenderer({
    // antialias: true,
})
// renderer.setClearColor(0x001111, 1)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(width, height)
// renderer.outputEncoding = THREE.sRGBEncoding

const controls = new OrbitControls(camera, renderer.domElement)
// 启用阻尼
controls.enableDamping = true
// 阻尼惯性有多大。 Default is 0.05.
controls.dampingFactor = 0.05
// controls.
// controls.enablePan = false
// controls.minDistance = 3000           // camera.position.length()
// controls.maxDistance = 12000
// // 水平
// controls.minAzimuthAngle = -Math.PI / 6
// controls.maxAzimuthAngle = Math.PI / 6
// // 垂直
controls.maxPolarAngle = Math.PI / 2
controls.minPolarAngle = Math.PI / 2
// controls.target.set(x, y, 0)
// controls.update(); //update()函数内会执行camera.lookAt(controls.targe)

// 你能够将相机向外移动多少，其默认值为*Infinity*。
controls.maxDistance = 200

controls.addEventListener('change', function () {
    // console.log(camera.position)
    // console.log(controls.target)
})


function render() {
    renderer.render(scene, camera)
    controls.update()
    const mapDirEle = document.getElementById('map-dir')
    if (mapDirEle) {
        const degree = controls.getAzimuthalAngle() * 180 / Math.PI
        mapDirEle.style.transform = `rotate(${-degree}deg)`
    }
    requestAnimationFrame(render)
}

render()

window.addEventListener('resize', function () {
    const width = window.innerWidth
    const height = window.innerHeight
    // 更新宽高比
    camera.aspect = width / height
    // 更新摄像机投影矩阵
    camera.updateProjectionMatrix()
    // 更新渲染器
    renderer.setSize(width, height)
    // 设置设备像素比
    renderer.setPixelRatio(window.devicePixelRatio)
})

// 路标点击事件
document.addEventListener('click', event => toRoomByGuidepost(event, scene, camera), false)
document.addEventListener('mousemove', event => mousemoveEffect(event, camera), false)
// 左上角地图导航 点击事件
const mapEle = document.getElementById('map-container')
mapEle.addEventListener('click', function (event) {
    const target = event.target
    if (target.className.indexOf('room') > -1) {
        const roomName = target.dataset['name']
        toRoom(scene, camera, roomName)
    }
}, false)
// 右上角漫游功能
const roamEle = document.getElementById('roam-container')
roamEle.addEventListener('click', event => autoRoaming(event, scene, camera, controls), false)
// 视频播放、暂停
document.addEventListener('click', event => videoControl(event, scene, camera), false)

export {renderer}
