/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_Page_UserSysNoticeVO_ } from '../models/BaseResponse_Page_UserSysNoticeVO_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserSysNoticeControllerService {
    /**
     * batchDelete
     * @param ids ids
     * @param recipientId recipientId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static batchDeleteUsingPost(
        ids: Array<number>,
        recipientId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/userSysNotice/batchDelete',
            query: {
                'recipientId': recipientId,
            },
            body: ids,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * batchRead
     * @param ids ids
     * @param recipientId recipientId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static batchReadUsingPost(
        ids: Array<number>,
        recipientId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/userSysNotice/batchRead',
            query: {
                'recipientId': recipientId,
            },
            body: ids,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * delete
     * @param id id
     * @param recipientId recipientId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteUsingPost(
        id: number,
        recipientId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/userSysNotice/delete',
            query: {
                'id': id,
                'recipientId': recipientId,
            },
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
     * @param recipientId recipientId
     * @returns BaseResponse_Page_UserSysNoticeVO_ OK
     * @throws ApiError
     */
    public static pageUsingGet1(
        pageNum: number,
        pageSize: number,
        recipientId: number,
    ): CancelablePromise<BaseResponse_Page_UserSysNoticeVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/userSysNotice/page',
            query: {
                'pageNum': pageNum,
                'pageSize': pageSize,
                'recipientId': recipientId,
            },
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
     * @param recipientId recipientId
     * @returns BaseResponse_Page_UserSysNoticeVO_ OK
     * @throws ApiError
     */
    public static unreadPageUsingGet1(
        pageNum: number,
        pageSize: number,
        recipientId: number,
    ): CancelablePromise<BaseResponse_Page_UserSysNoticeVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/userSysNotice/unreadPage',
            query: {
                'pageNum': pageNum,
                'pageSize': pageSize,
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
