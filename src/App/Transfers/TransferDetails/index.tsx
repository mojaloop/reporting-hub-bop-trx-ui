import React, { FC } from 'react';
import { Modal, Tabs, Tab, TabPanel, FormField, Button } from 'components';
import { connect } from 'react-redux';
import { State, Dispatch } from 'store/types';
import { ReduxContext } from 'store';
import { Transfer } from 'apollo/types';
import moment from 'moment';
import { actions } from '../slice';
import * as selectors from '../selectors';
import { JsonModalData, PartyType, PartyModalData } from '../types';

const stateProps = (state: State) => ({
  transferDetails: selectors.getSelectedTransfer(state),
});

const dispatchProps = (dispatch: Dispatch) => ({
  onModalCloseClick: () => dispatch(actions.transferDetailsModalClose()),
  onsetJsonModalData: (json: JsonModalData) => dispatch(actions.setJsonModalData(json)),
  onsetPartyModalData: (party: PartyModalData) => dispatch(actions.setPartyModalData(party)),
});

interface ConnectorProps {
  transferDetails: Transfer;
  onModalCloseClick: () => void;
  onsetJsonModalData: (json: JsonModalData) => void;
  onsetPartyModalData: (party: PartyModalData) => void;
}

const TransferDetails: FC<ConnectorProps> = ({
  transferDetails,
  onModalCloseClick,
  onsetJsonModalData,
  onsetPartyModalData,
}) => {
  let errorCodeField;
  if (transferDetails.errorCode) {
    errorCodeField = (
      <FormField
        disabled
        type="text"
        label="Error Code"
        value={transferDetails.errorCode.toString()}
      />
    );
  }

  const TransferDetailsTab = (
    <TabPanel className="transferDetailsTab">
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
            label="Source Amount"
            value={transferDetails.amount?.toString() || ''}
          />
          <FormField
            disabled
            type="text"
            label="FXP"
            value={`${transferDetails.payerParty?.firstName || ''} ${
              transferDetails.toString() || ''
            }`}
          />
          <FormField
            disabled
            type="text"
            label="Payer Identifier"
            value={`${transferDetails.payerParty?.firstName || ''} ${
              transferDetails.payerParty?.lastName || ''
            }`}
          />
          <FormField
            disabled
            type="text"
            label="Payee Identifier"
            value={`${transferDetails.payeeParty?.firstName || ''} ${
              transferDetails.toString() || ''
            }`}
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
            label="Source Currency"
            value={transferDetails.currency || ''}
          />
          <FormField
            disabled
            type="text"
            label="Conversion Type"
            value={transferDetails.settlementId?.toString() || ''}
          />
          <FormField
            disabled
            type="text"
            label="Payer Identifier Type"
            value={`${transferDetails.payerParty?.idType || ''} ${
              transferDetails.payerParty?.idValue?.toString() || ''
            }`}
          />
          <FormField
            disabled
            type="text"
            label="Payee Identifier Type"
            value={`${transferDetails.payeeParty?.idType || ''} ${
              transferDetails.payeeParty?.idValue?.toString() || ''
            }`}
          />
        </FormField.Container>

        <FormField.Container direction="column">
          <FormField
            disabled
            type="text"
            label="Base Use Case"
            value={transferDetails.transactionType || ''}
          />
          <FormField
            disabled
            type="text"
            label="Submitted Date"
            value={
              transferDetails.createdAt ? moment(transferDetails.createdAt).local().format() : ''
            }
          />
          <FormField
            disabled
            type="text"
            label="Conversion Submitted Date"
            value={
              transferDetails.createdAt ? moment(transferDetails.createdAt).local().format() : ''
            }
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
        <FormField.Container direction="column">
          <FormField
            disabled
            type="text"
            label="Transaction Type"
            value={transferDetails.transactionType || ''}
          />
          <FormField
            disabled
            type="text"
            label="Transfer Settlement Batch ID"
            value={transferDetails.toString() || ''}
          />
          <FormField
            disabled
            type="text"
            label="Conversion Settlement Batch ID"
            value={transferDetails.toString() || ''}
          />
          <FormField
            disabled
            type="text"
            label="Payer DFSP Proxy"
            value={transferDetails.toString() || ''}
          />
          <FormField
            disabled
            type="text"
            label="Payee DFSP Proxy"
            value={transferDetails.toString() || ''}
          />
          <FormField
            disabled
            type="text"
            label="FXP Proxy"
            value={transferDetails.toString() || ''}
          />
        </FormField.Container>
      </FormField.Container>
    </TabPanel>
  );

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
          {errorCodeField || <div />}
        </FormField.Container>

        <FormField.Container direction="column">
          <h3> Party Information </h3>
          <FormField.Container direction="row">
            <Button
              className="partyInfo"
              size="small"
              kind="primary"
              label="Payer Information"
              onClick={() => {
                onsetPartyModalData({
                  type: PartyType.PAYER,
                  party: transferDetails.payerParty || {},
                });
              }}
            />
            <Button
              className="partyInfo"
              size="small"
              kind="primary"
              label="Payee Information"
              onClick={() => {
                onsetPartyModalData({
                  type: PartyType.PAYEE,
                  party: transferDetails.payeeParty || {},
                });
              }}
            />
          </FormField.Container>
          <h3> View Message Details </h3>
          <Button
            size="small"
            kind="primary"
            label="Party Lookup Events"
            onClick={() => {
              onsetJsonModalData({
                title: 'Party Lookup Events',
                json: transferDetails.partyLookupEvents || {},
              });
            }}
          />
          <Button
            size="small"
            kind="primary"
            label="Quote Events"
            onClick={() => {
              onsetJsonModalData({
                title: 'Quote Events',
                json: transferDetails.quoteEvents || {},
              });
            }}
          />
          <Button
            size="small"
            kind="primary"
            label="Transfer Events"
            onClick={() => {
              onsetJsonModalData({
                title: 'Transfer Events',
                json: transferDetails.transferEvents || {},
              });
            }}
          />
          <Button
            size="small"
            kind="primary"
            label="Settlement Events"
            onClick={() => {
              onsetJsonModalData({
                title: 'Settlement Events',
                json: transferDetails.settlementEvents || {},
              });
            }}
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
            value={`${transferDetails.payerParty?.firstName || ''} ${
              transferDetails.payerParty?.lastName || ''
            }`}
          />
          <FormField
            disabled
            type="text"
            label="Payee"
            value={`${transferDetails.payeeParty?.firstName || ''} ${
              transferDetails.payeeParty?.lastName || ''
            }`}
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
            value={`${transferDetails.payerParty?.idType || ''} ${
              transferDetails.payerParty?.idValue?.toString() || ''
            }`}
          />
          <FormField
            disabled
            type="text"
            label="Payee Details"
            value={`${transferDetails.payeeParty?.idType || ''} ${
              transferDetails.payeeParty?.idValue?.toString() || ''
            }`}
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
            value={
              transferDetails.createdAt ? moment(transferDetails.createdAt).local().format() : ''
            }
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
          <Tab>Transfer Details</Tab>
          <Tab>Technical Details</Tab>
          {BasicInformationTab}
          {TransferDetailsTab}
          {TechnicalDetailsTab}
        </Tabs>
      </div>
    </Modal>
  );
};

export default connect(stateProps, dispatchProps, null, { context: ReduxContext })(TransferDetails);
