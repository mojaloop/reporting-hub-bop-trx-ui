import { Selector } from 'testcafe';

export type TransferRow = {
  row: Selector,
  id: Selector,
}

export const FindTransfersPage = {
  transferId: Selector('.rc-field').withAttribute('placeholder', 'Transfer ID' ),
  clearFiltersButton: Selector('.rc-button').withText('Clear Filters' ),
  findTransfersButton: Selector('.rc-button').withText('Find Transfers' ),

  async getResultRows(): Promise<TransferRow[]> {
    const rows = Selector('.rc-table__body__row');
    const length = await rows.count;
    return Array
      .from({ length })
      .map((_, i) => ({
        row: rows.nth(i),
        id: rows.nth(i).find('.rc-table__body__cell').nth(0),
      }));
  },

  getTransferDetailsModal: (transferId: string) => Selector('.rc-modal').withProps({ title: `Transfer ${transferId} Details` }),
};
