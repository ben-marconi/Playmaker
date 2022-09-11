import React from 'react';
import ReactDOM from 'react-dom';
import {TrackList} from '../TrackList/TrackList';
import './SearchResults.css';

export class SearchResults extends React.Component {
    render() {
        return (
            <div className="SearchResults">
            <h2>Search Results</h2>
                <TrackList isRemoval = {false} onAdd = {this.props.onAdd} tracks = {this.props.searchResults} onPreview = {this.props.onPreview} recommend = {this.props.recommend}/>
            </div>
        )
    }
}