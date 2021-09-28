export default {
  read: {
    delay: 200,
    call: () => ({
      status: 200,
      data: [
        {
          transferId: 1,
          quoteTimestamp: '2021-09-04T04:25:56+0000',
          transferTimestamp: '2021-09-04T04:25:56+0000',
          payerFspid: 'payer',
          payerIdType: 'payerIdType',
          payerIdValue: 'payerIdValue',
          payeeFspid: 'payee',
          payeeIdType: 'payeeIdType',
          payeeIdValue: 'payeeIdValue',
          transactionType: 'transactionType',
          currency: 'USD',
          amount: '100',
          state: 'state',
        },
      ],
    }),
  },
};
