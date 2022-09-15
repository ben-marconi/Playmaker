import React from 'react';
import ReactDOM from 'react-dom';
import './SearchBar.css';

export class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {term: ''};
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }

    search() {
        this.props.onSearch(this.state.term);
    }

    handleTermChange(e) {
        this.setState({term: e.target.value});
        this.search();
    }

    clearSearch() {
        document.querySelector(".searchInput").value='';
        document.querySelector(".searchInput").focus();
    }

    render() {
        return (
            <div className="SearchBar">
                <div id = 'searchDiv'>
                    <input autoFocus className = "searchInput" placeholder="Enter A Song, Album or Artist" onChange = {this.handleTermChange}/>
                    <button className = "clearSearch" onClick={this.clearSearch}>×</button>
                </div>
            </div>
        )
    }
}