import React from 'react';
import SearchBar from './search-bar.jsx';
import Results from './results/results.jsx';
import config from '../../config.json';

export default class SkillSearch extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchItems: [],
      searchStarted: false,
      shouldUpdate: false
    }
    this.toggleUpdate = this.toggleUpdate.bind(this);
    this.requestSearch = this.requestSearch.bind(this);
  }

  requestSearch(e, searchTerms) {
    fetch(config.backendServer + "/skills?"+ "search="+ searchTerms)
    .then(function(response) {
        console.log(config.backendServer +"/skills?"+ "search="+ searchTerms);
        return response.json();
    })
    .then(function(data) {
        e.setState({
          results: data,
          searchStarted: true,
          searchItems: searchTerms,
          shouldUpdate: true
        });
    })
    .catch(function(error) {
        console.error("requestSearch" + error);
        e.setState({results: null});
    });
  }

  componentDidUpdate() {
    document.SearchBar.SearchInput.focus();
  }

  // update component only if search has changed
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.shouldUpdate && ((this.state.results !== nextState.results) || (this.state.searchItems.length !== nextState.searchItems.length) ) ) {
      return true;
    }
    return false;
  }

  toggleUpdate(bool) {
    this.setState({
      shouldUpdate: bool
    }); 
  }

  render() {
    return(
      <div class="searchbar">
        <SearchBar handleRequest={this.requestSearch} toggleUpdate={this.toggleUpdate} parent={this} searchTerms={this.state.searchItems}/>
        {/* display Results component only when there has been an inital search */}
        {
          this.state.searchStarted ? 
            <Results results={this.state.results} searchTerms={this.state.searchItems} resultType={"skill"} /> 
          : " "
        }  
      </div>
    )
  }
}
