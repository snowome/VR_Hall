import * as THREE from 'three'

const directionalLight_1 = new THREE.DirectionalLight(0xffffff, 0.8)
directionalLight_1.position.set(200, 400, 300)
const directionalLightHelper_1 = new THREE.DirectionalLightHelper( directionalLight_1, 5 )

const directionalLight_2 = new THREE.DirectionalLight(0xffffff, 0.8)
directionalLight_2.position.set(-200, 400, 300)
const directionalLightHelper_2 = new THREE.DirectionalLightHelper( directionalLight_2, 5 )

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)

export {
    directionalLight_1,
    directionalLightHelper_1,
    directionalLight_2,
    directionalLightHelper_2,
    ambientLight,
}
