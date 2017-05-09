import React from 'react'
import SearchBar from './search-bar.jsx'
import Dropdown from '../dropdown/dropdown.jsx'
import SearchSuggestions from './search-suggestion/search-suggestions.jsx'
import User from '../user/user.jsx'
import getStateObjectFromURL from '../../utils/getStateObjectFromURL'
import { browserHistory } from 'react-router'
import { fetchResults, saveSearchTermsToStore } from '../../actions'
import { connect } from 'react-redux'

class UserSearch extends React.Component {
	constructor(props) {
		super(props)
		const { searchItems, locationString, dropdownLabel } = getStateObjectFromURL(this.props.location.query)
		this.state = {
			searchItems,
			locationString,
			dropdownLabel,
			route: 'search',
			results: [],
			searchStarted: false,
			shouldUpdate: false,
		}
		this.handleDropdownSelect = this.handleDropdownSelect.bind(this)
		this.handleSearchBarInput = this.handleSearchBarInput.bind(this)
		this.handleSearchBarDelete = this.handleSearchBarDelete.bind(this)
	}

	componentWillMount() {
		const { searchItems, locationString } = this.state
		this.props.fetchResults(searchItems, locationString)
		this.props.saveSearchTermsToStore(this.state.searchItems)
	}

	handleSearchBarInput(searchArray) {
		const { searchItems } = this.state
		this.setState({
			searchItems: searchItems.concat(searchArray)
		})
		this.props.saveSearchTermsToStore(this.state.searchItems)
	}

	handleSearchBarDelete(deleteItem) {
		const { searchItems } = this.state
		searchItems.splice(searchItems.indexOf(deleteItem), 1)
		this.setState({
			searchItems
		})
		this.props.saveSearchTermsToStore(this.state.searchItems)
	}

	handleDropdownSelect(location) {
		if (location !== "all" && typeof location !== 'undefined') {
			this.setState({
				locationString: `&location=${location}`,
				dropdownLabel: location,
				searchStarted: true
			})
		} else {
			this.setState({
				locationString: "",
				dropdownLabel: "Alle Standorte"
			})
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { route, searchItems, locationString } = this.state
		const newRoute = `${route}?skills=${searchItems}${locationString}`
		const prevSearchString = `search${prevProps.location.search}`
		document.SearchBar.SearchInput.focus()
		if (prevSearchString !== newRoute) {
			browserHistory.push(newRoute)
		}
	}

	render() {
		const { results, dropdownLabel, searchItems, searchStarted } = this.state
		return (
			<div class="searchbar">
				<Dropdown
					onDropdownSelect={this.handleDropdownSelect}
					dropdownLabel={dropdownLabel} />
				<SearchBar
					onInputChange={this.handleSearchBarInput}
					onInputDelete={this.handleSearchBarDelete}
					parent={this}
					searchTerms={searchItems}
					noResults={results.length === 0}
					queryParams={this.props.location.query}>
					{/*<SearchSuggestions
						searchTerms={searchItems}
						noResults={results.length === 0} />*/}
				</SearchBar>
			</div>
		)
	}
}

export default connect(null, { fetchResults, saveSearchTermsToStore })(UserSearch)