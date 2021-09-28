export default {
  read: {
    delay: 200,
    call: () => ({
      status: 200,
      data: {
        id: 1,
        transferId: 1,
        quoteRequests: [
          {
            quoteId: 1,
            transferParticipantRoleType: 'test1',
          },
          {
            quoteId: 2,
            transferParticipantRoleType: 'test2',
          },
          {
            quoteId: 3,
            transferParticipantRoleType: 'test3',
          },
        ],
        quoteParties: [],
        quoteResponses: [],
        quoteErrors: [],
        transferPrepares: [],
        transferFulfilments: [],
        transferParticipants: [],
        transferStateChanges: [],
      },
    }),
  },
};
