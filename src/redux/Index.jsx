import { createStore as create, combineReducers } from 'redux';
import drawerOpen from './drawer/Reducers';
import chatOpen from './chat/Reducers';
import usuario from './user/Reducers';
import enums from './enums/Reducers';

function createStore() {
    const reducers = combineReducers({ drawerOpen, chatOpen, usuario, enums });

    return create(reducers);
}

const store = createStore();

export default store;