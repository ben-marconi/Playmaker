import React from 'react';
import ReactDOM from 'react-dom';
import './Track.css';
const charLimit = 30;

export class Track extends React.Component {
    constructor(props) {
        super(props);
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.previewTrack = this.previewTrack.bind(this);
    }
    renderAction() {
        if (this.props.isRemoval) {
            return <button className="Track-action" onClick={this.removeTrack}>-</button>
        } else {
            return <button className="Track-action" onClick = {this.addTrack}>+</button>
        }
    }
    addTrack() {
        this.props.onAdd(this.props.track);
        this.props.recommend();
    }
    removeTrack() {
        this.props.onRemove(this.props.track);
    }
    
    previewTrack() {
        this.props.onPreview(this.props.track.uri)
    }

    render() {
        return (
            <div className="Track">
                <div className="Track-information">
                    <img src = {this.props.track.img}></img>
                    <h3>{this.props.track.name.length < charLimit ? this.props.track.name : this.props.track.name.slice(0, charLimit) + '...'}</h3>
                    <p>{this.props.track.artist} | {this.props.track.album.length < charLimit ? this.props.track.album : this.props.track.album.slice(0, charLimit) + '...'}</p>
                </div>
                <button className="Track-action" onClick={this.previewTrack}>▶</button>
                {this.renderAction()}
            </div>
        )
    }
}