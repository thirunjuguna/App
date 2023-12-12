import PropTypes from 'prop-types';
import React, {memo, useMemo} from 'react';
import _ from 'underscore';
import * as ReportActionsUtils from '@libs/ReportActionsUtils';
import * as ReportUtils from '@libs/ReportUtils';
import reportPropTypes from '@pages/reportPropTypes';
import CONST from '@src/CONST';
import ReportActionItem from './ReportActionItem';
import ReportActionItemParentAction from './ReportActionItemParentAction';
import reportActionPropTypes from './reportActionPropTypes';

const propTypes = {
    /** All the data of the action item */
    reportAction: PropTypes.shape(reportActionPropTypes).isRequired,

    /** Position index of the report action in the overall report FlatList view */
    index: PropTypes.number.isRequired,

    /** Report for this action */
    report: reportPropTypes.isRequired,

    /** The ID of the most recent IOU report action connected with the shown report */
    mostRecentIOUReportActionID: PropTypes.string,

    /** If the thread divider line should be hidden */
    shouldHideThreadDividerLine: PropTypes.bool.isRequired,

    /** Should we display the new marker on top of the comment? */
    shouldDisplayNewMarker: PropTypes.bool.isRequired,

    /** Linked report action ID */
    linkedReportActionID: PropTypes.string,

    displayAsGroup: PropTypes.bool.isRequired,
};

const defaultProps = {
    mostRecentIOUReportActionID: '',
    linkedReportActionID: '',
};

function ReportActionsListItemRenderer({
    reportAction,
    index,
    report,
    displayAsGroup,
    mostRecentIOUReportActionID,
    shouldHideThreadDividerLine,
    shouldDisplayNewMarker,
    linkedReportActionID,
}) {
    const shouldDisplayParentAction =
        reportAction.actionName === CONST.REPORT.ACTIONS.TYPE.CREATED &&
        ReportUtils.isChatThread(report) &&
        !ReportActionsUtils.isTransactionThread(ReportActionsUtils.getParentReportAction(report));

    /**
     * Create a lightweight ReportAction so as to keep the re-rendering as light as possible by
     * passing in only the required props.
     */
    const action = useMemo(
        () => ({
            reportActionID: reportAction.reportActionID,
            message: reportAction.message,
            pendingAction: reportAction.pendingAction,
            actionName: reportAction.actionName,
            errors: reportAction.errors,
            originalMessage: reportAction.originalMessage,
            childCommenterCount: reportAction.childCommenterCount,
            linkMetadata: reportAction.linkMetadata,
            childReportID: reportAction.childReportID,
            childLastVisibleActionCreated: reportAction.childLastVisibleActionCreated,
            whisperedToAccountIDs: reportAction.whisperedToAccountIDs,
            error: reportAction.error,
            created: reportAction.created,
            actorAccountID: reportAction.actorAccountID,
        }),
        [
            reportAction.actionName,
            reportAction.childCommenterCount,
            reportAction.childLastVisibleActionCreated,
            reportAction.childReportID,
            reportAction.created,
            reportAction.error,
            reportAction.errors,
            reportAction.linkMetadata,
            reportAction.message,
            reportAction.originalMessage,
            reportAction.pendingAction,
            reportAction.reportActionID,
            reportAction.whisperedToAccountIDs,
            reportAction.actorAccountID,
        ],
    );

    return shouldDisplayParentAction ? (
        <ReportActionItemParentAction
            shouldHideThreadDividerLine={shouldDisplayParentAction && shouldHideThreadDividerLine}
            reportID={report.reportID}
            parentReportID={`${report.parentReportID}`}
            shouldDisplayNewMarker={shouldDisplayNewMarker}
        />
    ) : (
        <ReportActionItem
            shouldHideThreadDividerLine={shouldHideThreadDividerLine}
            report={report}
            action={action}
            linkedReportActionID={linkedReportActionID}
            displayAsGroup={displayAsGroup}
            shouldDisplayNewMarker={shouldDisplayNewMarker}
            shouldShowSubscriptAvatar={
                (ReportUtils.isPolicyExpenseChat(report) || ReportUtils.isExpenseReport(report)) &&
                _.contains(
                    [CONST.REPORT.ACTIONS.TYPE.IOU, CONST.REPORT.ACTIONS.TYPE.REPORTPREVIEW, CONST.REPORT.ACTIONS.TYPE.SUBMITTED, CONST.REPORT.ACTIONS.TYPE.APPROVED],
                    reportAction.actionName,
                )
            }
            isMostRecentIOUReportAction={reportAction.reportActionID === mostRecentIOUReportActionID}
            index={index}
        />
    );
}

ReportActionsListItemRenderer.propTypes = propTypes;
ReportActionsListItemRenderer.defaultProps = defaultProps;
ReportActionsListItemRenderer.displayName = 'ReportActionsListItemRenderer';

export default memo(ReportActionsListItemRenderer);
