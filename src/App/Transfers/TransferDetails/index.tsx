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

  const TransferTermsTab = (
    <TabPanel className="transferTermsTab">
      <FormField.Container direction="row" align="top left">
        <FormField.Container direction="column">
          <FormField
            disabled={true}
            type="text"
            label="Transfer ID"
            value={transferDetails.transferId!}
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          />
        </FormField.Container>

        <FormField.Container direction="column">
          <FormField
            disabled={true}
            type="text"
            label="Transfer State"
            value={transferDetails.transferState || ''}
          />
        </FormField.Container>

        <FormField.Container direction="column">
          <FormField
            disabled={true}
            type="text"
            label="Quote Amount"
            // value={model.transferTerms?.quoteAmount?.amount?.toString() || ''}
          />
        </FormField.Container>

        <FormField.Container direction="column">
          <FormField
            disabled={true}
            type="text"
            label="Quote Currency"
            // value={model.transferTerms?.quoteAmount?.currency || ''}
          />
        </FormField.Container>

        <FormField.Container direction="column">
          <FormField
            disabled={true}
            type="text"
            label="Quote Amount Type"
            // value={model.transferTerms?.quoteAmountType || ''}
          />
        </FormField.Container>
        <FormField.Container direction="column">
          <FormField
            disabled={true}
            type="text"
            label="Conversion Type"
            // value={model.transferTerms?.quoteAmountType || ''}
          />
        </FormField.Container>
      </FormField.Container>

      <FormField.Container direction="row" style={{ width: '100%', height: '100%' }}>
        <FormField.Container style={{ width: '100%', flexGrow: 1 }} direction="column">
          <FormField.Container
            style={{
              width: '100%',
              marginTop: '10px',
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '5px',
              boxSizing: 'border-box',
              flexGrow: 1,
              display: 'flex',
              height: '300px',
              flexDirection: 'column',
            }}
            direction="column"
          >
            <div
              style={{
                fontWeight: 'bold',
                marginBottom: '5px',
                marginRight: '300px',
                textAlign: 'center',
              }}
            >
              Transfer Terms
            </div>
            <FormField.Container direction="row" style={{ overflow: 'hidden' }}>
              <div style={{ flex: '0 0 150px', textAlign: 'left', marginRight: '10px' }}>
                Transfer Amount
              </div>
              <FormField
                disabled
                type="text"
                style={{ flex: 1 }}
                value={transferDetails.amount?.toString() || ''}
              />
              <FormField
                disabled
                type="text"
                value={transferDetails.currency || ''}
                style={{ width: '100%', marginRight: '5px' }}
              />
            </FormField.Container>

            <FormField.Container direction="row" style={{ overflow: 'hidden' }}>
              <div style={{ flex: '0 0 150px', textAlign: 'left', marginRight: '10px' }}>
                Payee Receive Amount
              </div>
              <FormField
                disabled
                type="text"
                style={{ flex: 1 }}
                value={transferDetails.payerDFSP?.name?.toString() || ''}
              />

              <FormField
                disabled
                type="text"
                value={transferDetails.payerDFSP?.name?.toString() || ''}
                style={{ flex: '0 0 20%', marginLeft: '10px' }}
              />
            </FormField.Container>
            <FormField.Container direction="row" style={{ overflow: 'hidden' }}>
              <div style={{ flex: '0 0 150px', textAlign: 'left', marginRight: '10px' }}>
                Payee DFSP Commission
              </div>
              <FormField
                disabled
                type="text"
                style={{ flex: 1 }}
                value={transferDetails.payerDFSP?.name?.toString() || ''}
              />

              <FormField
                disabled
                type="text"
                value={transferDetails.payerDFSP?.name?.toString() || ''}
                style={{ flex: '0 0 20%', marginLeft: '10px' }}
              />
            </FormField.Container>
            <FormField.Container direction="row" style={{ overflow: 'hidden' }}>
              <div style={{ flex: '0 0 150px', textAlign: 'left', marginRight: '10px' }}>
                Expiry Date Time
              </div>
              <FormField
                disabled
                type="text"
                style={{ flex: 1 }}
                value={transferDetails.payerDFSP?.name?.toString() || ''}
              />
            </FormField.Container>
          </FormField.Container>
        </FormField.Container>

        <FormField.Container style={{ width: '100%', flexGrow: 1 }} direction="column">
          <FormField.Container
            style={{
              width: '100%',
              marginTop: '10px',
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '5px',
              boxSizing: 'border-box',
              flexGrow: 1,
              display: 'flex',
              height: '300px',
              flexDirection: 'column',
            }}
            direction="column"
          >
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Conversion Terms</div>
            <FormField.Container direction="row" style={{ overflow: 'hidden' }}>
              <div style={{ flex: '0 0 150px', textAlign: 'left', marginRight: '10px' }}>
                Transfer Amount
              </div>
              <FormField
                disabled
                type="text"
                style={{ flex: 1 }}
                value={transferDetails.payerDFSP?.name?.toString() || ''}
              />

              <FormField
                disabled
                type="text"
                value={transferDetails.payerDFSP?.name?.toString() || ''}
              />
            </FormField.Container>
            <FormField.Container direction="row" style={{ overflow: 'hidden' }}>
              <div style={{ flex: '0 0 150px', textAlign: 'left', marginRight: '10px' }}>
                Payee Receive Amount
              </div>
              <FormField
                disabled
                type="text"
                style={{ flex: 1 }}
                value={transferDetails.payerDFSP?.name?.toString() || ''}
              />

              <FormField
                disabled
                type="text"
                value={transferDetails.payerDFSP?.name?.toString() || ''}
              />
            </FormField.Container>
            <FormField.Container direction="row" style={{ overflow: 'hidden' }}>
              <div style={{ flex: '0 0 150px', textAlign: 'left', marginRight: '10px' }}>
                Payee DFSP Fee
              </div>
              <FormField
                disabled
                type="text"
                style={{ flex: 1 }}
                value={transferDetails.payerDFSP?.name?.toString() || ''}
              />

              <FormField
                disabled
                type="text"
                value={transferDetails.payerDFSP?.name?.toString() || ''}
              />
            </FormField.Container>
            <FormField.Container direction="row" style={{ overflow: 'hidden' }}>
              <div style={{ flex: '0 0 150px', textAlign: 'left', marginRight: '10px' }}>
                Payee DFSP Commission
              </div>
              <FormField
                disabled
                type="text"
                style={{ flex: 1 }}
                value={transferDetails.payerDFSP?.name?.toString() || ''}
              />

              <FormField
                disabled
                type="text"
                value={transferDetails.payerDFSP?.name?.toString() || ''}
              />
            </FormField.Container>
            <FormField.Container direction="row" style={{ overflow: 'hidden' }}>
              <div style={{ flex: '0 0 150px', textAlign: 'left', marginRight: '10px' }}>
                Expiry Date Time
              </div>
              <FormField
                disabled
                type="text"
                style={{ flex: 1 }}
                value={transferDetails.payerDFSP?.name?.toString() || ''}
              />
            </FormField.Container>
          </FormField.Container>
        </FormField.Container>
      </FormField.Container>
    </TabPanel>
  );

  return (
    <Modal title={`Transfer ${transferDetails.transferId} Details`} onClose={onModalCloseClick}>
      <div>
        <Tabs>
          <Tab>Basic Information</Tab>
          <Tab>Transfer Terms</Tab>
          <Tab>Technical Details</Tab>
          {BasicInformationTab}
          {TransferTermsTab}
          {TechnicalDetailsTab}
        </Tabs>
      </div>
    </Modal>
  );
};

export default connect(stateProps, dispatchProps, null, { context: ReduxContext })(TransferDetails);
// function trimTt(transferId: any) {
//   throw new Error('Function not implemented.');
// }
