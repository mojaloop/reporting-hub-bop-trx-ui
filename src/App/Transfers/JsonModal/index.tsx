import React, { FC } from 'react';
import { Modal } from 'components';
import { connect } from 'react-redux';
import { State, Dispatch } from 'store/types';
import { ReduxContext } from 'store';
import ReactJson from 'react-json-view';
import { actions } from '../slice';
import * as selectors from '../selectors';
import { JsonModalData } from '../types';

const stateProps = (state: State) => ({
  jsonModalData: selectors.getSelectedJsonModalData(state),
});

const dispatchProps = (dispatch: Dispatch) => ({
  onModalCloseClick: () => dispatch(actions.jsonModalClose()),
});

interface ConnectorProps {
  jsonModalData: JsonModalData;
  onModalCloseClick: () => void;
}

const JsonModal: FC<ConnectorProps> = ({ jsonModalData, onModalCloseClick }) => {
  return (
    <Modal title={`${jsonModalData.title}`} onClose={onModalCloseClick}>
      <ReactJson src={jsonModalData.json} collapseStringsAfterLength={75} />
    </Modal>
  );
};

export default connect(stateProps, dispatchProps, null, { context: ReduxContext })(JsonModal);
