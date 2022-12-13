import * as THREE from 'three'

import {
    directionalLight_1,
    directionalLightHelper_1,
    directionalLight_2,
    directionalLightHelper_2,
    ambientLight,
} from './light.js'
import {axesHelper} from './helper.js'

import {createRoom} from './createRoom.js'
import {createGuidepost} from './createGuidepost.js'


const scene = new THREE.Scene()

// scene.add(axesHelper)

// 创建第一个房间
createRoom(scene, 'room0')

// 创建第一个房间的路标
createGuidepost(scene, 'room0')


export {scene}
