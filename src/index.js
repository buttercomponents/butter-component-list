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
}

const PlayButton = ({action}) => (
    <i onClick={action} className={`material-icons ${style.playIcon}`} >play_circle_filled</i>
)

const Item = ({actions = {}, persist = {}, item, ...props}) => (
    <div className={style.card} role='list-item' onClick={(e) => actions.show(item)}>
        <div className={style.thumb} style={ { backgroundImage: `url(${item.poster})`} }>
            <div className={`${style.overlay}`}>
                <PlayButton action={(e) => {
                        stopBubbles(e)
                        actions.play(item)
                }} />
            </div>
            <FavouriteButton actions={actions.favourites} favourites={persist.favourites} id={item.id}/>
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

const List = ({items, isFetching, failed, ...props}) => ([
    (failed && failed.length) ? <p key='list-failed' className={style.failed}>`FAILED: ${JSON.stringify(failed, null, 4)}`</p>: null,
    <div key='list-main' className={`${style.container}`}>
        {[
             items.length ? items.map((item, i) => (
                 <Item key={i} item={item} {...props}/>
             )) : null,
             isFetching ? <p key='list-loading'>Loading...</p>: null,
        ]}
    </div>
]


)

export {List as default, Item}
