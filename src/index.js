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
        active ? actions.remove(id) : actions.add(id)
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

const Item = ({actions = {}, favourites, item, ...props}) => (
  <div className={style.card} role='list-item' onClick={(e) => actions.show(item)}>
    <div className={style.thumb} style={{backgroundImage: `url(${item.poster})`}}>
      <div className={`${style.overlay}`}>
        <PlayButton action={(e) => {
          stopBubbles(e)
          actions.play(item)
        }} />
      </div>
      <FavouriteButton actions={actions.favourites} favourites={favourites} id={item.id} />
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
  favourites: PropTypes.object,
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

const List = ({items, onStarve = () => {}, isFetching, failed, ...props}) => [
]
      <Failed failed={failed} />,
      <div key='list-main' className={`${style.container}`}>
        {[
          <ListItems key={`list-items-${count}`} items={items} {...props} />,
          isFetching ? <p key='list-loading'>Loading...</p> : null,
          <IntersectionVisible
            onIntersect={this.checkIntersect(onStarve)}
            key={`scroll-marker-${page}`} />
        ]}
      </div>

List.propTypes = {
  items: PropTypes.array,
  onStarve: PropTypes.func,
  isFetching: PropTypes.bool,
  failed: PropTypes.bool
}

class Test extends Component {
  constructor (props) {
    super(props)
    this.state = {
      items: props.items,
      iteration: 1
    }

    this.onStarve = (e) => {
      this.setState(state => ({
        iteration: state.iteration + 1,
        items: state.items.concat(this.props.items.map(item =>
          Object.assign({}, item, {title: `${state.iteration} - ${item.title}`})))
      }))
    }
  }

  render () {
    const {items} = this.state
    console.error('render')

    return (<List {...this.props} items={items} onStarve={this.onStarve} />)
  }
}

export {Test as default, List, Item}
