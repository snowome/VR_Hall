import * as THREE from 'three'

import {FACE_WIDTH, IS_CLEAR_PIC, CAMERA_FOV} from '@/config.js'
import {ROOM_MEDIA, GUIDE_POSTS, TIMER, SIX_FACE, VIDEO_DATA} from '@/room_data.js'

import {createGuidepost} from './createGuidepost.js'

const sourceURL = process.env.NODE_ENV === 'development' ? '../../' : './'

const textureLoader = new THREE.TextureLoader()
// 视频封面图片
const posterImage = require('@/texture/poster.jpg')
// 暂停播放图片
const pauseImage = require('@/texture/pauseIcon.png')
// 播放按钮
const playImage = require('@/texture/playIcon.png')

// 创建房间
function createRoom(scene, roomName) {
    const sixFace = createFace(roomName)
    sixFace.forEach(item => {
        scene.add(item)
        SIX_FACE.push(item)
    })
}

// 创建房间额6个面
function createFace(roomName) {
    const _createFace = function (roomName, flag) {
        if (IS_CLEAR_PIC) {
            return _createClearFace(roomName, flag)
        } else {
            return _createRoughFace(roomName, flag)
        }
    }
    const sixFace = []
    // 前面
    const faceFront = _createFace(roomName, 'f')
    faceFront.rotation.y = (180) * Math.PI / 180
    faceFront.position.z = FACE_WIDTH / 2
    sixFace.push(faceFront)

    // 后面
    const faceBack = _createFace(roomName, 'b')
    faceBack.position.z = -FACE_WIDTH / 2
    sixFace.push(faceBack)

    // 左侧
    const faceLeft = _createFace(roomName, 'l')
    faceLeft.rotation.y = (-90) * Math.PI / 180
    faceLeft.position.x = FACE_WIDTH / 2
    sixFace.push(faceLeft)

    // 右侧
    const faceRight = _createFace(roomName, 'r')
    faceRight.rotation.y = (90) * Math.PI / 180
    faceRight.position.x = -FACE_WIDTH / 2
    sixFace.push(faceRight)

    // 上面
    const faceUper = _createFace(roomName, 'u')
    faceUper.rotation.x = (90) * Math.PI / 180
    faceUper.position.y = FACE_WIDTH / 2
    sixFace.push(faceUper)

    // 下面
    const faceDown = _createFace(roomName, 'd')
    faceDown.rotation.x = (-90) * Math.PI / 180
    faceDown.position.y = -FACE_WIDTH / 2
    sixFace.push(faceDown)

    return sixFace
}

/** 创建清晰的房间，图片比较大的时候，将图片拆分为小图片
 * 每个面的图片拆分为长5份，宽5份，5*5=25张图片
 * **/
function _createClearFace(roomName, flag) {
    let column = 1
    // 小图片的宽度
    const smallPicWidth = FACE_WIDTH / 5
    const group = new THREE.Group()
    group.name = `face_${flag}`
    for (let xAxis = -FACE_WIDTH / 2; xAxis < FACE_WIDTH / 2; xAxis = xAxis + smallPicWidth) {
        let row = 1
        for (let yAxis = FACE_WIDTH / 2; yAxis > -FACE_WIDTH / 2; yAxis = yAxis - smallPicWidth) {
            const geometry = new THREE.PlaneGeometry(smallPicWidth, smallPicWidth, 32, 32)
            const material = new THREE.MeshBasicMaterial({
                map: textureLoader.load(`${sourceURL}_assets/images/sprite/${roomName}/${flag}/${row}_${column}.jpg`)
            })
            const mesh = new THREE.Mesh(geometry, material)
            mesh.position.x = xAxis + smallPicWidth / 2
            mesh.position.y = yAxis - smallPicWidth / 2
            mesh.position.z = 0

            group.add(mesh)
            row++
        }
        column++
    }
    return group
}


/** 创建粗糙的房间，图片经过压缩，比较小
 * 6个面，每个面一张图片
 * **/
function _createRoughFace(roomName, flag) {
    const geometry = new THREE.PlaneBufferGeometry(FACE_WIDTH, FACE_WIDTH, 32, 32)
    const material = new THREE.MeshBasicMaterial({
        map: textureLoader.load(`${sourceURL}_assets/images/${roomName}/${flag}.png`),
    })
    return new THREE.Mesh(geometry, material)
}

/** 修改房间的场景 **/
function changeScene(scene, camera, roomName, fn) {
    const sixFace = createFace(roomName)
    console.log(roomName)
    cameraAnimate()

    function cameraAnimate() {
        if (TIMER.camera) {
            clearTimeout(TIMER.camera)
        }
        TIMER.camera = setTimeout(() => {
            camera.fov -= 1
            camera.updateProjectionMatrix()
            if (camera.fov > 75) {
                cameraAnimate()
            } else {
                clearTimeout(TIMER.camera)
                camera.fov = CAMERA_FOV
                camera.updateProjectionMatrix()
                // 删除多媒体
                mediaInit(scene)
                // 删除原有路标
                GUIDE_POSTS.forEach(item => {
                    scene.remove(item)
                })
                GUIDE_POSTS.length = 0
                // 删除房间的6个面
                SIX_FACE.forEach(item => {
                    scene.remove(item)
                })
                SIX_FACE.length = 0
                // 添加多媒体
                createMedia(scene, roomName)
                // 添加房间的6个面
                sixFace.forEach(item => {
                    scene.add(item)
                    SIX_FACE.push(item)
                })
                // 添加路标
                createGuidepost(scene, roomName)
                if (fn instanceof Object) {
                    fn()
                }
            }
        }, 20)
    }

}

// 多媒体信息初始化
function mediaInit(scene) {
    const videos = []
    scene.traverse(item => {
        if (item.name.indexOf('group_room') > -1) {
            videos.push(item)
        }
    })
    videos.forEach(item => {
        item.removeFromParent()
    })
    VIDEO_DATA.length = 0
    const videoEle = document.getElementsByTagName('video')
    if (videoEle.length) {
        for (let ele of videoEle) {
            ele.pause()
            document.documentElement.removeChild(ele)
        }
    }
}

// 添加多媒体
function createMedia(scene, roomName) {
    if (ROOM_MEDIA[roomName] && ROOM_MEDIA[roomName]['mp4']) {
        const videoList = ROOM_MEDIA[roomName]['mp4']
        videoList.forEach((media, index) => {
            const meshName = roomName + '_' + index
            const bounds = media.bounds
            const centerX = (bounds[0].x + bounds[1].x) / 2
            const centerY = (bounds[0].y + bounds[1].y) / 2
            const centerZ = bounds[0].z
            if (media.face === 'b') {
                const video = createFaceVideo(media, meshName)
                video.position.x = centerX
                video.position.y = centerY
                video.position.z = centerZ
                scene.add(video)
            }

        })
    }

    function createFaceVideo(media, meshName) {
        const group = new THREE.Group()
        group.name = `group_${meshName}`
        const bounds = media.bounds
        const width = Math.abs(bounds[0].x - bounds[1].x)
        const height = Math.abs(bounds[0].y - bounds[1].y)

        // 视频
        const videoEle = document.createElement('video')
        videoEle.id = meshName
        videoEle.autoplay = false
        videoEle.loop = true
        videoEle.preload = 'auto'
        videoEle.innerHTML = `<source src=${sourceURL}_assets/${media.url} type="video/mp4">`
        document.documentElement.appendChild(videoEle)
        const videoTexture = new THREE.VideoTexture(videoEle)
        videoTexture.minFilter = THREE.LinearFilter
        videoTexture.magFilter = THREE.LinearFilter
        videoTexture.format = THREE.RGBAFormat
        const videoGeometry = new THREE.PlaneBufferGeometry(width, height, 32, 32)
        const videoMaterial = new THREE.MeshBasicMaterial({
            map: videoTexture,
            color: 0xffffff,
            depthTest: false,
            transparent: false,
            side: THREE.DoubleSide,
        })
        const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial)
        group.add(videoMesh)

        // 构建封面
        const posterGeometry = new THREE.PlaneBufferGeometry(width, height, 32, 32)
        const posterMaterial =new THREE.MeshBasicMaterial({
            map: textureLoader.load(posterImage),
        })
        const posterMesh = new THREE.Mesh(posterGeometry, posterMaterial)
        posterMesh.position.z = 1
        posterMesh.name = `poster_${meshName}`
        group.add(posterMesh)

        // 构建暂停按钮
        const pauseBtnGeometry = new THREE.PlaneGeometry(30, 30, 12, 12)
        const pauseBtnMaterial = new THREE.MeshBasicMaterial({
            map: textureLoader.load(pauseImage),
            transparent: true,
            opacity: 1,
        })
        const pauseMesh = new THREE.Mesh(pauseBtnGeometry, pauseBtnMaterial)
        pauseMesh.position.z = 2
        pauseMesh.name = `pause_${meshName}`
        pauseMesh.visible = false
        VIDEO_DATA.push(pauseMesh)

        // 构建播放按钮
        const playBtnGeometry = new THREE.PlaneGeometry(30, 30, 12, 12)
        const playBtnMaterial = new THREE.MeshBasicMaterial({
            map: textureLoader.load(playImage),
            transparent: true,
            opacity: 1,
        })
        const playMesh = new THREE.Mesh(playBtnGeometry, playBtnMaterial)
        playMesh.position.z = 2
        playMesh.name = `play_${meshName}`
        playMesh.visible = true
        VIDEO_DATA.push(playMesh)
        group.add(playMesh)
        return group
    }
}


export {createRoom, createFace, changeScene}
