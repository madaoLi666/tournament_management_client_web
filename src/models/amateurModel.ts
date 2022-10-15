import { Effect } from 'dva';
import { Reducer } from 'redux';

import { getUnitAthletesdata } from '@/services/athleteServices';

export interface AmateurModelType {
	namespace: 'amateur',
	state: any,
	effects: {
		getAthleteData: Effect
	},
	reducers: {
		setCurrentAmateurExaminationData: Reducer<any>,
		setExamieeUnit: Reducer<any>
	}
}

const AmateurModel: AmateurModelType = {
	namespace: 'amateur',
	state: {
		amateurExaminationData: {

		},
		examieeUnit: {

		},
		unit: {
			athleteList: [],
			examieeUnit: {

			}
		},
		
	},
	effects: {
		*getAthleteData({ payload, callback}, { put }) {
			
		}
	},

	reducers: {
		setCurrentAmateurExaminationData(state, { payload }) {
			return {
				...state,
				amateurExaminationData: payload.data
			}
		},
		setExamieeUnit(state, { payload }) {
			return {
				...state,
				examieeUnit: payload.data
			}
		}
	}
}

export default AmateurModel;