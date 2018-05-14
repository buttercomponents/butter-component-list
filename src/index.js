import React, { Component } from 'react';
import {Stars} from 'butter-base-components';
import PropTypes from 'prop-types';
import style from './style.styl';

const FavouriteButton = ({actions = {}, favourites = {}, id}) => {
    const active = favourites[id]

    return (
        <i className={`material-icons ${style.favIcon} ${active ? 'active': ''}`}
           onClick={() => (console.error('CALLBACK', id, active, actions) || active ? actions.remove(id) : actions.add(id))}>
            favorite</i>
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
        <div className={`${style.stars}`}>
            <Stars rating={item.rating}/>
        </div>
        <div className={`${style.itemYear}`}>{item.year}</div>
    </div>
)

const List = ({items, isFetching, failed, ...props}) => (
    <div className={`${style.container}`}>
        {[
             isFetching ? <p>Loading...</p>: null,
             failed ? <p>`FAILED: ${JSON.stringify(failed, null, 4)}`</p>: null,
             items.length ? items.map((item, i) => (
                 <Item key={i} item={item} {...props}/>
             )) : <div>Empty List</div>
        ]}


    </div>

)

export default List;
