import React, { Component } from 'react';
import {Stars} from 'butter-base-components';
import PropTypes from 'prop-types';
import style from './style.styl';

const stopBubbles = (e) => {
    e.preventDefault()
    e.stopPropagation()
}

const FavouriteButton = ({actions = {}, favourites = {}, id}) => {
    const active = favourites[id]

    return (
        <i className={`material-icons ${style.favIcon} ${active ? 'active': ''}`}
           onClick={(e) => {
                   stopBubbles(e)
                   active ? actions.remove(id) : actions.add(id)
           }}>
            favorite
        </i>
    )
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
        <div className={style.thumb} style={ { backgroundImage: `url(${item.poster})`} }>
            <div className={`${style.overlay}`}>
                <PlayButton action={(e) => {
                        stopBubbles(e)
                        actions.play(item)
                }} />
            </div>
            <FavouriteButton actions={actions.favourites} favourites={favourites} id={item.id}/>
        </div>
        <div className={`${style.itemTitle}`}>{item.title}</div>
        <div className={`${style.hoverContainer}`}>
            <div className={`${style.stars}`}>
                <Stars rating={Number(item.rating)}/>
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

const checkIntersect = (cb) => (e) => {
  const [intersect] = e

  if (!intersect.isIntersecting) {
    cb(intersect)
  }
}

const List = ({items, onStarve = () => {}, isFetching, failed, ...props}) => [
  (failed && failed.length)
    ? <p key='list-failed' className={style.failed}>
      {`FAILED: ${JSON.stringify(failed, null, 4)}`}
    </p> : null,
  <div key='list-main' className={`${style.container}`}>
    {[
      items.length ? items.map((item, i) => (
        <Item key={i} item={item} {...props} />
      )) : null,
      isFetching ? <p key='list-loading'>Loading...</p> : null,
      <IntersectionVisible onIntersect={checkIntersect(onStarve)} key='scroll-marker' />
    ]}
  </div>
]

List.propTypes = {
  items: PropTypes.array,
  onStarve: PropTypes.func,
  isFetching: PropTypes.bool,
  failed: PropTypes.bool
}


)

export {List as default, Item}
