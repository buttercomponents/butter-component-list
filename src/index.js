import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './styl/style.styl';

function makeStars(count, max=5) {
    let ret = []
    let i = 0

    for (i = 0; i < count; i += 1) {
        ret.push(<i key={i} className={`material-icons ${style.starFull}`}>star</i>)
    }

    for (; i < max; i += 1) {
        ret.push(<i key={i} className={`material-icons ${style.starEmpty}`}>star</i>)
    }

    return ret
}

let Stars = ({rating}) => (
    <div className={`${style.stars}`}>
        {makeStars(rating)}
    </div>
)

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
