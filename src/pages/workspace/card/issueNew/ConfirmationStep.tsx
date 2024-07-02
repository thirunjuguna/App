import React from 'react';
import {View} from 'react-native';
import {useOnyx} from 'react-native-onyx';
import Button from '@components/Button';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import InteractiveStepSubHeader from '@components/InteractiveStepSubHeader';
import MenuItemWithTopDescription from '@components/MenuItemWithTopDescription';
import ScreenWrapper from '@components/ScreenWrapper';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import useNetwork from '@hooks/useNetwork';
import useThemeStyles from '@hooks/useThemeStyles';
import * as CurrencyUtils from '@libs/CurrencyUtils';
import * as PersonalDetailsUtils from '@libs/PersonalDetailsUtils';
import Navigation from '@navigation/Navigation';
import * as Card from '@userActions/Card';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';
import type {IssueNewCardStep} from '@src/types/onyx/Card';

function getTranslationKeyForLimitType(limitType: string | undefined) {
    switch (limitType) {
        case CONST.EXPENSIFY_CARD.LIMIT_TYPES.SMART:
            return 'workspace.card.issueNewCard.smartLimit';
        case CONST.EXPENSIFY_CARD.LIMIT_TYPES.FIXED:
            return 'workspace.card.issueNewCard.fixedAmount';
        case CONST.EXPENSIFY_CARD.LIMIT_TYPES.MONTHLY:
            return 'workspace.card.issueNewCard.monthly';
        default:
            return '';
    }
}

function ConfirmationStep() {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const {isOffline} = useNetwork();

    const [issueNewCard] = useOnyx(ONYXKEYS.ISSUE_NEW_EXPENSIFY_CARD);

    const data = issueNewCard?.data;

    const submit = () => {
        // TODO: the logic will be created when CreateExpensifyCard is ready
        Navigation.navigate(ROUTES.SETTINGS);
    };

    const editStep = (step: IssueNewCardStep) => {
        Card.setIssueNewCardStep(step);
    };

    const handleBackButtonPress = () => {
        Card.setIssueNewCardStep(CONST.EXPENSIFY_CARD.STEP.CARD_NAME);
    };

    const translationForLimitType = getTranslationKeyForLimitType(data?.limitType);

    return (
        <ScreenWrapper
            testID={ConfirmationStep.displayName}
            includeSafeAreaPaddingBottom={false}
            shouldEnablePickerAvoiding={false}
            shouldEnableMaxHeight
        >
            <HeaderWithBackButton
                title={translate('workspace.card.issueCard')}
                onBackButtonPress={handleBackButtonPress}
            />
            <View style={[styles.ph5, styles.mb5, styles.mt3, {height: CONST.BANK_ACCOUNT.STEPS_HEADER_HEIGHT}]}>
                <InteractiveStepSubHeader
                    startStepIndex={5}
                    stepNames={CONST.EXPENSIFY_CARD.STEP_NAMES}
                />
            </View>
            <Text style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mv3]}>{translate('workspace.card.issueNewCard.letsDoubleCheck')}</Text>
            <Text style={[styles.textLabelSupporting, styles.ph5, styles.mv3]}>{translate('workspace.card.issueNewCard.willBeReady')}</Text>
            <MenuItemWithTopDescription
                description={translate('workspace.card.issueNewCard.cardholder')}
                title={PersonalDetailsUtils.getPersonalDetailByEmail(data?.assigneeEmail ?? '')?.displayName}
                shouldShowRightIcon
                onPress={() => editStep(CONST.EXPENSIFY_CARD.STEP.ASSIGNEE)}
            />
            <MenuItemWithTopDescription
                description={translate('workspace.card.issueNewCard.cardType')}
                title={data?.cardType ? translate(`workspace.card.issueNewCard.${data?.cardType}Card`) : ''}
                shouldShowRightIcon
                onPress={() => editStep(CONST.EXPENSIFY_CARD.STEP.CARD_TYPE)}
            />
            <MenuItemWithTopDescription
                description={translate('workspace.card.issueNewCard.limit')}
                title={CurrencyUtils.convertToDisplayString(data?.limit)}
                shouldShowRightIcon
                onPress={() => editStep(CONST.EXPENSIFY_CARD.STEP.LIMIT)}
            />
            <MenuItemWithTopDescription
                description={translate('workspace.card.issueNewCard.limitType')}
                title={translationForLimitType ? translate(translationForLimitType) : ''}
                shouldShowRightIcon
                onPress={() => editStep(CONST.EXPENSIFY_CARD.STEP.LIMIT_TYPE)}
            />
            <MenuItemWithTopDescription
                description={translate('workspace.card.issueNewCard.name')}
                title={data?.cardTitle}
                shouldShowRightIcon
                onPress={() => editStep(CONST.EXPENSIFY_CARD.STEP.CARD_NAME)}
            />
            <View style={[styles.ph5, styles.pb5, styles.flexGrow1, styles.justifyContentEnd]}>
                <Button
                    isDisabled={isOffline}
                    success
                    large
                    style={[styles.w100]}
                    onPress={submit}
                    text={translate('workspace.card.issueCard')}
                />
            </View>
        </ScreenWrapper>
    );
}

ConfirmationStep.displayName = 'ConfirmationStep';

export default ConfirmationStep;
