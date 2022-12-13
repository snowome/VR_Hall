import * as THREE from 'three'
import {FACE_WIDTH, CAMERA_FOV} from '@/config.js'

const width = window.innerWidth
const height = window.innerHeight
const fov = CAMERA_FOV
const aspect = width / height
const near = 0.1
const far = FACE_WIDTH
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.set(0, 0, 0.1)
// camera.lookAt(scene.position)
camera.lookAt(new THREE.Vector3(0, 0, 0))

export {camera}
