import { combineReducers } from 'redux';
import { types } from './Actions';

function Open(state = false, action) {
    switch (action.type) {
        case types.OPEN_DRAWER:
            return true;
        case types.CLOSE_DRAWER:
            return false;
        default:
            return state;
    }
}

export default combineReducers({ Open });