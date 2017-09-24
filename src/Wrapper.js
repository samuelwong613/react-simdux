import React, { Component } from 'react';

class Wrapper extends Component {

	constructor(props){
		super(props);
		let { stores } = props;

		if (!stores || !(stores instanceof Array))
			throw Error('react-simdux: stores must be an array. This is impossible to reach here, please report this as a bug');

		// initial state
		this.state = {};
		this.stores = stores;
		stores.forEach(this.mapStoreToState);	
	}

	componentWillUnmount(){	
		this.stores.forEach( ({store, listener}) => store._ee.off('SET',listener) );
	}

	mapStoreToState = (storeConfig)=>{		
		let { store, names, mapStoreToProps } = storeConfig;
		let { ownProps } = this.props;
		
		if (names)
			names.forEach(name => this.state[name] = store[name] );
		else if (mapStoreToProps){
			let newState = mapStoreToProps(store, ownProps);
			Object.keys(newState).forEach( k => {
				this.state[k] = newState[k]
			});
		}
		storeConfig.listener = (name, value)=>this.onUpdate(storeConfig, name, value);
		store._ee.on('SET', storeConfig.listener);
	}	

	onUpdate = (storeConfig, name, value)=>{
		let { store, names, mapStoreToProps } = storeConfig;
		let { ownProps } = this.props;

		if (names){			
			if (names.some(n => n === name)){
				this.setState({
					[name]: value
				})
			}
		}else if (mapStoreToProps){
			let newState = mapStoreToProps(store, ownProps);			
			Object.keys(newState).forEach( k => {
				if (this.state[k] === newState[k])
					delete newState[k];
			});
			if (Object.keys(newState).length > 0)
				this.setState(newState);
		}
	}

	render(){
		let { state, props } = this;		
		let { ownProps, extraProps, names, store, view } = props;
		return React.createElement(view, {...ownProps, ...state, ...extraProps});
	}
}

module.exports = Wrapper;