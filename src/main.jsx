import {render} from 'preact'
import './app.css'
import {App} from './app.jsx'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

render(<App/>, document.getElementById('app'))
