import { waitForReact } from 'testcafe-react-selectors';
import { FindTransfersPage, TransferRow } from '../page-objects/pages/TransfersTracingPage';
import { config } from '../config';
import { SideMenu } from '../page-objects/components/SideMenu';
import { VoodooClient, protocol } from 'mojaloop-voodoo-client';
import { v4 as uuidv4 } from 'uuid';

fixture `Find Transfers Feature`
  .page`${config.transfersMicrofrontendEndpoint}`
  .before(async (ctx) => {
    const cli = new VoodooClient('ws://localhost:3030/voodoo', { defaultTimeout: config.voodooTimeoutMs });
    await cli.connected();

    const hubAccounts: protocol.HubAccount[] = [
      {
        type: "HUB_MULTILATERAL_SETTLEMENT",
        currency: "USD",
      },
      {
        type: "HUB_RECONCILIATION",
        currency: "USD",
      },
      {
        type: "HUB_MULTILATERAL_SETTLEMENT",
        currency: "EUR",
      },
      {
        type: "HUB_RECONCILIATION",
        currency: "EUR",
      },
    ];
    await cli.createHubAccounts(hubAccounts);
    ctx.cli = cli;

    const accounts: protocol.AccountInitialization[] = [
      { currency: 'USD', initial_position: '0', ndc: 10000 },
      { currency: 'USD', initial_position: '0', ndc: 10000 },
      { currency: 'EUR', initial_position: '0', ndc: 10000 },
      { currency: 'EUR', initial_position: '0', ndc: 10000 },
    ];

    const participants = await cli.createParticipants(accounts);
    ctx.participants = participants;

    ctx.transfers = [];

    // Run two transfers
    const transfers1: protocol.TransferMessage[] = [{
      msg_sender: participants[1].name,
      msg_recipient: participants[0].name,
      currency: 'USD',
      amount: '10',
      transfer_id: uuidv4(),
    }];
    ctx.transfers.push(transfers1[0]);
    await cli.completeTransfers(transfers1);

    const transfers2: protocol.TransferMessage[] = [{
      msg_sender: participants[0].name,
      msg_recipient: participants[1].name,
      currency: 'USD',
      amount: '10',
      transfer_id: uuidv4(),
    }];
    ctx.transfers.push(transfers2[0]);
    await cli.completeTransfers(transfers2);

    const transfers3: protocol.TransferMessage[] = [{
      msg_sender: participants[2].name,
      msg_recipient: participants[3].name,
      currency: 'EUR',
      amount: '10',
      transfer_id: uuidv4(),
    }];
    ctx.transfers.push(transfers3[0]);
    await cli.completeTransfers(transfers3);

    // This transfer will fail and become 'ABORTED' due to invalid currency
    const transfers4: protocol.TransferMessage[] = [{
      msg_sender: participants[2].name,
      msg_recipient: participants[3].name,
      currency: 'AUD',
      amount: '10',
      transfer_id: uuidv4(),
    }];
    ctx.transfers.push(transfers4[0]);
    await cli.completeTransfers(transfers4);
  })
  .beforeEach(async (t) => {
    await waitForReact();
    await t
      .click(SideMenu.transfersButton).wait(1000);
  });

test.meta({
  ID: '',
  STORY: '',
  description: '',
})('Find transfers with no filters selected should return transfers', async (t) => {
  // navigate to the find transfers page
  await t.click(SideMenu.transfersButton).wait(1000);

  // click the find transfers button (no filters selected by default)
  await t.click(FindTransfersPage.findTransfersButton).wait(1000);

  // we should see two or more rows, one for each transfer we executed above
  const rows = await FindTransfersPage.getResultRows();
  await t.expect(rows.length).gt(1);

  // we should see the transfers we just created
  const transferIds = t.fixtureCtx.transfers.map((t: protocol.TransferMessage) => t.transfer_id);
  const rowIds = await Promise.all(rows.map((r: TransferRow) => r.id.innerText));

  for(let i = 0; i < transferIds.length; i++) {
    await t.expect(rowIds).contains(transferIds[i], 'rows dont contain transfers');
  }
});

test.meta({
  ID: '',
  STORY: '',
  description: '',
})('Clicking on transfer row should Transfer Modal popup', async (t) => {
  // navigate to the find transfers page
  await t.click(SideMenu.transfersButton).wait(1000);

  // click the find transfers button (no filters selected by default)
  await t.click(FindTransfersPage.findTransfersButton);

  // get all rows found
  const rows = await FindTransfersPage.getResultRows();

  // click the first found row
  await t.click(rows[0].row);
  const transferId = await rows[0].id.innerText;

  const popup = FindTransfersPage.getTransferDetailsModal(transferId);

  await t.expect(popup.exists).ok('Transfer details popup not found in dom');
  await t.click(popup.find('.rc-tabs__tab').withText('Basic Information')).wait(1000);
  t.expect(popup.find('.rc-tabs__tab--selected').withText('Basic Information'));
});

test.meta({
  ID: '',
  STORY: '',
})('Navigate to Technical Details Tab of Transfer Modal popup',
  async (t) => {
    // navigate to the find transfers page
    await t.click(SideMenu.transfersButton).wait(1000);

    // click the find transfers button (no filters selected by default)
    await t.click(FindTransfersPage.findTransfersButton);

    // get all rows found
    const rows = await FindTransfersPage.getResultRows();

    // click the first found row
    await t.click(rows[0].row);
    const transferId = await rows[0].id.innerText;

    const popup = FindTransfersPage.getTransferDetailsModal(transferId);
    await t.expect(popup.exists).ok('Transfer details popup not found in dom');
    await t.click(popup.find('.rc-tabs__tab').withText('Technical Details')).wait(1000);
    t.expect(popup.find('.rc-tabs__tab--selected').withText('Technical Details'));
  },
);

test.meta({
  ID: '',
  STORY: '',
  description: '',
})('Find transfer by specifying transfer ID', async (t) => {
  // navigate to the find transfers page
  await t.click(SideMenu.transfersButton).wait(1000);

  // Enter transfer id into search field
  await t.typeText(FindTransfersPage.transferIdSearchField, t.fixtureCtx.transfers[0].transfer_id).wait(1000);

  // click the find transfers button (no filters selected by default)
  await t.click(FindTransfersPage.findTransfersButton).wait(1000);

  // we should see exactly one transfer
  const rows = await FindTransfersPage.getResultRows();
  await t.expect(rows.length).eql(1);

  const rowIds = await Promise.all(rows.map((r: TransferRow) => r.id.innerText));
  await t.expect(rowIds[0]).eql(t.fixtureCtx.transfers[0].transfer_id, 'rows dont contain transfer');
});

test.meta({
  ID: '',
  STORY: '',
  description: '',
})('Filter transfers by currency', async (t) => {
  // navigate to the find transfers page
  await t.click(SideMenu.transfersButton).wait(1000);

  // Enter currency to filter by
  await t.typeText(FindTransfersPage.currencyFilterField, 'EUR').wait(1000);

  // click the find transfers button (no filters selected by default)
  await t.click(FindTransfersPage.findTransfersButton).wait(1000);

  const rows = await FindTransfersPage.getResultRows();
  const rowCurrency = await Promise.all(rows.map((r: TransferRow) => r.currency.innerText));

  for(let i = 0; i < rows.length; i++) {
    await t.expect(rowCurrency[i]).contains('EUR', 'rows dont contain transfers');
  }
});


test.meta({
  ID: '',
  STORY: '',
  description: '',
})('Filter transfers by state', async (t) => {
  // navigate to the find transfers page
  await t.click(SideMenu.transfersButton).wait(1000);

  // Enter transfer state to filter by
  await t.typeText(FindTransfersPage.transferStateFilterField, 'ABORTED').wait(1000);
  await FindTransfersPage.selectTransferStateFilter('ABORTED');

  // click the find transfers button (no filters selected by default)
  await t.click(FindTransfersPage.findTransfersButton).wait(1000);

  const rows = await FindTransfersPage.getResultRows();
  const rowState = await Promise.all(rows.map((r: TransferRow) => r.transferState.innerText));

  for(let i = 0; i < rows.length; i++) {
    await t.expect(rowState[i]).contains('ABORTED', 'rows dont contain transfers');
  }
});

test.only.meta({
  ID: '',
  STORY: '',
  description: '',
})('Transfer dashboard charts appear', async (t) => {
  // navigate to the find transfers page
  await t.click(SideMenu.transfersButton).wait(1000);

  // click the find transfers button (no filters selected by default)
  await t.click(FindTransfersPage.findTransfersButton).wait(1000);

  await t.expect(FindTransfersPage.getChart('TransfersByCurrencyChart').exists).ok('TransfersByCurrencyChart not found');
  await t.expect(FindTransfersPage.getChart('TransfersByPayerChart').exists).ok('TransfersByPayerChart not found');
  await t.expect(FindTransfersPage.getChart('TransfersByPayeeChart').exists).ok('TransfersByPayeeChart not found');
  await t.expect(FindTransfersPage.getChart('ErrorsByErrorCodeChart').exists).ok('ErrorsByErrorCodeChart not found');
  await t.expect(FindTransfersPage.getChart('ErrorsByPayerChart').exists).ok('ErrorsByPayerChart not found');
  await t.expect(FindTransfersPage.getChart('ErrorsByPayeeChart').exists).ok('ErrorsByPayeeChart not found');
});

test.skip.meta({
  ID: '',
  STORY: '',
})('Filter Transfers by Payer FSPID, Payer Id and Payer value',
  async (t) => {
    // To be able to perform filters on Payer/Payee we need to
    // perform quotes with the participants so that they populate the
    // `quoteParty` table. This will involve having to rework the harness
    // to use the testing toolkit.
  },
);

test.skip.meta({
  ID: '',
  STORY: '',
})('Filter Transfers by Payee FSPID, Payee Id and Payee value',
  async (t) => {
    // To be able to perform filters on Payer/Payee we need to
    // perform quotes with the participants so that they populate the
    // `quoteParty` table. This will involve having to rework the harness
    // to use the testing toolkit.
  },
);

test.skip.meta({
  ID: '',
  STORY: '',
})('Navigate to Party Events Modal of Transfer Modal',
  async (t) => {
    // This requires upgrading the test harness to initiate party lookup
    // requests with the ALS. Will also require using the TTK and adding the
    // account-lookup-service sidecar.
  },
);

test.skip.meta({
  ID: '',
  STORY: '',
})('Navigate to Quote Events Modal of Transfer Modal',
  async (t) => {
    // This requires upgrading the test harness to initiate quote requests
    // requests with the quoting service. Will also require using the TTK
    // and adding the quoting-service sidecar.
  },
);

test.skip.meta({
  ID: '',
  STORY: '',
})('Navigate to Transfer Events Modal of Transfer Modal',
  async (t) => {
    // This requires upgrading the test harness to initiate party lookup
    // requests with the ALS. This requires the adding of the
    // central-ledger-handler-* sidecars.
  },
);

test.skip.meta({
  ID: '',
  STORY: '',
})('Navigate to Settlement Events Modal of Transfer Modal',
  async (t) => {
    // This requires upgrading the test harness to initiate settlement
    // requests with the central-settlements service.
    // This requires the adding of the central-settlement sidecar.
  },
);
