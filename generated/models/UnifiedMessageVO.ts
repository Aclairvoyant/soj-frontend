/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UnifiedMessageVO = {
    aggregateCount?: number;
    aggregated?: boolean;
    category?: string;
    categoryEnum?: UnifiedMessageVO.categoryEnum;
    content?: string;
    createTime?: string;
    deleted?: boolean;
    expireTime?: string;
    expired?: boolean;
    id?: number;
    isRealtime?: number;
    messageType?: string;
    messageTypeEnum?: UnifiedMessageVO.messageTypeEnum;
    priority?: number;
    priorityDesc?: string;
    read?: boolean;
    readTime?: string;
    recipientId?: number;
    senderAvatar?: string;
    senderId?: number;
    senderName?: string;
    sourceId?: number;
    sourceType?: string;
    status?: number;
    statusDesc?: string;
    title?: string;
    unread?: boolean;
    updateTime?: string;
    url?: string;
};
export namespace UnifiedMessageVO {
    export enum categoryEnum {
        INTERACTION = 'INTERACTION',
        SYSTEM = 'SYSTEM',
        CONTEST = 'CONTEST',
        RATING = 'RATING',
        JUDGE = 'JUDGE',
    }
    export enum messageTypeEnum {
        LIKE_POST = 'LIKE_POST',
        COMMENT_POST = 'COMMENT_POST',
        REPLY_COMMENT = 'REPLY_COMMENT',
        FAVOUR_POST = 'FAVOUR_POST',
        FOLLOW_USER = 'FOLLOW_USER',
        MENTION_USER = 'MENTION_USER',
        SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT',
        SYSTEM_NOTICE = 'SYSTEM_NOTICE',
        ADMIN_ANNOUNCEMENT = 'ADMIN_ANNOUNCEMENT',
        EMERGENCY_NOTICE = 'EMERGENCY_NOTICE',
        MAINTENANCE_NOTICE = 'MAINTENANCE_NOTICE',
        POLICY_UPDATE = 'POLICY_UPDATE',
        SECURITY_ALERT = 'SECURITY_ALERT',
        PRIVATE_MESSAGE = 'PRIVATE_MESSAGE',
        CONTEST_REGISTRATION_SUCCESS = 'CONTEST_REGISTRATION_SUCCESS',
        CONTEST_START_REMINDER = 'CONTEST_START_REMINDER',
        CONTEST_END_REMINDER = 'CONTEST_END_REMINDER',
        CONTEST_STATUS_CHANGE = 'CONTEST_STATUS_CHANGE',
        CONTEST_RANKING_UPDATE = 'CONTEST_RANKING_UPDATE',
        CONTEST_RESULT_PUBLISHED = 'CONTEST_RESULT_PUBLISHED',
        RATING_CHANGE = 'RATING_CHANGE',
        RANK_PROMOTION = 'RANK_PROMOTION',
        ACHIEVEMENT_UNLOCK = 'ACHIEVEMENT_UNLOCK',
        MILESTONE_REACHED = 'MILESTONE_REACHED',
        SUBMIT_RESULT = 'SUBMIT_RESULT',
        CONTEST_SUBMIT_RESULT = 'CONTEST_SUBMIT_RESULT',
        CUSTOM_MESSAGE = 'CUSTOM_MESSAGE',
    }
}

