import React, { FC } from 'react';
import { Modal, Tabs, Tab, TabPanel, FormField, Button } from 'components';
import { connect } from 'react-redux';
import { State, Dispatch } from 'store/types';
import { ReduxContext } from 'store';
import { actions } from '../slice';
import * as selectors from '../selectors';
import { Transfer } from '../../../apollo/types';

const stateProps = (state: State) => ({
  transferDetails: selectors.getSelectedTransfer(state),
});

const dispatchProps = (dispatch: Dispatch) => ({
  onModalCloseClick: () => dispatch(actions.transferDetailsModalClose()),
  onSetJsonObject: (json: Object) => dispatch(actions.setJsonObject(json)),
});

interface ConnectorProps {
  transferDetails: Transfer;
  onModalCloseClick: () => void;
  onSetJsonObject: (json: Object) => void;
}

const TransferDetails: FC<ConnectorProps> = ({
  transferDetails,
  onModalCloseClick,
  onSetJsonObject,
}) => {
  const TechnicalDetailsTab = (
    <TabPanel className="technicalDetailsTab">
      <FormField.Container direction="row" align="top left">
        <FormField.Container direction="column">
          <FormField disabled type="text" label="Transfer ID" value={transferDetails.transferId!} />
          <FormField
            disabled
            type="text"
            label="Quote Id"
            value={transferDetails.quoteId?.toString() || ''}
          />
          <FormField
            disabled
            type="text"
            label="Transfer State"
            value={transferDetails.transferState || ''}
          />
        </FormField.Container>

        <FormField.Container direction="column">
          <h3> View Message Details </h3>
          <Button
            size="small"
            kind="primary"
            label="Party Lookup Events"
            onClick={() => onSetJsonObject(transferDetails.partyLookupEvents || {})}
          />
          <Button
            size="small"
            kind="primary"
            label="Quote Events"
            onClick={() => onSetJsonObject(transferDetails.quoteEvents || {})}
          />
          <Button
            size="small"
            kind="primary"
            label="Transfer Events"
            onClick={() => onSetJsonObject(transferDetails.transferEvents || {})}
          />
          <Button
            size="small"
            kind="primary"
            label="Settlement Events"
            onClick={() => onSetJsonObject(transferDetails.settlementEvents || {})}
          />
        </FormField.Container>
      </FormField.Container>
    </TabPanel>
  );

  const BasicInformationTab = (
    <TabPanel className="basicInformationTab">
      <FormField.Container direction="row" align="top left">
        <FormField.Container direction="column">
          <FormField disabled type="text" label="Transfer ID" value={transferDetails.transferId!} />
          <FormField
            disabled
            type="text"
            label="Amount"
            value={transferDetails.amount?.toString() || ''}
          />
          <FormField
            disabled
            type="text"
            label="Payer"
            value={`${transferDetails.payerParty?.firstName} ${transferDetails.payerParty?.lastName}`}
          />
          <FormField
            disabled
            type="text"
            label="Payee"
            value={`${transferDetails.payeeParty?.firstName} ${transferDetails.payerParty?.lastName}`}
          />
          <FormField
            disabled
            type="text"
            label="Settlement Batch Id"
            value={transferDetails.settlementId?.toString() || ''}
          />
        </FormField.Container>

        <FormField.Container direction="column">
          <FormField
            disabled
            type="text"
            label="Transfer State"
            value={transferDetails.transferState || ''}
          />
          <FormField disabled type="text" label="Currency" value={transferDetails.currency || ''} />
          <FormField
            disabled
            type="text"
            label="Payer Details"
            value={`${
              transferDetails.payerParty?.idType
            } ${transferDetails.payerParty?.id?.toString()}`}
          />
          <FormField
            disabled
            type="text"
            label="Payee Details"
            value={`${
              transferDetails.payeeParty?.idType
            } ${transferDetails.payeeParty?.id?.toString()}`}
          />
        </FormField.Container>

        <FormField.Container direction="column">
          <FormField
            disabled
            type="text"
            label="Transfer Type"
            value={transferDetails.transactionType || ''}
          />
          <FormField
            disabled
            type="text"
            label="Date Submitted"
            value={transferDetails.createdAt || ''}
          />
          <FormField
            disabled
            type="text"
            label="Payer DFSP"
            value={transferDetails.payerDFSP?.name?.toString() || ''}
          />
          <FormField
            disabled
            type="text"
            label="Payee DFSP"
            value={transferDetails.payeeDFSP?.name?.toString() || ''}
          />
        </FormField.Container>
      </FormField.Container>
    </TabPanel>
  );

  return (
    <Modal title={`Transfer ${transferDetails.transferId} Details`} onClose={onModalCloseClick}>
      <div>
        <Tabs>
          <Tab>Basic Information</Tab>
          <Tab>Technical Details</Tab>
          {BasicInformationTab}
          {TechnicalDetailsTab}
        </Tabs>
      </div>
    </Modal>
  );
};

export default connect(stateProps, dispatchProps, null, { context: ReduxContext })(TransferDetails);
