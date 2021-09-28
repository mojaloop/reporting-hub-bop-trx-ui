import React, { FC } from 'react';
import { Modal, Tabs, Tab, TabPanel } from 'components';
import { connect } from 'react-redux';
import { State, Dispatch } from 'store/types';
import { ReduxContext } from 'store';
import { TransferDetail } from '../types';
import * as actions from '../actions';
import * as selectors from '../selectors';

const stateProps = (state: State) => ({
  transferDetails: selectors.getSelectedTransfer(state),
});

const dispatchProps = (dispatch: Dispatch) => ({
  onModalCloseClick: () => dispatch(actions.transferDetailsModalClose()),
});

interface ConnectorProps {
  transferDetails: TransferDetail;
  onModalCloseClick: () => void;
}

const TransferDetails: FC<ConnectorProps> = ({ transferDetails, onModalCloseClick }) => {
  /*
  const objectToFormInputs = (outerKey: string, o: any) => {
    return (
      <Row>
        {Object.keys(o).map((k) => (
          <Column key={`${outerKey}-${k}`}>
            <Field kind="dark" label={k}>
              <span>{o[k]}</span>
            </Field>
          </Column>
        ))}
      </Row>
    );
  };

  const TransferPartiesTab = (
    <Tabs>
      {transferDetails.quoteParties.map((qp: any) => (
        <Tab key={`${qp.quoteId}-${qp.transferParticipantRoleType}`}>
          {qp.transferParticipantRoleType}
        </Tab>
      ))}
    </Tabs>
  );
  const panels = transferDetails.quoteRequests.map((qr: QuoteRequest) => (
    <TabPanel key={qr.quoteId}>
      <Tabs>
        <Tab>Quote Request</Tab>
        <Tab>Quote Parties</Tab>
        <TabPanel>{objectToFormInputs(qr.quoteId, qr)}</TabPanel>
        <TabPanel>{TransferPartiesTab}</TabPanel>
      </Tabs>
    </TabPanel>
  ));

  const tabs = transferDetails.quoteRequests.map((qr: QuoteRequest) => (
    <Tab key={qr.quoteId}>{qr.quoteId}</Tab>
  ));

  const QuoteRequestsTab = (
    <TabPanel>
      <Tabs>
        {tabs}
        {panels}
      </Tabs>
    </TabPanel>
  );
  */
  return (
    <Modal title={`Transfer ${transferDetails.transferId} Details`} onClose={onModalCloseClick}>
      <div>
        <Tabs>
          <Tab>Quote Requests</Tab>
          <Tab>Quote Responses</Tab>
          <TabPanel>Quote Request Content</TabPanel>
          <TabPanel>Quote Responses Content</TabPanel>
        </Tabs>
      </div>
    </Modal>
  );
};

export default connect(stateProps, dispatchProps, null, { context: ReduxContext })(TransferDetails);
