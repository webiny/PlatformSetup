import BaseComponent from '/Webiny/Core/Base/BaseComponent';
import MyDomainPicker from '/Webiny/Layout/Components/MyDomainPicker';
import InfoGrowl from '/Webiny/UI/Classes/Growl/InfoGrowl';
import SuccessGrowl from '/Webiny/UI/Classes/Growl/SuccessGrowl';
import DangerGrowl from '/Webiny/UI/Classes/Growl/DangerGrowl';
import GrowlText from '/Webiny/UI/Classes/Growl/Message/GrowlText';
import GrowlLink from '/Webiny/UI/Classes/Growl/Message/GrowlLink';
import GrowlComponent from '/Webiny/UI/Classes/Growl/Message/GrowlComponent';

import TableView from '/Todo/Todo/Components/TasksTableView'
var TasksTableView = TableView.createComponent();

class TaskList extends BaseComponent {

	getFqn(){
		return 'Todo.Todo.TaskList';
	}

	getTemplate() {
		var fields = ['index', 'id', 'task', 'createdOn'];
		var actions = ['edit', 'delete'];
		return React.createElement("div", {className: "col-sm-12"},     React.createElement(FormInline, {name: "form"},         React.createElement(Input, {grid: "12", placeholder: "New task", ref: "newTask"}),         React.createElement("div", {className: "form-group"},             React.createElement("button", {className: "btn btn-primary col-sm-12", type: "submit", onClick: this.addTask}, "Add")        ),         React.createElement(Input, {grid: "12", valueLink: this.linkState("filter"), placeholder: "Filter..."})    ),     React.createElement(TasksTableView, {fields: fields, actions: actions, items: this.state.todos, onDelete: this.removeTask}),         React.createElement(Modal, {ref: "deleteConfirmationModal", title: "Delete confirmation", onHide: this.taskModalHide, onHidden: this.taskModalHidden},         React.createElement(ModalBody, null,             React.createElement(TasksTableView, {fields: ['task','createdOn'], actions: ['select'], items: this.state.todos, onSelect: this.selectTask})        ),         React.createElement(ModalFooter, null,             React.createElement("button", {onClick: (function()  {this.refs.deleteConfirmationModal.hide()}.bind(this)), className: "btn btn-primary"}, "Close")        )    ),     React.createElement("button", {onClick: (function()  {this.refs.deleteConfirmationModal.show()}.bind(this)), className: "btn btn-info"}, "Trigger demo modal"));
	}

	componentDidMount() {
		this.fullListOfTasks = [];
		this.TaskStore = this.getStore('Todo.Todo.TaskStore');

		// Get initial data
		this.TaskStore.getData().then((data) => {
			this.fullListOfTasks = data;
			this.setState({todos: data});
		});

		// Listen to store changes
		this.onStore(this.TaskStore, (data) => this.setState({todos: data}));
	}
	
	getInitialState() {
		return {
			todos: [],
			filter: ''
		};
	}

	addTask() {
		var input = this.getDOM('newTask');
		var taskName = input.value;
		this.trigger('Todo.Todo.TaskCreate', {task: taskName}).then(actionResult => {
			if (!actionResult.hasErrors()) {
				this.trigger('Core.UI.AddGrowl', new SuccessGrowl(taskName, 'New task created!'));
			} else {
				var growl = new DangerGrowl('Something went wrong', 'Failed to create a task', true);
				//growl.addMessage(new GrowlComponent(ChatBox));
				this.trigger('Core.UI.AddGrowl', growl);
			}
		});
		input.value = '';
	}

	/**
	 * Restore deleted task
	 * @param item Item data passed from removeTask()
	 * @param growl Growl component instance which triggers this method
	 */
	restoreTask(item, growl){
		growl.close();
		this.trigger('Todo.Todo.TaskRestore', item);
	}

	removeTask(item) {
		this.trigger('Todo.Todo.TaskDelete', item).then(actionResult => {
			if (!actionResult.hasErrors()) {
				var undo = new GrowlLink('Undo', this.restoreTask, item, 'btn btn-info');
				var growl = new InfoGrowl(undo, 'Task deleted successfully!', true);
				this.trigger('Core.UI.AddGrowl', growl);
			} else {
				this.trigger('Core.UI.AddGrowl', new WarningGrowl('Could not delete task!'));
			}
		});
	}

	onChangeFilter(newValue, oldValue) {
		if (!newValue) {
			return this.setState({todos: this.fullListOfTasks});
		}
		var filter = newValue.toLowerCase();
		var results = [];
		this.fullListOfTasks.forEach((task) => {
			if (task.task.toLowerCase().indexOf(filter) > -1) {
				results.push(task);
			}
		});
		this.setState({todos: results});
	}

	taskModalHidden(){
		console.log("TaskList", "Modal closed callback")
	}

	taskModalHide(){
		console.log("TaskList", "Modal closing callback")
	}
}

export default TaskList;
