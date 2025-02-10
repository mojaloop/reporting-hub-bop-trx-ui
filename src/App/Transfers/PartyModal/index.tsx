import React, { FC } from 'react';
import { FormField, Modal } from 'components';
import { connect } from 'react-redux';
import { State, Dispatch } from 'store/types';
import { ReduxContext } from 'store';
import { Transfer } from 'apollo/types';
import { actions } from '../slice';
import * as selectors from '../selectors';
import { PartyModalData } from '../types';
// import TransferDetails from '../TransferDetails';

const stateProps = (state: State) => ({
  partyModalData: selectors.getSelectedPartyModalData(state),
  transferDetails: selectors.getSelectedTransfer(state),
});

const dispatchProps = (dispatch: Dispatch) => ({
  onModalCloseClick: () => dispatch(actions.partyModalClose()),
});

interface ConnectorProps {
  partyModalData: PartyModalData;
  transferDetails: Transfer;
  onModalCloseClick: () => void;
}

const JsonModal: FC<ConnectorProps> = ({ partyModalData, transferDetails, onModalCloseClick }) => {
  const fspId =
    partyModalData.type === 'Payer'
      ? transferDetails.payerDFSP?.toString() || ''
      : transferDetails.payeeDFSP?.toString() || '';

  return (
    <Modal
      title={`${partyModalData.type} Information`}
      className="partyDetailsModal"
      onClose={onModalCloseClick}
    >
      <FormField.Container direction="row">
        <FormField
          disabled
          type="text"
          label="Id Type"
          value={partyModalData.party.partyIdType || ''}
        />
        <FormField
          disabled
          type="text"
          label="Id Value"
          value={partyModalData.party.partyIdentifier?.toString() || ''}
        />
      </FormField.Container>
      <FormField.Container direction="row">
        <FormField
          disabled
          type="text"
          label="Full Name"
          value={partyModalData.party.partyName || ''}
        />
        <FormField disabled type="text" label="FSP Id" value={fspId} />
      </FormField.Container>
    </Modal>
  );
};

export default connect(stateProps, dispatchProps, null, { context: ReduxContext })(JsonModal);
