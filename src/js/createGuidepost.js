import * as THREE from 'three'
import {ROOM_DATA, GUIDE_POSTS} from '@/room_data.js'

const guidepostImg = require('@/texture/guidepost.png')

const textureLoader = new THREE.TextureLoader()

// 创建路标
function createGuidepost(scene, roomName) {
    const geometry = new THREE.CircleBufferGeometry(15, 20)
    const material = new THREE.MeshBasicMaterial({
        map: textureLoader.load(guidepostImg),
        transparent: true,
        opacity: 1,
    })
    const room = ROOM_DATA[roomName]
    room.forEach(item => {
        const position = item['position']
        const mesh = new THREE.Mesh(geometry, material)
        mesh.rotation.x = -Math.PI / 2
        mesh.position.set(position.x, position.y, position.z)
        mesh.name = `guidepost_${item.toRoom}`
        GUIDE_POSTS.push(mesh)
        scene.add(mesh)
    })
}

export {createGuidepost}
