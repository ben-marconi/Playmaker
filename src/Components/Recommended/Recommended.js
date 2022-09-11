import React from 'react';
import {TrackList} from '../TrackList/TrackList';
import './Recommended.css';


export class Recommended extends React.Component {
    render(){
        return (
            <div className="Recommended">
                <h2>Recommended Songs</h2>
                <TrackList tracks = {this.props.recommended} onRemove = {this.props.onRemove} isRemoval = {false} onPreview = {this.props.onPreview} onAdd = {this.props.onAdd} recommend = {this.props.recommend}/>
            </div>
        )
    }
}