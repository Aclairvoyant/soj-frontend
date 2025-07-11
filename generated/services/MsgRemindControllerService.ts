/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_List_MsgRemindVO_ } from '../models/BaseResponse_List_MsgRemindVO_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_MsgRemindVO_ } from '../models/BaseResponse_Page_MsgRemindVO_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MsgRemindControllerService {
    /**
     * batchDeleteMessage
     * @param req req
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static batchDeleteMessageUsingPost(
        req: any,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/msgRemind/batchDelete',
            body: req,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * markBatchAsRead
     * @param req req
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static markBatchAsReadUsingPost(
        req: any,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/msgRemind/batchRead',
            body: req,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deleteMessage
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteMessageUsingPost(
        id: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/msgRemind/delete',
            query: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * list
     * @returns BaseResponse_List_MsgRemindVO_ OK
     * @throws ApiError
     */
    public static listUsingGet(): CancelablePromise<BaseResponse_List_MsgRemindVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/msgRemind/list',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * page
     * @param pageNum pageNum
     * @param pageSize pageSize
     * @returns BaseResponse_Page_MsgRemindVO_ OK
     * @throws ApiError
     */
    public static pageUsingGet(
        pageNum: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<BaseResponse_Page_MsgRemindVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/msgRemind/page',
            query: {
                'pageNum': pageNum,
                'pageSize': pageSize,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * markAsRead
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static markAsReadUsingPost(
        id: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/msgRemind/read',
            query: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * markAllAsRead
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static markAllAsReadUsingPost(): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/msgRemind/readAll',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getTotalCount
     * @returns BaseResponse_long_ OK
     * @throws ApiError
     */
    public static getTotalCountUsingGet(): CancelablePromise<BaseResponse_long_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/msgRemind/totalCount',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getUnreadCount
     * @returns BaseResponse_long_ OK
     * @throws ApiError
     */
    public static getUnreadCountUsingGet1(): CancelablePromise<BaseResponse_long_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/msgRemind/unreadCount',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * unreadPage
     * @param pageNum pageNum
     * @param pageSize pageSize
     * @returns BaseResponse_Page_MsgRemindVO_ OK
     * @throws ApiError
     */
    public static unreadPageUsingGet(
        pageNum: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<BaseResponse_Page_MsgRemindVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/msgRemind/unreadPage',
            query: {
                'pageNum': pageNum,
                'pageSize': pageSize,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
