import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import TeamList from './TeamList';

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = {};

export default connect()(TeamList);
