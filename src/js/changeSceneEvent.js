import * as THREE from 'three'
import GSAP from 'gsap'
import {GUIDE_POSTS, ROOM_DATA, TIMER, ROAM, VIDEO_DATA} from '@/room_data.js'
import {changeScene, createFace} from './createRoom.js'
import {createPI, isVisible} from '@/util/common.js'

const raycaster = new THREE.Raycaster()

// 点击路标到路标指定的房间
function toRoomByGuidepost(event, scene, camera) {
    event.preventDefault()

    const sx = event.clientX
    const sy = event.clientY

    const x = (sx / window.innerWidth) * 2 - 1
    const y = -(sy / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
    const intersects = raycaster.intersectObjects(GUIDE_POSTS)
    if (intersects.length) {
        const room = intersects[0].object
        const roomName = room.name.split('_')[1]
        toRoom(scene, camera, roomName)
    }
}

// 鼠标放在路标上的hover效果
function mousemoveEffect(event, camera) {
    event.preventDefault()

    const sx = event.clientX
    const sy = event.clientY

    const x = (sx / window.innerWidth) * 2 - 1
    const y = -(sy / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
    const intersects = raycaster.intersectObjects(GUIDE_POSTS)
    if (intersects.length) {
        const obj = intersects[0].object
        const guidePost = GUIDE_POSTS.find(item => item.name === obj.name)
        guidePost.scale.set(2, 2, 2)
        document.documentElement.style.cursor = 'pointer'
    } else {
        GUIDE_POSTS.forEach(item => {
            item.scale.set(1, 1, 1)
        })
        document.documentElement.style.cursor = 'auto'
    }
}

// 左上角地图导航 点击事件
function toRoom(scene, camera, roomName) {
    // 重置漫游
    ROAM.isRoaming = false
    ROAM.startDegree = 270
    ROAM.endDegree = 0
    ROAM.i = 0

    changeScene(scene, camera, roomName)
    updateMapDir(roomName)
}

// 修改左上角的地图导航方向等信息
function updateMapDir(roomName) {
    const mapDirEle = document.getElementById('map-dir')
    const roomRedDot = document.querySelector(`.${roomName}`)
    mapDirEle.style.opacity = 0
    GSAP.to('#map-dir', {
        top: (parseFloat(getComputedStyle(roomRedDot).top) - 40) + 'px',
        left: (parseFloat(getComputedStyle(roomRedDot).left) - 40) + 'px',
        duration: 2,
        opacity: 1,
        ease: 'elastic'
    })
}

// 右上角漫游功能
function autoRoaming(event, scene, camera, controls) {
    const rooms = ['room0', 'room1', 'room2', 'room3', 'room4', 'room5', 'room6', 'room7', 'room8', 'room9', 'room10', 'room1', 'room0']
    ROAM.isRoaming = !ROAM.isRoaming
    const roamTextEle = document.getElementById('roam-text')
    roamTextEle.innerText = ROAM.isRoaming ? '暂停' : '漫游'
    if (ROAM.i === 0) {
        controls.target = new THREE.Vector3(0, 0, 0)
        camera.position.x = 0
        camera.position.y = 0
        camera.position.z = 0
    }
    _roaming()

    function _roaming() {
        const current = rooms[ROAM.i]
        const next = rooms[ROAM.i + 1]
        if (ROAM.i + 1 === rooms.length) {
            ROAM.isRoaming = false
            roamTextEle.innerText = '漫游'
            ROAM.startDegree = 270
            ROAM.endDegree = 0
            ROAM.i = 0
        }
        ROOM_DATA[current].forEach(item => {
            if (!ROAM.isRoaming) {
                return
            }
            if (item.toRoom === next) {
                ROAM.endDegree = item.mandeg
                const arr = createPI(0, 0, 10, ROAM.startDegree, ROAM.endDegree, 1)
                ROAM.startDegree = item.mandeg
                if (item.reverse) {
                    arr.reverse()
                }
                let k = 0;
                let timer = setInterval(function () {
                    if (!ROAM.isRoaming) {
                        clearInterval(timer)
                        return
                    }
                    if (k >= arr.length - 1) {
                        changeScene(scene, camera, next, function () {
                            updateMapDir(next)
                            setTimeout(_roaming, 1000)
                        })
                        ROAM.i++;
                        clearInterval(timer)
                        return
                    }
                    controls.target = new THREE.Vector3(arr[k].x, 0.5, arr[k].y)
                    k++
                }, 30)
            }

        })
    }
}

// 视频播放、暂停等操作
function videoControl(event, scene, camera) {
    event.preventDefault()

    const sx = event.clientX
    const sy = event.clientY

    const x = (sx / window.innerWidth) * 2 - 1
    const y = -(sy / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
    const _videoData = VIDEO_DATA.filter(item => item.visible === true)
    const intersects = raycaster.intersectObjects(_videoData)
    if (intersects.length) {
        const obj = intersects[0].object
        const [type, roomName, index] = obj.name.split('_')

        const playBtnMesh = VIDEO_DATA.find(item => item.name === `play_${roomName}_${index}`)
        const pauseBtnMesh = VIDEO_DATA.find(item => item.name === `pause_${roomName}_${index}`)
        const group = scene.getObjectByName(`group_${roomName}_${index}`)
        obj.removeFromParent()
        const poster = group.getObjectByName(`poster_${roomName}_${index}`)
        if (poster) {
            poster.removeFromParent()
        }
        const videoEle = document.getElementById(`${roomName}_${index}`)
        if (type === 'play') {
            playBtnMesh.visible = false
            pauseBtnMesh.visible = true
            videoEle.play()
            group.add(pauseBtnMesh)
        } else if (type === 'pause') {
            playBtnMesh.visible = true
            pauseBtnMesh.visible = false
            videoEle.pause()
            group.add(playBtnMesh)
        }
    }

}

export {toRoomByGuidepost, mousemoveEffect, toRoom, autoRoaming, videoControl}



