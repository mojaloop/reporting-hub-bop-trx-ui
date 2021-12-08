import { PartyIdType, TransferState } from 'apollo/types';
import { DateRanges } from './types';

const composeTableColumnOptions = (opts: any) => {
  return Object.keys(opts).map((k) => ({
    label: k,
    value: opts[k],
  }));
};

export const dateRanges = composeTableColumnOptions({
  [DateRanges.PastTwentyFour]: DateRanges.PastTwentyFour,
  [DateRanges.Today]: DateRanges.Today,
  [DateRanges.PastFortyEight]: DateRanges.PastFortyEight,
  [DateRanges.PastWeek]: DateRanges.PastWeek,
  [DateRanges.PastMonth]: DateRanges.PastMonth,
  [DateRanges.PastYear]: DateRanges.PastYear,
  [DateRanges.Custom]: DateRanges.Custom,
});

export const partyIdTypeOptions = composeTableColumnOptions({
  [PartyIdType.Msisdn]: PartyIdType.Msisdn,
  [PartyIdType.Email]: PartyIdType.Email,
  [PartyIdType.PersonalId]: PartyIdType.PersonalId,
  [PartyIdType.Business]: PartyIdType.Business,
  [PartyIdType.Device]: PartyIdType.Device,
  [PartyIdType.AccountId]: PartyIdType.AccountId,
  [PartyIdType.Iban]: PartyIdType.Iban,
  [PartyIdType.Alias]: PartyIdType.Alias,
});

export const transferStateOptions = composeTableColumnOptions({
  [TransferState.Aborted]: TransferState.Aborted,
  [TransferState.Committed]: TransferState.Committed,
  [TransferState.Reserved]: TransferState.Reserved,
});
