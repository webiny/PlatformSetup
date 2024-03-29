import BaseModule from '/Core/Base/BaseModule';
import Footer from '/Apps/Core/Layout/Js/Components/Footer';
import Navigation from '/Apps/Core/Layout/Js/Components/Navigation';
import DomainPicker from '/Apps/Core/Layout/Js/Components/DomainPicker';
import Growler from '/Apps/Core/Layout/Js/Components/Growler';
import Growl from '/Apps/Core/Layout/Js/Components/Growl';
import AppStore from '/Apps/Core/Layout/Js/Stores/AppStore';

class Layout extends BaseModule {

	registerComponents() {
		return {
			Navigation: Navigation,
			Footer: Footer,
			DomainPicker: DomainPicker,
			Growler: Growler,
			Growl: Growl
		};
	}

	registerStores(){
		return [
			AppStore
		];
	}
}

export default Layout;