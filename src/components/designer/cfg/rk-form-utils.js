import { getFillFormTypeArray } from './rk-form-conf';
const FormUtils = {
	traverseFieldWidgets: function (widgetList) {
		widgetList.map((wItem) => {
			if (wItem.type === 'tab') {
				wItem.tabs.map();
			}
		});
	},
	vaildateFormType: function (value) {
		const formTypeArray = getFillFormTypeArray();
		return formTypeArray.includes(value);
	},
	clearVFormDesigerCache() {
		window.localStorage.removeItem('widget__list__backup');
		window.localStorage.removeItem('form__config__backup');
	},
};

export default FormUtils;
