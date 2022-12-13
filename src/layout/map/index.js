import {template} from 'lodash-es'
import './map.scss'

const tpl = require('./map.tpl')

const mapImage = require('./map.png')
const redDotImage = require('./reddot.png')
const mapDirImage = require('./daoyin.png')

const data ={
    mapImage,
    redDotImage,
    mapDirImage,
}

const compiled = template(tpl)(data)

document.getElementById('map-container').innerHTML = compiled

