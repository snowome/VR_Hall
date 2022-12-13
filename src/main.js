import '@/css/common.scss'
import '@/layout/map/index.js'
import '@/layout/roam/index.js'

import {renderer} from '@/js/renderer.js'
import imagePreload from '@/js/imagePreload.js'

import {IS_PRELOAD} from '@/config.js'


document.body.appendChild(renderer.domElement)

if (IS_PRELOAD) {
    imagePreload()
}
