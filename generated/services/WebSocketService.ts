/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Map_string_object_ } from '../models/BaseResponse_Map_string_object_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WebSocketService {
    /**
     * 向比赛广播消息
     * @param contestId contestId
     * @param message message
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static broadcastToContestUsingPost(
        contestId: number,
        message: any,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/websocket/contest/{contestId}/broadcast',
            path: {
                'contestId': contestId,
            },
            body: message,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 关闭指定比赛的所有WebSocket连接
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
            url: '/api/websocket/contest/{contestId}/close',
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
     * 获取指定比赛的连接数
     * @param contestId contestId
     * @returns BaseResponse_long_ OK
     * @throws ApiError
     */
    public static getContestConnectionCountUsingGet(
        contestId: number,
    ): CancelablePromise<BaseResponse_long_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/websocket/contest/{contestId}/count',
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
     * 推送排名更新
     * @param contestId contestId
     * @param ranking ranking
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static pushRankingUpdateUsingPost(
        contestId: number,
        ranking: any,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/websocket/contest/{contestId}/ranking',
            path: {
                'contestId': contestId,
            },
            body: ranking,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 推送比赛状态更新
     * @param contestId contestId
     * @param status status
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static pushContestStatusUpdateUsingPost(
        contestId: number,
        status: any,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/websocket/contest/{contestId}/status',
            path: {
                'contestId': contestId,
            },
            body: status,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 向比赛推送测试消息
     * @param contestId contestId
     * @param message message
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static sendTestMessageUsingPost(
        contestId: number,
        message: any,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/websocket/contest/{contestId}/test',
            path: {
                'contestId': contestId,
            },
            body: message,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 向指定用户推送消息
     * @param contestId contestId
     * @param message message
     * @param userId userId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static sendToUserUsingPost(
        contestId: number,
        message: any,
        userId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/websocket/contest/{contestId}/user/{userId}',
            path: {
                'contestId': contestId,
                'userId': userId,
            },
            body: message,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取WebSocket连接统计信息
     * @returns BaseResponse_Map_string_object_ OK
     * @throws ApiError
     */
    public static getConnectionStatsUsingGet(): CancelablePromise<BaseResponse_Map_string_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/websocket/stats',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
