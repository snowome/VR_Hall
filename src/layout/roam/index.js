import {template} from 'lodash-es'
import './roam.scss'

const tpl = require('./roam.tpl')

const roamImage = require('./manyou.png')

const data ={
    roamImage,
}

const compiled = template(tpl)(data)

document.getElementById('roam-container').innerHTML = compiled

