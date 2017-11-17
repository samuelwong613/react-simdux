# react-simdux

**Simdux** is a simple store as another choice comparing with [redux](https://github.com/reactjs/redux) and [react-redux](https://github.com/reactjs/react-redux). 
Is is suit for developer who:
  - is not familiar with redux
  - think redux is too complicated, or redux has steep learning curve 
  - think redux has too much coding
  - is designing a small and rush project
  - whatever reason not using redux

Installation
----
```sh
npm install react-simdux --save
```

Usage
----
```javascript
// store.js
import {createStore} from 'react-simdux'

export const store = {
  number: 0,
  string: ''
}

export default createStore(store);
```
---
```javascript
// HomePage.js
import {connect} from 'react-simdux';
import Store from './store.js';

export class HomePage extends Component {
  render() {
    return (
      <View>
        <Button onPress={ () => Store.number++ }> Add </Button>
        <Button onPress={ () => Store.string = 'I love Simdux' }> Edit </Button>
        <Text>{'number: '+Store.number}</Text>
        <Text>{'string: '+Store.string}</Text>
      </View>
    );
  }
}

export default connect (Store, ['number','string']) (HomePage);
```


Guide
----

**Remember to create a new instance, if it is pointer, for updating**
```javascript
Store.num++;                              // Good
Store.num = Store.num + 1;                // Good too

Store.array = [...Store.array, 1];        // Good
// Store.array.push(1);                   // Bad, and won't update the view

Store.array = Store.array.slice(1, Store.array.length);     // Good
// Store.array.shift();                                     // Bad, and won't update the view

Store.object = { ...Store.object, a: Store.object.a + 1 }   // Good
// Store.object.a = Store.object.a + 1;                     // Bad, and won't update the view		
```

**Connect the field only you needed**
```javascript
connect(Store, ['num'])(Home);
...
Store.array = [...Store.array, 1];
// this won't trigger Home.render
```

**Use mapStoreToProps in connect**
```javascript
function mapStoreToProps(store, ownProps){
  return {
    isEmpty: store.array.length === 0,
  };
}
connect(Store, mapStoreToProps)(Home);
// this.props.isEmpty
```

API
----

###### createStore (store)
- **param** ( Object ) *store*
- **return** SimduxStore

###### connect (store, namesOrMappingFunc, extraProps) ... ( component )
- **param** ( SimduxStore ) *store* - a SimduxStore as provider
- **param** ( String[] | Function ) *namesOrMappingFunc* - subscribing names in the store or a function to mapping
- **param** ( Object* ) *extraProps* - an extra props passing to the Component
- **return** connect - a function to chain it
- **example** connect ( MyStore, ['var1','var2'] ) ( MyView )

---
###### Store.subscribe ( listener )
- **param** ( Function ) *listener* - a listener to subscribe any change of the store
- **example** Store.subscribe( (key, prevState, nextState) => { console.log(key) } )

###### Store.unsubscribe ( listener )
- **param** ( Function ) *listener* - the same listener used before, to subscribe the store

Advance Usage
----

**Use customize function in store**
```javascript
const store = {
  num: 1, 
  reset(n){              // use 'reset(){}' instead of 'reset: ()=>{}'
    this.num = n;        // this = Store
    // store.num = n;    // Bad
  }
};
const Store = createStore(store);
...
Store.reset(5);
```

**Use multiple store**
```javascript
...
const StoreA = createStore(storeA);
const StoreB = createStore(storeB);
...
connect (StoreA, mapStoreToProps) (StoreB, ['num']) ... (Home);
```

Todos
----
 - TypeScript
 - test

License
----

- MIT