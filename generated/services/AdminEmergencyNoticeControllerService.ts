/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_List_long_ } from '../models/BaseResponse_List_long_';
import type { BaseResponse_Map_string_object_ } from '../models/BaseResponse_Map_string_object_';
import type { ContestEmergencyNoticeRequest } from '../models/ContestEmergencyNoticeRequest';
import type { MaintenanceNoticeRequest } from '../models/MaintenanceNoticeRequest';
import type { ProblemUpdateNoticeRequest } from '../models/ProblemUpdateNoticeRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminEmergencyNoticeControllerService {
    /**
     * sendContestExtensionNotice
     * @param contestId contestId
     * @param newEndTime newEndTime
     * @param reason reason
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static sendContestExtensionNoticeUsingPost(
        contestId: number,
        newEndTime: string,
        reason: string,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/emergency/contest/extension',
            query: {
                'contestId': contestId,
                'newEndTime': newEndTime,
                'reason': reason,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * sendContestEmergencyNotice
     * @param request request
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static sendContestEmergencyNoticeUsingPost(
        request: ContestEmergencyNoticeRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/emergency/contest/notice',
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * sendContestPauseNotice
     * @param contestId contestId
     * @param reason reason
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static sendContestPauseNoticeUsingPost(
        contestId: number,
        reason: string,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/emergency/contest/pause',
            query: {
                'contestId': contestId,
                'reason': reason,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * sendContestResumeNotice
     * @param contestId contestId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static sendContestResumeNoticeUsingPost(
        contestId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/emergency/contest/resume',
            query: {
                'contestId': contestId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * closeContestConnections
     * @param contestId contestId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static closeContestConnectionsUsingPost(
        contestId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/emergency/contest/{contestId}/close-connections',
            path: {
                'contestId': contestId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getContestOnlineUsers
     * @param contestId contestId
     * @returns BaseResponse_List_long_ OK
     * @throws ApiError
     */
    public static getContestOnlineUsersUsingGet(
        contestId: number,
    ): CancelablePromise<BaseResponse_List_long_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/emergency/contest/{contestId}/online-users',
            path: {
                'contestId': contestId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * disconnectUser
     * @param userId userId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static disconnectUserUsingPost(
        userId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/emergency/disconnect/{userId}',
            path: {
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * sendMaintenanceNotice
     * @param request request
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static sendMaintenanceNoticeUsingPost(
        request: MaintenanceNoticeRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/emergency/maintenance',
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getOnlineUsers
     * @returns BaseResponse_List_long_ OK
     * @throws ApiError
     */
    public static getOnlineUsersUsingGet(): CancelablePromise<BaseResponse_List_long_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/emergency/online-users',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * sendProblemUpdateNotice
     * @param request request
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static sendProblemUpdateNoticeUsingPost(
        request: ProblemUpdateNoticeRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/emergency/problem/update',
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getConnectionStats
     * @returns BaseResponse_Map_string_object_ OK
     * @throws ApiError
     */
    public static getConnectionStatsUsingGet(): CancelablePromise<BaseResponse_Map_string_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/emergency/stats/connections',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
