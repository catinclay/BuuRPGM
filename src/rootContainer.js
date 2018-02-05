import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import TodoApp from './components/TodoApp';

const mapStateToProps = ({ todos }) => ({ todos });
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp);
