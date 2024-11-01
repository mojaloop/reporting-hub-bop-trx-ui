import { Selector, t } from 'testcafe';

export type TransferRow = {
  row: Selector;
  id: Selector;
  transferState: Selector;
  type: Selector;
  currency: Selector;
  amount: Selector;
  payerDFSPId: Selector;
  payeeDFSPId: Selector;
  settlementBatchId: Selector;
  dateSubmitted: Selector;
};

export const FindTransfersPage = {
  transferIdSearchField: Selector('.placeholder').withText('Transfer ID').sibling('.rc-textfield'),
  currencyFilterField: Selector('.placeholder').withText('Currency').sibling('.rc-textfield'),
  transferStateFilterField: Selector('.placeholder')
    .withText('Transfer State')
    .sibling('.rc-select'),
  clearFiltersButton: Selector('.rc-button').withText('Clear Filters'),
  findTransfersButton: Selector('.rc-button').withText('Find Transfers'),

  async getResultRows(): Promise<TransferRow[]> {
    const rows = Selector('.rc-table__body__row');
    const length = await rows.count;
    return Array.from({ length }).map((_, i) => ({
      row: rows.nth(i),
      id: rows.nth(i).find('.rc-table__body__cell').nth(0),
      transferState: rows.nth(i).find('.rc-table__body__cell').nth(1),
      type: rows.nth(i).find('.rc-table__body__cell').nth(2),
      currency: rows.nth(i).find('.rc-table__body__cell').nth(3),
      amount: rows.nth(i).find('.rc-table__body__cell').nth(4),
      payerDFSPId: rows.nth(i).find('.rc-table__body__cell').nth(5),
      payeeDFSPId: rows.nth(i).find('.rc-table__body__cell').nth(6),
      settlementBatchId: rows.nth(i).find('.rc-table__body__cell').nth(7),
      dateSubmitted: rows.nth(i).find('.rc-table__body__cell').nth(8),
    }));
  },

  getTransferDetailsModal: (transferId: string) =>
    Selector('.rc-modal__header__title')
      .withText(`Transfer ${transferId} Details`)
      .parent()
      .parent('.rc-modal'),
  selectTransferStateFilter: (transferState: string) =>
    t.click(Selector('.rc-select__option__label').withText(transferState).parent()).wait(1000),
  getChart: (chartId: string) => Selector(`#${chartId}`),
};
