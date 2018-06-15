import React, { Component } from 'react'
import IntersectionVisible from 'react-intersection-visible'

import {Stars} from 'butter-base-components'
import PropTypes from 'prop-types'
import style from './style.styl'

import PlayCircle from './icons/play-circle.svg'
import Info from './icons/information-variant.svg'
import Heart from './icons/heart.svg'

const stopBubbles = (e) => {
  e.preventDefault()
  e.stopPropagation()
}

const FavouriteButton = ({actions = {}, favourites = {}, id}) => {
  const active = favourites[id]

  return (
    <Heart className={`${style.favIcon} ${active ? 'active' : ''}`}
      onClick={(e) => {
        stopBubbles(e)
        actions.toggle(id)
      }} />
  )
}

FavouriteButton.propTypes = {
  actions: PropTypes.object,
  favourites: PropTypes.object,
  id: PropTypes.string
}

const PlayButton = ({action}) => (
  <PlayCircle onClick={action} className={style.playIcon} />
)

const InfoButton = () => (
  <Info className={style.playIcon} />
)

PlayButton.propTypes = {
  action: PropTypes.func
}

const Item = ({actions, markers, item, itemShowPlay, itemWidth, itemHeight, type, ...props}) => (
  <div className={style.card} role={type}
    style={{
      width: itemWidth,
      height: itemHeight
    }}
    onClick={(e) => actions.show(item)}>
    <div className={style.thumb} style={{backgroundImage: `url(${item.poster})`}}>
      <div className={`${style.overlay}`}>
        {itemShowPlay ? <PlayButton action={(e) => {
          stopBubbles(e)
          actions.play(item)
        }} /> : <InfoButton />}
      </div>
      <FavouriteButton actions={actions.favourites} favourites={markers.favourites} id={item.id} />
    </div>
    <div className={`${style.itemTitle}`}>{item.title}</div>
    <div className={`${style.hoverContainer}`}>
      <div className={`${style.stars}`}>
        <Stars rating={Number(item.rating)} />
      </div>
      <div className={`${style.itemYear}`}>{item.year}</div>
    </div>
  </div>
)

Item.defaultProps = {
  actions: {},
  markers: {},
  item: {},
  itemShowPlay: true,
  itemHeight: '15rem',
  itemWidth: '15rem',
  type: 'list-item'
}

Item.propTypes = {
  actions: PropTypes.object,
  markers: PropTypes.object,
  item: PropTypes.object,
  itemShowPlay: PropTypes.bool,
  itemWidth: PropTypes.string,
  itemHeight: PropTypes.string,
  type: PropTypes.string
}

const Failed = ({failed}) => {
  if (failed && failed.length) {
    return (<p key='list-failed' className={style.failed}>
      {`FAILED: ${JSON.stringify(failed, null, 4)}`}
    </p>)
  }
  return null
}

const ListItems = ({items = [], itemType, ...props}) => {
  if (!items.length) {
    return null
  }

  return items.map((item, i) => (
    <Item key={i} item={item} type={itemType} {...props} />
  ))
}

class List extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      page: -1
    }

    this.checkIntersect = (cb) => (e) => {
      const [entry] = e

      if (entry.intersectionRatio) {
        cb(entry, this.state.page + 1)
      }
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.items.length < this.props.items.length) {
      this.setState(state => ({
        page: state.page + 1
      }))
    }
  }

  render () {
    const {items, type, onStarve = () => {}, isFetching, failed, ...props} = this.props
    const {page} = this.state
    const {itemWidth} = this.props

    const count = items.length

    return [
      <Failed key='list-failed' failed={failed} />,
      <div key='list-main' role={type} className={`${style.container}`}
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(${itemWidth}, 1fr))`
        }}>
        {[
          <ListItems key={`list-items-${count}`} items={items} {...props} />,
          isFetching ? <p key='list-loading'>Loading...</p> : null,
          <IntersectionVisible
            onIntersect={this.checkIntersect(onStarve)}
            key={`scroll-marker-${page}`} />
        ]}
      </div>
    ]
  }
}

List.propTypes = {
  items: PropTypes.array,
  type: PropTypes.string,
  onStarve: PropTypes.func,
  isFetching: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ]),
  failed: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array
  ])
}

List.defaultProps = {
  items: [],
  type: 'list',
  failed: false,
  itemWidth: '15rem',
  itemHeight: '15rem'
}

class Test extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 0,
      items: props.items
    }

    this.onStarve = (e, page) => {
      console.error('starve', e)
      this.setState(state => {
        if (page > 10) {
          return state
        }

        return {
          page: page,
          items: state.items.concat(this.props.items.map(item =>
            Object.assign({}, item, {title: `${page} - ${item.title}`})))
        }
      })
    }
  }

  render () {
    const {items, page} = this.state
    console.error('render')

    return ([
      <p style={{position: 'fixed'}}>page:<br />{page}</p>,
      <List {...this.props} items={items} onStarve={this.onStarve} />
    ])
  }
}

export {Test as default, List, Item}
