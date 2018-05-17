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

const Item = ({actions = {}, persist = {}, item, ...props}) => (
    <div className={style.card}>
        <div className={style.thumb} style={ { backgroundImage: `url(${item.cover})`} }>
            <div className={`${style.overlay}`} onClick={(e) => actions.show(item, e)}>
                <i className={`material-icons ${style.playIcon}`}>play_circle_filled</i>
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

const List = ({items, isFetching, failed, ...props}) => (
    <div className={`${style.container}`}>
        {[
             failed ? <p key='list-failed'>`FAILED: ${JSON.stringify(failed, null, 4)}`</p>: null,
             items.length ? items.map((item, i) => (
                 <Item key={i} item={item} {...props}/>
             )) : null,
             isFetching ? <p key='list-loading'>Loading...</p>: null,
        ]}


    </div>

)

export default List;
