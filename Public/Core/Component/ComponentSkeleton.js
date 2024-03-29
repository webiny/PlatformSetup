import StateStore from '/Core/Tools/StateStore';
import LinkState from '/Core/Tools/LinkState';
import EventManager from '/Core/EventManager';
import ActionResult from '/Core/Action/ActionResult';

export default function ComponentSkeleton(self) {
	/**
	 * React class object
	 */
	var classObject = {
		/**
		 * Component instance ID (to be able to track this particular element)
		 */
		__instanceId: self.getInstanceId(),

		/**
		 * Listeners registered in this component
		 */
		__listeners: self.__listeners,

		/**
		 * This property is used for storing dynamically calculated properties that will be used in template
		 */
		dynamic: {},
		/**
		 * @see http://facebook.github.io/react/docs/component-specs.html#getinitialstate
		 */
		getInitialState: self.getInitialState,

		/**
		 * @see http://facebook.github.io/react/docs/component-specs.html#getdefaultprops
		 */
		getDefaultProps: self.getDefaultProperties,

		/**
		 * @see http://facebook.github.io/react/docs/component-specs.html#mounting-componentwillmount
		 */
		componentWillMount: function () {
			// Convert dashed attribute names to camelCase
			var pKeys = {};
			Object.keys(this.props).forEach(item => {
				var keyParts = [];
				item.split('-').forEach((part, pi) => {
					var key = part.charAt(0).toUpperCase() + part.substr(1);
					if (pi == 0) {
						key = part.charAt(0).toLowerCase() + part.substr(1);
					}
					keyParts.push(key);
				});

				pKeys[keyParts.join('')] = this.props[item];
			});

			var saveState = this.props.saveState || false;
			if (saveState) {
				var state = StateStore.getState(self.getInstanceId());
				if (state) {
					this.state = state;
				}
			}
			self.componentWillMount();
		},

		/**
		 * @see http://facebook.github.io/react/docs/component-specs.html#mounting-componentdidmount
		 */
		componentDidMount: self.componentDidMount,

		/**
		 * @see http://facebook.github.io/react/docs/component-specs.html#updating-componentwillreceiveprops
		 * @param object nextProps
		 */
		componentWillReceiveProps: self.componentWillReceiveProps,

		/**
		 * @see http://facebook.github.io/react/docs/component-specs.html#updating-shouldcomponentupdate
		 */
		shouldComponentUpdate: self.shouldComponentUpdate,

		/**
		 * @see http://facebook.github.io/react/docs/component-specs.html#updating-componentwillupdate
		 * @param object nextProps
		 * @param object nextState
		 */
		componentWillUpdate: self.componentWillUpdate,

		/**
		 * @see http://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
		 * @param object prevProps
		 * @param object prevState
		 */
		componentDidUpdate: self.componentDidUpdate,

		/**
		 * @see http://facebook.github.io/react/docs/component-specs.html#unmounting-componentwillunmount
		 */
		componentWillUnmount: function () {
			var saveState = this.props.saveState || false;
			if (saveState) {
				StateStore.saveState(self.getInstanceId(), this.state);
			}

			this.__listeners.forEach(unsubscribe => {unsubscribe()});
			this.__listeners = [];
			self.componentWillUnmount();
		},

		trigger: function (action, data) {
			return EventManager.emit(action, data, true).then(results => {
				return new ActionResult(results);
			});
		},

		/**
		 * Listen to data store change
		 * @param string store
		 * @param string|callable callback
		 * @returns {classObject}
		 */
		onStore: function (store, callback) {
			var callbackType = typeof callback;
			var reactThis = this;

			if (typeof store != 'string') {
				store = store.getFqn();
			}

			if (callbackType != 'function') {

				// State key is passed to assign new store value to
				if (callbackType == 'string') {
					var property = callback;
					callback = function (store) {
						var state = {};
						state[property] = store.getData();
						reactThis.setState(state);
					}
				}

				// New store value will overwrite the entire component state
				if (callbackType == 'undefined') {
					callback = function (store) {
						reactThis.setState(store.getData());
					}
				}
			}

			var meta = {
				listenerType: 'component',
				listeningTo: 'store',
				listenerName: reactThis.getFqn()
			};

			// Get store from registry to trigger its init() method if it has not yet been initialized
			self.getRegistry().getStore(store);

			var stopListening = EventManager.addListener(store, callback, meta);
			reactThis.__listeners.push(stopListening);
			return reactThis;
		},

		/**
		 * Get DOM Node by React reference
		 * @param string key
		 * @returns {DOMElement}
		 */
		getNode(key) {
			if (typeof this.refs[key]['getDOMElement'] != 'undefined') {
				return this.refs[key].getDOMElement();
			}
			return this.refs[key].getDOMNode();
		},

		getStore(name) {
			return self.getRegistry().getStore(name);
		},

		getComponent(name) {
			return window[name];
		},

		getParam(name) {
			return Router.getParam(name);
		},

		/**
		 * Ex: onChangeImportant(newValue, oldValue){...}
		 * Ex: onChangeName(newValue, oldValue){...}
		 *
		 * @param key
		 * @returns {{value: *, requestChange: *}}
		 */
		linkState(key) {
			var ls = new LinkState(this, key);
			return ls.create();
		}
	};

	/**
	 * Create `render` method
	 */
	classObject.render = function () {
		//console.log("RENDERING " + self.getClassName(), self.__instanceId);
		return this.getTemplate();
	};

	/**
	 * Almost done...
	 * Take all methods that are not part of React wrapper and assign them to React classObject so that
	 * they are available from `this` in React component
	 */
	var prototype = self.__proto__;
	Object.keys(prototype).forEach(function (key) {
		if (!classObject.hasOwnProperty(key)) {
			classObject[key] = prototype[key];
		}
	});

	return React.createClass(classObject);
};