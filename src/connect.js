import React, { Component } from 'react';
import Wrapper from './Wrapper.js';

function _connect(storeOrView, namesOrFunc, extraProps, stores){
	let names, mapStoreToProps, view, store;

	if (typeof storeOrView === 'function' || storeOrView instanceof Component)											view = storeOrView;
	else if (typeof storeOrView === 'object' && storeOrView.constructor.name === 'SimduxStore')			store = storeOrView;
	else throw Error(`react-simdux: connect: unexpected parameter 1, only Component or SimduxStore should pass in`);

	if (view){

		return (ownProps)=>{
			return React.createElement(Wrapper,{
				ownProps, 
				view,
				stores: stores
			});
		}

	}else if (store){

		if (typeof namesOrFunc === 'string')						names = [namesOrFunc];
		else if (typeof namesOrFunc === 'function')			mapStoreToProps = namesOrFunc;
		else if (namesOrFunc instanceof Array)					names = namesOrFunc;
	
		if (mapStoreToProps === undefined && (names === undefined || names.some(n => typeof n !== 'string')))
			throw Error('react-simdux: connect: parameter must be a string[] or function for mapping store');
			
		if (!stores)	stores = [];

		return (storeOrView, namesOrFunc, extraProps) =>
			_connect(storeOrView, namesOrFunc, extraProps, [...stores, {store, names, mapStoreToProps, extraProps}])
			
	}
}

function connect(store, namesOrFunc, extraProps){
	if (typeof store !== 'object' || store.constructor.name !== 'SimduxStore')
		throw Error(`store must be a SimduxStore`);

	return _connect(store, namesOrFunc, extraProps, []);
}

module.exports = connect;