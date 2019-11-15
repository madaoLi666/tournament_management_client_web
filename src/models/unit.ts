import { Reducer } from 'redux';

export interface UnitModelState {
    mainpart?: string | null;
    unitdata_id?: number;
    businesslicense?: string | null;
}

export interface UnitModelType {
    namespace: 'unit',
    state: UnitModelState,
    effects: {

    },
    reducers: {

    }
}

const UnitModel: UnitModelType = {
    namespace: 'unit',
    state: {
        mainpart: '',
        unitdata_id: 0,
        businesslicense: ''
    },
    effects: {

    },
    reducers: {

    }
}

export default UnitModel;