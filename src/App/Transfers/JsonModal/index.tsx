import React, { FC } from 'react';
import { Modal } from 'components';
import { connect } from 'react-redux';
import { State, Dispatch } from 'store/types';
import { ReduxContext } from 'store';
import ReactJson from 'react-json-view';
import { actions } from '../slice';
import * as selectors from '../selectors';

const stateProps = (state: State) => ({
  jsonObject: selectors.getSelectedJsonObject(state),
});

const dispatchProps = (dispatch: Dispatch) => ({
  onModalCloseClick: () => dispatch(actions.jsonObjectModalClose()),
});

interface ConnectorProps {
  jsonObject: Object;
  onModalCloseClick: () => void;
}

const JsonModal: FC<ConnectorProps> = ({ jsonObject, onModalCloseClick }) => {
  return (
    <Modal title="" onClose={onModalCloseClick}>
      <ReactJson src={jsonObject} />
    </Modal>
  );
};

export default connect(stateProps, dispatchProps, null, { context: ReduxContext })(JsonModal);
