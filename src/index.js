import React, { Component } from 'react';
import {Stars} from 'butter-base-components';
import PropTypes from 'prop-types';
import style from './styl/style.styl';

let Item = ({title, year,  rating, img}) => (
    <div className={style.card}>
        <div className={`${style.overlay}`}>
            <img src={img} />
            <i className={`material-icons ${style.playIcon}`}>play_circle_filled</i>
            <i className={`material-icons ${style.favIcon}`}>favorite</i>
        </div>
        <div className={`${style.itemTitle}`}>{title}</div>
        <Stars rating={rating}/>
        <div className={`${style.itemYear}`}>{year}</div>
    </div>
)

class List extends Component {
    render() {
        let {state, props} = this;


        console.error('props', props)

        if (props.items) {
            return (
                <div className={`${style.container}`}>
                    {
                        props.items.map((e, i) => (
                            <Item key={i} {...e} />
                        ))
                    }
                </div>

            )
        }

        return (
            <div>
                Empty List
            </div>
        )
    }
}

export default List;
