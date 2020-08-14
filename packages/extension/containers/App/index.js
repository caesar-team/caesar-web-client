import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  fetchKeyPairRequest,
  setMasterPassword,
} from '@caesar/common/actions/user';
import { personalKeyPairSelector } from '@caesar/common/selectors/keyStore';
import App from './App';

const mapStateToProps = createStructuredSelector({
  keyPair: personalKeyPairSelector,
});

const mapDispatchToProps = {
  fetchKeyPairRequest,
  setMasterPassword,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
