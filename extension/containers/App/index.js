import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  fetchKeyPairRequest,
  setMasterPassword,
} from '../../../common/actions/user';
import { keyPairSelector } from '../../../common/selectors/user';
import App from './App';

const mapStateToProps = createStructuredSelector({
  keyPair: keyPairSelector,
});

const mapDispatchToProps = {
  fetchKeyPairRequest,
  setMasterPassword,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
