import BaseComponent from '/Core/Core/Base/BaseComponent';

class Th extends BaseComponent {

	getTemplate(){
		return '<th className={this.props.className}>{this.props.children}</th>';
	}
}

export default Th;
