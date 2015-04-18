import BaseComponent from '/Core/Core/Base/BaseComponent';

class Td extends BaseComponent {

	getTemplate() {
		return '<td className={this.props.className}>{this.props.children}</td>';
	}
}

export default Td;
