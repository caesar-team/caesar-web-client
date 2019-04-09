import { connect } from 'react-redux';
import { fetchNodesRequest } from 'common/actions/nodes';
import Dashboard from './Dashboard';

export default connect(
  null,
  {
    fetchNodesRequest,
  },
)(Dashboard);
