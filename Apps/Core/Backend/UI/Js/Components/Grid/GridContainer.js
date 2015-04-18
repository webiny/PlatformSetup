import BaseComponent from '/Core/Core/Base/BaseComponent';

class GridContainer extends BaseComponent {

	getTemplate(){
		return '<div class="container">{this.props.children}</div>';
	}
}

export default GridContainer;
