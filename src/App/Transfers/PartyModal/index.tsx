import React, { FC } from 'react';
import { FormField, Modal } from 'components';
import { connect } from 'react-redux';
import { State, Dispatch } from 'store/types';
import { ReduxContext } from 'store';
import { actions } from '../slice';
import * as selectors from '../selectors';
import { PartyModalData } from '../types';

const stateProps = (state: State) => ({
  partyModalData: selectors.getSelectedPartyModalData(state),
});

const dispatchProps = (dispatch: Dispatch) => ({
  onModalCloseClick: () => dispatch(actions.partyModalClose()),
});

interface ConnectorProps {
  partyModalData: PartyModalData;
  onModalCloseClick: () => void;
}

const JsonModal: FC<ConnectorProps> = ({ partyModalData, onModalCloseClick }) => {
  return (
    <Modal title={`${partyModalData.type} Information`} onClose={onModalCloseClick}>
      <FormField.Container direction="row">
        <FormField disabled type="text" label="Id Type" value={partyModalData.party.idType || ''} />
        <FormField
          disabled
          type="text"
          label="Id Value"
          value={partyModalData.party.idValue || ''}
        />
      </FormField.Container>
      <FormField.Container direction="row">
        <FormField
          disabled
          type="text"
          label="First Name"
          value={partyModalData.party.firstName || ''}
        />
        <FormField
          disabled
          type="text"
          label="Middle Name"
          value={partyModalData.party.middleName || ''}
        />
        <FormField
          disabled
          type="text"
          label="Last Name"
          value={partyModalData.party.lastName || ''}
        />
      </FormField.Container>
      <FormField.Container direction="row">
        <FormField
          disabled
          type="text"
          label="Date of Birth"
          value={partyModalData.party.dateOfBirth || ''}
        />
        <FormField
          disabled
          type="text"
          label="FSP Id"
          value={partyModalData.party.id?.toString() || ''}
        />
      </FormField.Container>
    </Modal>
  );
};

export default connect(stateProps, dispatchProps, null, { context: ReduxContext })(JsonModal);
