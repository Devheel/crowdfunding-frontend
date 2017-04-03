import React, {Component} from 'react'

import Accordion from '../Accordion'
import Status from '../Status'

import Router from 'next/router'
import Link from 'next/link'

import {HEADER_HEIGHT} from './Header'

import {
  Button,
  linkRule, P
} from '@project-r/styleguide'

export const SIDEBAR_WIDTH = 320

class Sidebar extends Component {
  constructor (props) {
    super(props)

    this.onScroll = () => {
      const y = window.pageYOffset
      const {sticky, setSticky} = this.props

      if (y + HEADER_HEIGHT > this.statusEndY) {
        if (!sticky.button) {
          setSticky({
            button: true
          })
        }
      } else if (sticky.button) {
        setSticky({
          button: false
        })
      }
    }
    this.statusRef = ref => { this.status = ref }
    this.measure = () => {
      if (this.status) {
        const y = window.pageYOffset
        const rect = this.status.getBoundingClientRect()
        this.statusEndY = y + rect.top + rect.height
      }
      this.onScroll()
    }
  }
  componentDidMount () {
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.measure)
    this.measure()
  }
  componentDidUpdate () {
    this.measure()
  }
  componentWillUnmount () {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.measure)
  }
  render () {
    return (
      <div>
        <div ref={this.statusRef}>
          <Status />
        </div>
        <Accordion onSelect={params => {
          Router.push({
            pathname: '/pledge',
            query: params
          }).then(() => window.scrollTo(0, 0))
        }} />
        <P>
          <Button big>Erinnern</Button>
        </P>
        <P>
          <Link href='/merci'>
            <a {...linkRule}>Schon unterstützt?</a>
          </Link>
        </P>
      </div>
    )
  }
}

export default Sidebar
