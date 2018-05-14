import React, { Component } from 'react';
import {Stars} from 'butter-base-components';
import PropTypes from 'prop-types';
import style from './style.styl';

let Item = ({action, item, ...props}) => (
    <div className={style.card}>
        <div className={style.thumb} style={ { backgroundImage: `url(${item.cover})`} }>
            <div className={`${style.overlay}`} onClick={(e) => action(item, e)}>
                <i className={`material-icons ${style.playIcon}`}>play_circle_filled</i>
                <i className={`material-icons ${style.favIcon}`}>favorite</i>
            </div>
        </div>
        <div className={`${style.itemTitle}`}>{item.title}</div>
        <Stars rating={item.rating}/>
        <div className={`${style.itemYear}`}>{item.year}</div>
    </div>
)

let List = ({items, isFetching, failed, ...props}) => (
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
