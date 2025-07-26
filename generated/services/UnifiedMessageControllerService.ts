/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminSendMessageRequest } from '../models/AdminSendMessageRequest';
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_List_UnifiedMessageVO_ } from '../models/BaseResponse_List_UnifiedMessageVO_';
import type { BaseResponse_Map_string_long_ } from '../models/BaseResponse_Map_string_long_';
import type { BaseResponse_Map_string_object_ } from '../models/BaseResponse_Map_string_object_';
import type { BaseResponse_Page_UnifiedMessageVO_ } from '../models/BaseResponse_Page_UnifiedMessageVO_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UnifiedMessageControllerService {
    /**
     * sendBatchMessage
     * @param request request
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static sendBatchMessageUsingPost(
        request: AdminSendMessageRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/message/admin/batch',
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * sendBroadcastMessage
     * @param request request
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static sendBroadcastMessageUsingPost(
        request: AdminSendMessageRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/message/admin/broadcast',
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * sendEmergencyNotice
     * @param params params
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static sendEmergencyNoticeUsingPost(
        params: any,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/message/admin/emergency',
            body: params,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * sendPrivateMessage
     * @param request request
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static sendPrivateMessageUsingPost(
        request: AdminSendMessageRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/message/admin/send',
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getMessageSendStatistics
     * @param days days
     * @returns BaseResponse_Map_string_object_ OK
     * @throws ApiError
     */
    public static getMessageSendStatisticsUsingGet(
        days: number = 7,
    ): CancelablePromise<BaseResponse_Map_string_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/message/admin/statistics',
            query: {
                'days': days,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * clearAllMessages
     * @param category category
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static clearAllMessagesUsingPost(
        category?: string,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/message/clear',
            query: {
                'category': category,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * batchDeleteMessages
     * @param messageIds messageIds
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static batchDeleteMessagesUsingPost(
        messageIds: Array<number>,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/message/delete/batch',
            body: messageIds,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deleteMessage
     * @param messageId messageId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteMessageUsingPost(
        messageId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/message/delete/{messageId}',
            path: {
                'messageId': messageId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * checkOnlineStatus
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static checkOnlineStatusUsingGet(): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/message/online/check',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * pageUserMessages
     * @param category category
     * @param pageNum pageNum
     * @param pageSize pageSize
     * @param status status
     * @returns BaseResponse_Page_UnifiedMessageVO_ OK
     * @throws ApiError
     */
    public static pageUserMessagesUsingGet(
        category?: string,
        pageNum: number = 1,
        pageSize: number = 10,
        status?: number,
    ): CancelablePromise<BaseResponse_Page_UnifiedMessageVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/message/page',
            query: {
                'category': category,
                'pageNum': pageNum,
                'pageSize': pageSize,
                'status': status,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getPushSettings
     * @returns BaseResponse_Map_string_object_ OK
     * @throws ApiError
     */
    public static getPushSettingsUsingGet(): CancelablePromise<BaseResponse_Map_string_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/message/push/settings',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updatePushSettings
     * @param settings settings
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updatePushSettingsUsingPost(
        settings: any,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/message/push/settings',
            body: settings,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * markAllAsRead
     * @param category category
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static markAllAsReadUsingPost(
        category?: string,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/message/read/all',
            query: {
                'category': category,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * markBatchAsRead
     * @param messageIds messageIds
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static markBatchAsReadUsingPost(
        messageIds: Array<number>,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/message/read/batch',
            body: messageIds,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * markAsRead
     * @param messageId messageId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static markAsReadUsingPost(
        messageId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/message/read/{messageId}',
            path: {
                'messageId': messageId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getMessageStatistics
     * @param days days
     * @returns BaseResponse_Map_string_object_ OK
     * @throws ApiError
     */
    public static getMessageStatisticsUsingGet(
        days: number = 7,
    ): CancelablePromise<BaseResponse_Map_string_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/message/statistics',
            query: {
                'days': days,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getUnreadMessages
     * @param category category
     * @param limit limit
     * @returns BaseResponse_List_UnifiedMessageVO_ OK
     * @throws ApiError
     */
    public static getUnreadMessagesUsingGet(
        category?: string,
        limit: number = 20,
    ): CancelablePromise<BaseResponse_List_UnifiedMessageVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/message/unread',
            query: {
                'category': category,
                'limit': limit,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getUnreadCount
     * @returns BaseResponse_Map_string_long_ OK
     * @throws ApiError
     */
    public static getUnreadCountUsingGet(): CancelablePromise<BaseResponse_Map_string_long_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/message/unread/count',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
