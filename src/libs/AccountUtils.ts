import type {OnyxEntry} from 'react-native-onyx';
import CONST from '@src/CONST';
import type {Account} from '@src/types/onyx';

const isValidateCodeFormSubmitting = (account: OnyxEntry<Account>) =>
    !!account?.isLoading && account.loadingForm === (account.requiresTwoFactorAuth ? CONST.FORMS.VALIDATE_TFA_CODE_FORM : CONST.FORMS.VALIDATE_CODE_FORM);

/** Whether the accound ID is an odd number, useful for A/B testing. */
const isAccountIDOddNumber = (accountID: number) => accountID % 2 === 1;

function isDelegateOnlySubmitter(account: OnyxEntry<Account>): boolean {
    const [delegate] = account?.delegatedAccess?.delegates ?? [];
    console.log('account::::::', account);
    if (!delegate) {
        return false;
    }
    return delegate?.role === CONST.DELEGATE_ROLE.SUBMITTER;
}

export default {isValidateCodeFormSubmitting, isAccountIDOddNumber, isDelegateOnlySubmitter};
