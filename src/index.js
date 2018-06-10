import React, { Component } from 'react'
import IntersectionVisible from 'react-intersection-visible'

import {Stars} from 'butter-base-components'
import PropTypes from 'prop-types'
import style from './style.styl'

const stopBubbles = (e) => {
  e.preventDefault()
  e.stopPropagation()
}

const FavouriteButton = ({actions = {}, favourites = {}, id}) => {
  const active = favourites[id]

  return (
    <i className={`material-icons ${style.favIcon} ${active ? 'active' : ''}`}
       onClick={(e) => {
           stopBubbles(e)
           actions.toggle(id)
       }}>
        favorite
    </i>
  )
}

FavouriteButton.propTypes = {
  actions: PropTypes.object,
  favourites: PropTypes.object,
  id: PropTypes.string
}

const PlayButton = ({action}) => (
  <i onClick={action} className={`material-icons ${style.playIcon}`} >play_circle_filled</i>
)

PlayButton.propTypes = {
  action: PropTypes.func
}

const Item = ({actions = {}, markers = {}, item, ...props}) => (
  <div className={style.card} role='list-item' onClick={(e) => actions.show(item)}>
    <div className={style.thumb} style={{backgroundImage: `url(${item.poster})`}}>
      <div className={`${style.overlay}`}>
        <PlayButton action={(e) => {
          stopBubbles(e)
          actions.play(item)
        }} />
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

Item.propTypes = {
  actions: PropTypes.object,
  markers: PropTypes.object,
  item: PropTypes.object
}

const Failed = ({failed}) => {
  if (failed && failed.length) {
    return (<p key='list-failed' className={style.failed}>
      {`FAILED: ${JSON.stringify(failed, null, 4)}`}
    </p>)
  }
  return null
}

const ListItems = ({items = [], ...props}) => {
  if (!items.length) {
    return null
  }

  return items.map((item, i) => (
    <Item key={i} item={item} {...props} />
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
    const {items, onStarve = () => {}, isFetching, failed, ...props} = this.props
    const {page} = this.state

    const count = items.length

    return [
      <Failed key='list-failed' failed={failed} />,
      <div key='list-main' className={`${style.container}`}>
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
