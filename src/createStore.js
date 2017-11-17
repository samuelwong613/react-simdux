import React, { Component } from 'react';
import EventEmitter from 'eventemitter3';

const RESERVED_KEY = ['connect','subscribe','unsubscribe','_ee','_state']

class SimduxStore {}

/**
 * Create a SimduxStore
 * @param {Object} object - the store
 * @return {SimduxStore}
 */
function createStore(object){

	if (typeof object !== 'object' || object.constructor.name !== 'Object')
		throw Error('react-simdux createStore: parameter must be an object');

	if (RESERVED_KEY.some(key => object[key] !== undefined))
		throw Error('react-simdux createStore: store cannot use the following reserved keys: '+RESERVED_KEY.join(', '));	

	const store = new SimduxStore();

	Object.defineProperty(store, 'subscribe', {	
		value: function(func){
			if (typeof func !== 'function')
				throw Error('react-simdux: subscribe: parameter must be a function');
			store._ee.on('SUB',func);
		},
		enumerable: true
	});

	Object.defineProperty(store, 'unsubscribe', {	
		value: function(func){
			if (typeof func !== 'function')
				throw Error('react-simdux: unsubscribe: parameter must be a function');
			store._ee.off('SUB',func);
		},
		enumerable: true
	});

	Object.defineProperty(store, '_ee', {	value: new EventEmitter() });
	Object.defineProperty(store, '_state', { value: {} });

	Object.keys(object).forEach(key => {

		if (typeof object[key] === 'function'){
			Object.defineProperty(store, key, {
				value: object[key].bind(store),
				enumerable: true
			});
		}else{
			store._state[key] = object[key];
			Object.defineProperty(store, key, {
				get: function() {
					return store._state[key];
				},
				set: function(value){			
					let oldState = {...store._state};
					store._state[key] = value;
					store._ee.emit('SET',key,value);
					store._ee.emit('SUB',key,oldState,store._state);								
				}
			})
		}
	})

	Object.freeze(store);	

	return store;
}

export default createStore;