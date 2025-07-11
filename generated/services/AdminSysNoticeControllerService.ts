/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminSysNoticeAddRequest } from '../models/AdminSysNoticeAddRequest';
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_List_AdminSysNoticeVO_ } from '../models/BaseResponse_List_AdminSysNoticeVO_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminSysNoticeControllerService {
    /**
     * deleteNotice
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteNoticeUsingPost(
        id: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/adminSysNotice/delete',
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
     * getNotices
     * @param recipientId recipientId
     * @param state state
     * @returns BaseResponse_List_AdminSysNoticeVO_ OK
     * @throws ApiError
     */
    public static getNoticesUsingGet(
        recipientId?: number,
        state?: number,
    ): CancelablePromise<BaseResponse_List_AdminSysNoticeVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/adminSysNotice/list',
            query: {
                'recipientId': recipientId,
                'state': state,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listByProblemSet
     * @param problemSetId problemSetId
     * @returns BaseResponse_List_AdminSysNoticeVO_ OK
     * @throws ApiError
     */
    public static listByProblemSetUsingGet(
        problemSetId: number,
    ): CancelablePromise<BaseResponse_List_AdminSysNoticeVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/adminSysNotice/listByProblemSet',
            query: {
                'problemSetId': problemSetId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * markAsPulled
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static markAsPulledUsingPost(
        id: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/adminSysNotice/pull',
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
     * sendNotice
     * @param request request
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static sendNoticeUsingPost(
        request: AdminSysNoticeAddRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/adminSysNotice/send',
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getUnreadCount
     * @param recipientId recipientId
     * @returns BaseResponse_long_ OK
     * @throws ApiError
     */
    public static getUnreadCountUsingGet(
        recipientId: number,
    ): CancelablePromise<BaseResponse_long_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/adminSysNotice/unreadCount',
            query: {
                'recipientId': recipientId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
