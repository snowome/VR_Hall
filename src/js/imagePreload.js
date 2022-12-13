import {IS_CLEAR_PIC} from '@/config.js'

function imagePreload() {
    const imageURL = process.env.NODE_ENV === 'development' ? '../../' : './'
    const faces = ['b', 'd', 'f', 'l', 'r', 'u']
    if (IS_CLEAR_PIC) {
        for (let m = 1; m < 10; m++) {
            for (let n = 0; n < faces.length; n++) {
                for (let j = 1; j <= 5; j++) {
                    for (let k = 1; k <= 5; k++) {
                        _linkPreload(`${imageURL}_assets/images/sprite/room${m}/${faces[n]}/${j}_${k}.jpg`)
                    }
                }
            }

        }
    } else {
        for (let m = 1; m < 10; m++) {
            for (let n = 0; n < faces.length; n++) {
                _linkPreload(`${imageURL}_assets/images/room${m}/${faces[n]}.png`)
            }
        }
    }

    function _linkPreload(url, type) {
        const linkEle = document.createElement('link')
        linkEle.rel = 'prefetch'
        linkEle.as = 'image'
        linkEle.href = url
        linkEle.crossorigin = 'anonymous'

        document.head.appendChild(linkEle)
    }
}

export default imagePreload
