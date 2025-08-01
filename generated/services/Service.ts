/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnouncementAddRequest } from '../models/AnnouncementAddRequest';
import type { AnnouncementQueryRequest } from '../models/AnnouncementQueryRequest';
import type { AnnouncementUpdateRequest } from '../models/AnnouncementUpdateRequest';
import type { BaseResponse } from '../models/BaseResponse';
import type { BaseResponse_AnnouncementVO_ } from '../models/BaseResponse_AnnouncementVO_';
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_ContestQuestionVO_ } from '../models/BaseResponse_ContestQuestionVO_';
import type { BaseResponse_ContestRankingVO_ } from '../models/BaseResponse_ContestRankingVO_';
import type { BaseResponse_ContestSubmission_ } from '../models/BaseResponse_ContestSubmission_';
import type { BaseResponse_ContestVO_ } from '../models/BaseResponse_ContestVO_';
import type { BaseResponse_int_ } from '../models/BaseResponse_int_';
import type { BaseResponse_List_ACMContestRankingVO_ } from '../models/BaseResponse_List_ACMContestRankingVO_';
import type { BaseResponse_List_Announcement_ } from '../models/BaseResponse_List_Announcement_';
import type { BaseResponse_List_ContestQuestionVO_ } from '../models/BaseResponse_List_ContestQuestionVO_';
import type { BaseResponse_List_ContestRankingVO_ } from '../models/BaseResponse_List_ContestRankingVO_';
import type { BaseResponse_List_ContestRegistrationVO_ } from '../models/BaseResponse_List_ContestRegistrationVO_';
import type { BaseResponse_List_ContestSubmission_ } from '../models/BaseResponse_List_ContestSubmission_';
import type { BaseResponse_List_ContestVO_ } from '../models/BaseResponse_List_ContestVO_';
import type { BaseResponse_List_IOIContestRankingVO_ } from '../models/BaseResponse_List_IOIContestRankingVO_';
import type { BaseResponse_List_OIContestRankingVO_ } from '../models/BaseResponse_List_OIContestRankingVO_';
import type { BaseResponse_List_PermissionActionVO_ } from '../models/BaseResponse_List_PermissionActionVO_';
import type { BaseResponse_List_PermissionModuleVO_ } from '../models/BaseResponse_List_PermissionModuleVO_';
import type { BaseResponse_List_Post_ } from '../models/BaseResponse_List_Post_';
import type { BaseResponse_List_PostCommentVO_ } from '../models/BaseResponse_List_PostCommentVO_';
import type { BaseResponse_List_ProblemSetVO_ } from '../models/BaseResponse_List_ProblemSetVO_';
import type { BaseResponse_List_Question_ } from '../models/BaseResponse_List_Question_';
import type { BaseResponse_List_QuestionCommentVO_ } from '../models/BaseResponse_List_QuestionCommentVO_';
import type { BaseResponse_List_QuestionSolve_ } from '../models/BaseResponse_List_QuestionSolve_';
import type { BaseResponse_List_QuestionVO_ } from '../models/BaseResponse_List_QuestionVO_';
import type { BaseResponse_List_RoleManagementVO_ } from '../models/BaseResponse_List_RoleManagementVO_';
import type { BaseResponse_List_UserRatingHistoryVO_ } from '../models/BaseResponse_List_UserRatingHistoryVO_';
import type { BaseResponse_List_UserRatingVO_ } from '../models/BaseResponse_List_UserRatingVO_';
import type { BaseResponse_List_VirtualParticipationVO_ } from '../models/BaseResponse_List_VirtualParticipationVO_';
import type { BaseResponse_LoginUserVO_ } from '../models/BaseResponse_LoginUserVO_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Map_string_object_ } from '../models/BaseResponse_Map_string_object_';
import type { BaseResponse_Page_AnnouncementVO_ } from '../models/BaseResponse_Page_AnnouncementVO_';
import type { BaseResponse_Page_ContestSubmission_ } from '../models/BaseResponse_Page_ContestSubmission_';
import type { BaseResponse_Page_ContestVO_ } from '../models/BaseResponse_Page_ContestVO_';
import type { BaseResponse_Page_PostVO_ } from '../models/BaseResponse_Page_PostVO_';
import type { BaseResponse_Page_ProblemSetVO_ } from '../models/BaseResponse_Page_ProblemSetVO_';
import type { BaseResponse_Page_Question_ } from '../models/BaseResponse_Page_Question_';
import type { BaseResponse_Page_QuestionSubmitVO_ } from '../models/BaseResponse_Page_QuestionSubmitVO_';
import type { BaseResponse_Page_QuestionVO_ } from '../models/BaseResponse_Page_QuestionVO_';
import type { BaseResponse_Page_User_ } from '../models/BaseResponse_Page_User_';
import type { BaseResponse_Page_UserVO_ } from '../models/BaseResponse_Page_UserVO_';
import type { BaseResponse_PermissionCheckResultVO_ } from '../models/BaseResponse_PermissionCheckResultVO_';
import type { BaseResponse_PersonalDataVO_ } from '../models/BaseResponse_PersonalDataVO_';
import type { BaseResponse_PostVO_ } from '../models/BaseResponse_PostVO_';
import type { BaseResponse_ProblemSetProgressStat_ } from '../models/BaseResponse_ProblemSetProgressStat_';
import type { BaseResponse_ProblemSetVO_ } from '../models/BaseResponse_ProblemSetVO_';
import type { BaseResponse_Question_ } from '../models/BaseResponse_Question_';
import type { BaseResponse_QuestionRunResultVO_ } from '../models/BaseResponse_QuestionRunResultVO_';
import type { BaseResponse_QuestionSubmit_ } from '../models/BaseResponse_QuestionSubmit_';
import type { BaseResponse_QuestionVO_ } from '../models/BaseResponse_QuestionVO_';
import type { BaseResponse_string_ } from '../models/BaseResponse_string_';
import type { BaseResponse_User_ } from '../models/BaseResponse_User_';
import type { BaseResponse_UserPermissionVO_ } from '../models/BaseResponse_UserPermissionVO_';
import type { BaseResponse_UserRatingVO_ } from '../models/BaseResponse_UserRatingVO_';
import type { BaseResponse_UserVO_ } from '../models/BaseResponse_UserVO_';
import type { BaseResponse_VirtualParticipationVO_ } from '../models/BaseResponse_VirtualParticipationVO_';
import type { BatchRoleUpdateRequest } from '../models/BatchRoleUpdateRequest';
import type { ContestAddRequest } from '../models/ContestAddRequest';
import type { ContestQueryRequest } from '../models/ContestQueryRequest';
import type { ContestRegisterRequest } from '../models/ContestRegisterRequest';
import type { ContestUpdateRequest } from '../models/ContestUpdateRequest';
import type { DeleteRequest } from '../models/DeleteRequest';
import type { PermissionCheckRequest } from '../models/PermissionCheckRequest';
import type { PostAddRequest } from '../models/PostAddRequest';
import type { PostCommentAddRequest } from '../models/PostCommentAddRequest';
import type { PostEditRequest } from '../models/PostEditRequest';
import type { PostFavourAddRequest } from '../models/PostFavourAddRequest';
import type { PostFavourQueryRequest } from '../models/PostFavourQueryRequest';
import type { PostQueryRequest } from '../models/PostQueryRequest';
import type { PostThumbAddRequest } from '../models/PostThumbAddRequest';
import type { PostUpdateRequest } from '../models/PostUpdateRequest';
import type { ProblemSetAddRequest } from '../models/ProblemSetAddRequest';
import type { ProblemSetQueryRequest } from '../models/ProblemSetQueryRequest';
import type { ProblemSetUpdateRequest } from '../models/ProblemSetUpdateRequest';
import type { QuestionAddRequest } from '../models/QuestionAddRequest';
import type { QuestionCommentAddRequest } from '../models/QuestionCommentAddRequest';
import type { QuestionEditRequest } from '../models/QuestionEditRequest';
import type { QuestionQueryRequest } from '../models/QuestionQueryRequest';
import type { QuestionRunRequest } from '../models/QuestionRunRequest';
import type { QuestionSolve } from '../models/QuestionSolve';
import type { QuestionSubmitAddRequest } from '../models/QuestionSubmitAddRequest';
import type { QuestionSubmitQueryRequest } from '../models/QuestionSubmitQueryRequest';
import type { QuestionUpdateRequest } from '../models/QuestionUpdateRequest';
import type { RoleAddRequest } from '../models/RoleAddRequest';
import type { RolePermissionConfigRequest } from '../models/RolePermissionConfigRequest';
import type { RoleUpdateRequest } from '../models/RoleUpdateRequest';
import type { UserAddRequest } from '../models/UserAddRequest';
import type { UserForgetPasswordRequest } from '../models/UserForgetPasswordRequest';
import type { UserLoginByMailRequest } from '../models/UserLoginByMailRequest';
import type { UserLoginRequest } from '../models/UserLoginRequest';
import type { UserQueryRequest } from '../models/UserQueryRequest';
import type { UserRegisterRequest } from '../models/UserRegisterRequest';
import type { UserRoleUpdateRequest } from '../models/UserRoleUpdateRequest';
import type { UserUpdateMyRequest } from '../models/UserUpdateMyRequest';
import type { UserUpdateRequest } from '../models/UserUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class Service {
    /**
     * 微信公众号接口校验
     * @param echostr echostr
     * @param nonce nonce
     * @param signature signature
     * @param timestamp timestamp
     * @returns string OK
     * @throws ApiError
     */
    public static checkUsingGet(
        echostr?: string,
        nonce?: string,
        signature?: string,
        timestamp?: string,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/',
            query: {
                'echostr': echostr,
                'nonce': nonce,
                'signature': signature,
                'timestamp': timestamp,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 接收微信公众号消息
     * @returns any OK
     * @throws ApiError
     */
    public static receiveMessageUsingPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 新增公告 (仅管理员)
     * @param announcementAddRequest announcementAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addAnnouncementUsingPost(
        announcementAddRequest: AnnouncementAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/announcement/add',
            body: announcementAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 删除公告 (仅管理员)
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteAnnouncementUsingPost(
        deleteRequest: DeleteRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/announcement/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 根据id获取公告
     * @param id id
     * @returns BaseResponse_AnnouncementVO_ OK
     * @throws ApiError
     */
    public static getAnnouncementVoByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_AnnouncementVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/announcement/get/vo',
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
     * 获取所有可见的通知
     * @returns BaseResponse_List_Announcement_ OK
     * @throws ApiError
     */
    public static getAllVisibleUsingGet(): CancelablePromise<BaseResponse_List_Announcement_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/announcement/getAll',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 根据标题或者通知内容模糊查询
     * @param titleOrContent titleOrContent
     * @returns BaseResponse_List_Announcement_ OK
     * @throws ApiError
     */
    public static getByTitleOrContentUsingGet(
        titleOrContent?: string,
    ): CancelablePromise<BaseResponse_List_Announcement_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/announcement/getByTitleOrContent',
            query: {
                'titleOrContent': titleOrContent,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 分页获取公告列表
     * @param announcementQueryRequest announcementQueryRequest
     * @returns BaseResponse_Page_AnnouncementVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listAnnouncementVoByPageUsingPost(
        announcementQueryRequest: AnnouncementQueryRequest,
    ): CancelablePromise<BaseResponse_Page_AnnouncementVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/announcement/list/page/vo',
            body: announcementQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 更新公告 (仅管理员)
     * @param announcementUpdateRequest announcementUpdateRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateAnnouncementUsingPost(
        announcementUpdateRequest: AnnouncementUpdateRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/announcement/update',
            body: announcementUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * doCheckin
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static doCheckinUsingPost(): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/api/checkin/do',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getCheckinList
     * @returns BaseResponse_Map_string_object_ OK
     * @throws ApiError
     */
    public static getCheckinListUsingGet(): CancelablePromise<BaseResponse_Map_string_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/api/checkin/list',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 检查比赛访问权限
     * @param contestId contestId
     * @param password password
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static checkContestAccessUsingPost(
        contestId: number,
        password?: string,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/contest/access/check',
            query: {
                'contestId': contestId,
                'password': password,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 创建比赛
     * @param contestAddRequest contestAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addContestUsingPost(
        contestAddRequest: ContestAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/contest/add',
            body: contestAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 删除比赛
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteContestUsingPost(
        deleteRequest: DeleteRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/contest/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 根据id获取比赛
     * @param id id
     * @returns BaseResponse_ContestVO_ OK
     * @throws ApiError
     */
    public static getContestByIdUsingGet(
        id: number,
    ): CancelablePromise<BaseResponse_ContestVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/get/{id}',
            path: {
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
     * 分页获取比赛列表
     * @param contestQueryRequest contestQueryRequest
     * @returns BaseResponse_Page_ContestVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listContestByPageUsingPost(
        contestQueryRequest: ContestQueryRequest,
    ): CancelablePromise<BaseResponse_Page_ContestVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/contest/list/page',
            body: contestQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取我的比赛报名列表
     * @param page page
     * @param size size
     * @returns BaseResponse_List_ContestVO_ OK
     * @throws ApiError
     */
    public static getMyRegistrationsUsingGet(
        page: number = 1,
        size: number = 20,
    ): CancelablePromise<BaseResponse_List_ContestVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/my-registrations',
            query: {
                'page': page,
                'size': size,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取我创建的比赛
     * @returns BaseResponse_List_ContestVO_ OK
     * @throws ApiError
     */
    public static getMyContestsUsingGet(): CancelablePromise<BaseResponse_List_ContestVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/my/list',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取公开比赛列表
     * @returns BaseResponse_List_ContestVO_ OK
     * @throws ApiError
     */
    public static getPublicContestsUsingGet(): CancelablePromise<BaseResponse_List_ContestVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/public/list',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取ACM正式参赛排名
     * @param contestId contestId
     * @param page page
     * @param size size
     * @returns BaseResponse_List_ACMContestRankingVO_ OK
     * @throws ApiError
     */
    public static getAcmOfficialRankingUsingGet(
        contestId: number,
        page: number = 1,
        size: number = 50,
    ): CancelablePromise<BaseResponse_List_ACMContestRankingVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/ranking/acm/official/{contestId}',
            path: {
                'contestId': contestId,
            },
            query: {
                'page': page,
                'size': size,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取ACM虚拟参赛排名
     * @param contestId contestId
     * @param page page
     * @param size size
     * @returns BaseResponse_List_ACMContestRankingVO_ OK
     * @throws ApiError
     */
    public static getAcmVirtualRankingUsingGet(
        contestId: number,
        page: number = 1,
        size: number = 50,
    ): CancelablePromise<BaseResponse_List_ACMContestRankingVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/ranking/acm/virtual/{contestId}',
            path: {
                'contestId': contestId,
            },
            query: {
                'page': page,
                'size': size,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取ACM比赛排名
     * @param contestId contestId
     * @param page page
     * @param size size
     * @returns BaseResponse_List_ACMContestRankingVO_ OK
     * @throws ApiError
     */
    public static getAcmRankingUsingGet(
        contestId: number,
        page: number = 1,
        size: number = 50,
    ): CancelablePromise<BaseResponse_List_ACMContestRankingVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/ranking/acm/{contestId}',
            path: {
                'contestId': contestId,
            },
            query: {
                'page': page,
                'size': size,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取比赛参赛人数
     * @param contestId contestId
     * @returns BaseResponse_int_ OK
     * @throws ApiError
     */
    public static getParticipantCountUsingGet(
        contestId: number,
    ): CancelablePromise<BaseResponse_int_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/ranking/count/{contestId}',
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
     * 检查比赛是否封榜
     * @param contestId contestId
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static isFrozenUsingGet(
        contestId: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/ranking/frozen/check/{contestId}',
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
     * 获取封榜排名
     * @param contestId contestId
     * @param page page
     * @param size size
     * @returns BaseResponse_List_ContestRankingVO_ OK
     * @throws ApiError
     */
    public static getFrozenRankingUsingGet(
        contestId: number,
        page: number = 1,
        size: number = 50,
    ): CancelablePromise<BaseResponse_List_ContestRankingVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/ranking/frozen/{contestId}',
            path: {
                'contestId': contestId,
            },
            query: {
                'page': page,
                'size': size,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取IOI正式参赛排名
     * @param contestId contestId
     * @param page page
     * @param size size
     * @returns BaseResponse_List_IOIContestRankingVO_ OK
     * @throws ApiError
     */
    public static getIoiOfficialRankingUsingGet(
        contestId: number,
        page: number = 1,
        size: number = 50,
    ): CancelablePromise<BaseResponse_List_IOIContestRankingVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/ranking/ioi/official/{contestId}',
            path: {
                'contestId': contestId,
            },
            query: {
                'page': page,
                'size': size,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取IOI虚拟参赛排名
     * @param contestId contestId
     * @param page page
     * @param size size
     * @returns BaseResponse_List_IOIContestRankingVO_ OK
     * @throws ApiError
     */
    public static getIoiVirtualRankingUsingGet(
        contestId: number,
        page: number = 1,
        size: number = 50,
    ): CancelablePromise<BaseResponse_List_IOIContestRankingVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/ranking/ioi/virtual/{contestId}',
            path: {
                'contestId': contestId,
            },
            query: {
                'page': page,
                'size': size,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取IOI比赛排名
     * @param contestId contestId
     * @param page page
     * @param size size
     * @returns BaseResponse_List_IOIContestRankingVO_ OK
     * @throws ApiError
     */
    public static getIoiRankingUsingGet(
        contestId: number,
        page: number = 1,
        size: number = 50,
    ): CancelablePromise<BaseResponse_List_IOIContestRankingVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/ranking/ioi/{contestId}',
            path: {
                'contestId': contestId,
            },
            query: {
                'page': page,
                'size': size,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取混合排名
     * @param contestId contestId
     * @param page page
     * @param size size
     * @returns BaseResponse_List_ContestRankingVO_ OK
     * @throws ApiError
     */
    public static getMixedRankingUsingGet(
        contestId: number,
        page: number = 1,
        size: number = 50,
    ): CancelablePromise<BaseResponse_List_ContestRankingVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/ranking/mixed/{contestId}',
            path: {
                'contestId': contestId,
            },
            query: {
                'page': page,
                'size': size,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取比赛正式参赛人数
     * @param contestId contestId
     * @returns BaseResponse_int_ OK
     * @throws ApiError
     */
    public static getOfficialParticipantCountUsingGet(
        contestId: number,
    ): CancelablePromise<BaseResponse_int_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/ranking/official/count/{contestId}',
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
     * 获取正式参赛排名
     * @param contestId contestId
     * @param page page
     * @param size size
     * @returns BaseResponse_List_ContestRankingVO_ OK
     * @throws ApiError
     */
    public static getOfficialRankingUsingGet(
        contestId: number,
        page: number = 1,
        size: number = 50,
    ): CancelablePromise<BaseResponse_List_ContestRankingVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/ranking/official/{contestId}',
            path: {
                'contestId': contestId,
            },
            query: {
                'page': page,
                'size': size,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取OI正式参赛排名
     * @param contestId contestId
     * @param page page
     * @param size size
     * @returns BaseResponse_List_OIContestRankingVO_ OK
     * @throws ApiError
     */
    public static getOiOfficialRankingUsingGet(
        contestId: number,
        page: number = 1,
        size: number = 50,
    ): CancelablePromise<BaseResponse_List_OIContestRankingVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/ranking/oi/official/{contestId}',
            path: {
                'contestId': contestId,
            },
            query: {
                'page': page,
                'size': size,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取OI虚拟参赛排名
     * @param contestId contestId
     * @param page page
     * @param size size
     * @returns BaseResponse_List_OIContestRankingVO_ OK
     * @throws ApiError
     */
    public static getOiVirtualRankingUsingGet(
        contestId: number,
        page: number = 1,
        size: number = 50,
    ): CancelablePromise<BaseResponse_List_OIContestRankingVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/ranking/oi/virtual/{contestId}',
            path: {
                'contestId': contestId,
            },
            query: {
                'page': page,
                'size': size,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取OI比赛排名
     * @param contestId contestId
     * @param page page
     * @param size size
     * @returns BaseResponse_List_OIContestRankingVO_ OK
     * @throws ApiError
     */
    public static getOiRankingUsingGet(
        contestId: number,
        page: number = 1,
        size: number = 50,
    ): CancelablePromise<BaseResponse_List_OIContestRankingVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/ranking/oi/{contestId}',
            path: {
                'contestId': contestId,
            },
            query: {
                'page': page,
                'size': size,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 更新比赛所有用户排名
     * @param contestId contestId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateAllRankingsUsingPost(
        contestId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/contest/ranking/update/{contestId}',
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
     * 获取比赛虚拟参赛人数
     * @param contestId contestId
     * @returns BaseResponse_int_ OK
     * @throws ApiError
     */
    public static getVirtualParticipantCountUsingGet(
        contestId: number,
    ): CancelablePromise<BaseResponse_int_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/ranking/virtual/count/{contestId}',
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
     * 获取虚拟参赛排名
     * @param contestId contestId
     * @param page page
     * @param size size
     * @returns BaseResponse_List_ContestRankingVO_ OK
     * @throws ApiError
     */
    public static getVirtualRankingUsingGet(
        contestId: number,
        page: number = 1,
        size: number = 50,
    ): CancelablePromise<BaseResponse_List_ContestRankingVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/ranking/virtual/{contestId}',
            path: {
                'contestId': contestId,
            },
            query: {
                'page': page,
                'size': size,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取比赛排名
     * @param contestId contestId
     * @param page page
     * @param size size
     * @returns BaseResponse_List_ContestRankingVO_ OK
     * @throws ApiError
     */
    public static getContestRankingUsingGet(
        contestId: number,
        page: number = 1,
        size: number = 50,
    ): CancelablePromise<BaseResponse_List_ContestRankingVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/ranking/{contestId}',
            path: {
                'contestId': contestId,
            },
            query: {
                'page': page,
                'size': size,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取我的排名
     * @param contestId contestId
     * @returns BaseResponse_ContestRankingVO_ OK
     * @throws ApiError
     */
    public static getMyRankingUsingGet(
        contestId: number,
    ): CancelablePromise<BaseResponse_ContestRankingVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/ranking/{contestId}/my',
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
     * 获取用户排名位置
     * @param contestId contestId
     * @param userId userId
     * @returns BaseResponse_int_ OK
     * @throws ApiError
     */
    public static getUserRankPositionUsingGet(
        contestId: number,
        userId: number,
    ): CancelablePromise<BaseResponse_int_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/ranking/{contestId}/position/{userId}',
            path: {
                'contestId': contestId,
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
     * 获取用户排名
     * @param contestId contestId
     * @param userId userId
     * @returns BaseResponse_ContestRankingVO_ OK
     * @throws ApiError
     */
    public static getUserRankingUsingGet(
        contestId: number,
        userId: number,
    ): CancelablePromise<BaseResponse_ContestRankingVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/ranking/{contestId}/user/{userId}',
            path: {
                'contestId': contestId,
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
     * 获取我报名的比赛
     * @returns BaseResponse_List_ContestRegistrationVO_ OK
     * @throws ApiError
     */
    public static getMyRegistrationsUsingGet1(): CancelablePromise<BaseResponse_List_ContestRegistrationVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/register/my/list',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 报名比赛
     * @param contestId contestId
     * @param request request
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static registerContestUsingPost(
        contestId: number,
        request?: ContestRegisterRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/contest/register/{contestId}',
            path: {
                'contestId': contestId,
            },
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 取消报名
     * @param contestId contestId
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static unregisterContestUsingDelete(
        contestId: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/contest/register/{contestId}',
            path: {
                'contestId': contestId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * 批量报名
     * @param contestId contestId
     * @param userIds userIds
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static batchRegisterUsingPost(
        contestId: number,
        userIds: Array<number>,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/contest/register/{contestId}/batch',
            path: {
                'contestId': contestId,
            },
            body: userIds,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取比赛报名人数
     * @param contestId contestId
     * @returns BaseResponse_int_ OK
     * @throws ApiError
     */
    public static getParticipantCountUsingGet1(
        contestId: number,
    ): CancelablePromise<BaseResponse_int_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/register/{contestId}/count',
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
     * 获取比赛报名列表
     * @param contestId contestId
     * @returns BaseResponse_List_ContestRegistrationVO_ OK
     * @throws ApiError
     */
    public static getRegistrationListUsingGet(
        contestId: number,
    ): CancelablePromise<BaseResponse_List_ContestRegistrationVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/register/{contestId}/list',
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
     * 检查报名状态
     * @param contestId contestId
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static checkRegistrationStatusUsingGet(
        contestId: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/register/{contestId}/status',
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
     * 获取进行中的比赛列表
     * @returns BaseResponse_List_ContestVO_ OK
     * @throws ApiError
     */
    public static getRunningContestsUsingGet(): CancelablePromise<BaseResponse_List_ContestVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/running/list',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取比赛统计信息
     * @param id id
     * @returns BaseResponse_ContestVO_ OK
     * @throws ApiError
     */
    public static getContestStatsUsingGet(
        id: number,
    ): CancelablePromise<BaseResponse_ContestVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/stats/{id}',
            path: {
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
     * 批量更新比赛状态
     * @param contestIds contestIds
     * @param status status
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static batchUpdateContestStatusUsingPost(
        contestIds: Array<number>,
        status: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/contest/status/batch-update',
            query: {
                'contestIds': contestIds,
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
     * 更新比赛状态
     * @param contestId contestId
     * @param status status
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateContestStatusUsingPost(
        contestId: number,
        status: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/contest/status/update',
            query: {
                'contestId': contestId,
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
     * 分页获取比赛所有提交记录
     * @param contestId contestId
     * @param current current
     * @param language language
     * @param questionId questionId
     * @param size size
     * @param status status
     * @returns BaseResponse_Page_ContestSubmission_ OK
     * @throws ApiError
     */
    public static getAllContestSubmissionsUsingGet(
        contestId: number,
        current: number = 1,
        language?: string,
        questionId?: number,
        size: number = 20,
        status?: number,
    ): CancelablePromise<BaseResponse_Page_ContestSubmission_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/submit/all/{contestId}',
            path: {
                'contestId': contestId,
            },
            query: {
                'current': current,
                'language': language,
                'questionId': questionId,
                'size': size,
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
     * 获取用户最佳提交
     * @param contestId contestId
     * @param questionId questionId
     * @returns BaseResponse_ContestSubmission_ OK
     * @throws ApiError
     */
    public static getUserBestSubmissionUsingGet(
        contestId: number,
        questionId: number,
    ): CancelablePromise<BaseResponse_ContestSubmission_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/submit/best/{contestId}/{questionId}',
            path: {
                'contestId': contestId,
                'questionId': questionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取比赛所有提交记录
     * @param contestId contestId
     * @returns BaseResponse_List_ContestSubmission_ OK
     * @throws ApiError
     */
    public static getContestSubmissionsUsingGet(
        contestId: number,
    ): CancelablePromise<BaseResponse_List_ContestSubmission_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/submit/contest/{contestId}',
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
     * 获取提交详情
     * @param submissionId submissionId
     * @returns BaseResponse_ContestSubmission_ OK
     * @throws ApiError
     */
    public static getSubmissionDetailUsingGet(
        submissionId: number,
    ): CancelablePromise<BaseResponse_ContestSubmission_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/submit/detail/{submissionId}',
            path: {
                'submissionId': submissionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 提交比赛题目
     * @param contestId contestId
     * @param submitRequest submitRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static submitContestQuestionUsingPost(
        contestId: number,
        submitRequest: QuestionSubmitAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/contest/submit/do',
            query: {
                'contestId': contestId,
            },
            body: submitRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取当前登录用户在比赛中的提交记录（分页）
     * @param contestId contestId
     * @param current current
     * @param questionId questionId
     * @param size size
     * @returns BaseResponse_Page_ContestSubmission_ OK
     * @throws ApiError
     */
    public static getMySubmissionsUsingGet(
        contestId: number,
        current: number = 1,
        questionId?: number,
        size: number = 10,
    ): CancelablePromise<BaseResponse_Page_ContestSubmission_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/submit/my/{contestId}',
            path: {
                'contestId': contestId,
            },
            query: {
                'current': current,
                'questionId': questionId,
                'size': size,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取题目提交记录
     * @param contestId contestId
     * @param questionId questionId
     * @returns BaseResponse_List_ContestSubmission_ OK
     * @throws ApiError
     */
    public static getQuestionSubmissionsUsingGet(
        contestId: number,
        questionId: number,
    ): CancelablePromise<BaseResponse_List_ContestSubmission_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/submit/question/{contestId}/{questionId}',
            path: {
                'contestId': contestId,
                'questionId': questionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取比赛提交统计
     * @param contestId contestId
     * @returns BaseResponse_int_ OK
     * @throws ApiError
     */
    public static getSubmissionStatsUsingGet(
        contestId: number,
    ): CancelablePromise<BaseResponse_int_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/submit/stats/{contestId}',
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
     * 获取用户提交统计
     * @param contestId contestId
     * @returns BaseResponse_int_ OK
     * @throws ApiError
     */
    public static getUserSubmissionStatsUsingGet(
        contestId: number,
    ): CancelablePromise<BaseResponse_int_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/submit/user-stats/{contestId}',
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
     * 获取用户在比赛中的提交记录
     * @param contestId contestId
     * @returns BaseResponse_List_ContestSubmission_ OK
     * @throws ApiError
     */
    public static getUserSubmissionsUsingGet(
        contestId: number,
    ): CancelablePromise<BaseResponse_List_ContestSubmission_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/submit/user/{contestId}',
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
     * 获取即将开始的比赛列表
     * @param hours hours
     * @returns BaseResponse_List_ContestVO_ OK
     * @throws ApiError
     */
    public static getUpcomingContestsUsingGet(
        hours: number = 24,
    ): CancelablePromise<BaseResponse_List_ContestVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/upcoming/list',
            query: {
                'hours': hours,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 更新比赛
     * @param contestUpdateRequest contestUpdateRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateContestUsingPost(
        contestUpdateRequest: ContestUpdateRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/contest/update',
            body: contestUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 检查是否可以开始虚拟参赛
     * @param contestId contestId
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static canStartVirtualParticipationUsingGet(
        contestId: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/virtual/can-start/{contestId}',
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
     * 获取比赛虚拟参赛人数
     * @param contestId contestId
     * @returns BaseResponse_int_ OK
     * @throws ApiError
     */
    public static getVirtualParticipantCountUsingGet1(
        contestId: number,
    ): CancelablePromise<BaseResponse_int_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/virtual/count/{contestId}',
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
     * 获取虚拟参赛详情
     * @param contestId contestId
     * @returns BaseResponse_VirtualParticipationVO_ OK
     * @throws ApiError
     */
    public static getVirtualParticipationDetailUsingGet(
        contestId: number,
    ): CancelablePromise<BaseResponse_VirtualParticipationVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/virtual/detail/{contestId}',
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
     * 结束虚拟参赛
     * @param contestId contestId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static endVirtualParticipationUsingPost(
        contestId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/contest/virtual/end/{contestId}',
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
     * 获取虚拟参赛列表
     * @param contestId contestId
     * @returns BaseResponse_List_VirtualParticipationVO_ OK
     * @throws ApiError
     */
    public static getVirtualParticipationListUsingGet(
        contestId: number,
    ): CancelablePromise<BaseResponse_List_VirtualParticipationVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/virtual/list/{contestId}',
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
     * 获取我的虚拟参赛列表
     * @returns BaseResponse_List_VirtualParticipationVO_ OK
     * @throws ApiError
     */
    public static getMyVirtualParticipationsUsingGet(): CancelablePromise<BaseResponse_List_VirtualParticipationVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/virtual/my/list',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 开始虚拟参赛
     * @param contestId contestId
     * @returns BaseResponse_VirtualParticipationVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static startVirtualParticipationUsingPost(
        contestId: number,
    ): CancelablePromise<BaseResponse_VirtualParticipationVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/contest/virtual/start/{contestId}',
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
     * 检查虚拟参赛状态
     * @param contestId contestId
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static checkVirtualParticipationStatusUsingGet(
        contestId: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/virtual/status/{contestId}',
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
     * 获取用户虚拟参赛次数
     * @param userId userId
     * @returns BaseResponse_int_ OK
     * @throws ApiError
     */
    public static getUserVirtualParticipationCountUsingGet(
        userId: number,
    ): CancelablePromise<BaseResponse_int_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/virtual/user-count/{userId}',
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
     * 获取比赛单个题目详情
     * @param contestId contestId
     * @param questionId questionId
     * @returns BaseResponse_ContestQuestionVO_ OK
     * @throws ApiError
     */
    public static getContestQuestionUsingGet(
        contestId: number,
        questionId: number,
    ): CancelablePromise<BaseResponse_ContestQuestionVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/{contestId}/question/{questionId}',
            path: {
                'contestId': contestId,
                'questionId': questionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取比赛题目列表
     * @param contestId contestId
     * @returns BaseResponse_List_ContestQuestionVO_ OK
     * @throws ApiError
     */
    public static getContestQuestionsUsingGet(
        contestId: number,
    ): CancelablePromise<BaseResponse_List_ContestQuestionVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/{contestId}/questions',
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
     * 管理员获取比赛题目列表
     * @param contestId contestId
     * @returns BaseResponse_List_ContestQuestionVO_ OK
     * @throws ApiError
     */
    public static getContestQuestionsForAdminUsingGet(
        contestId: number,
    ): CancelablePromise<BaseResponse_List_ContestQuestionVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/{contestId}/questions/admin',
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
     * 获取比赛题目数量
     * @param contestId contestId
     * @returns BaseResponse_int_ OK
     * @throws ApiError
     */
    public static getContestQuestionCountUsingGet(
        contestId: number,
    ): CancelablePromise<BaseResponse_int_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contest/{contestId}/questions/count',
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
     * 获取临时文件访问链接
     * @param key key
     * @returns BaseResponse_string_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static getTempAccessUsingPost(
        key?: string,
    ): CancelablePromise<BaseResponse_string_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/file/tmp',
            query: {
                'key': key,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 上传文件
     * @param file file
     * @returns BaseResponse_string_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static uploadUsingPost(
        file: Blob,
    ): CancelablePromise<BaseResponse_string_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/file/upload',
            formData: {
                'file': file,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取权限操作列表
     * @param moduleCode moduleCode
     * @returns BaseResponse_List_PermissionActionVO_ OK
     * @throws ApiError
     */
    public static getActionListUsingGet(
        moduleCode?: string,
    ): CancelablePromise<BaseResponse_List_PermissionActionVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/permission/action/list',
            query: {
                'moduleCode': moduleCode,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 清理指定类型权限缓存
     * @param type 缓存类型
     * @returns BaseResponse_string_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static clearPermissionCacheUsingPost(
        type: 'user' | 'role' | 'resource' | 'all',
    ): CancelablePromise<BaseResponse_string_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/permission/cache/clear/{type}',
            path: {
                'type': type,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取单个缓存详情
     * @param cacheKey 缓存键
     * @returns BaseResponse_Map_string_object_ OK
     * @throws ApiError
     */
    public static getCacheDetailUsingGet(
        cacheKey: string,
    ): CancelablePromise<BaseResponse_Map_string_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/permission/cache/detail',
            query: {
                'cacheKey': cacheKey,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 清理单个缓存
     * @param cacheKey 缓存键
     * @returns BaseResponse_string_ OK
     * @throws ApiError
     */
    public static clearSingleCacheUsingDelete(
        cacheKey: string,
    ): CancelablePromise<BaseResponse_string_> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/permission/cache/single',
            query: {
                'cacheKey': cacheKey,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * 获取权限缓存统计信息
     * @returns BaseResponse_Map_string_object_ OK
     * @throws ApiError
     */
    public static getCacheStatsUsingGet(): CancelablePromise<BaseResponse_Map_string_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/permission/cache/stats',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 权限缓存预热
     * @returns BaseResponse_string_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static warmUpCacheUsingPost(): CancelablePromise<BaseResponse_string_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/permission/cache/warmup',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 检查用户权限
     * @param request request
     * @returns BaseResponse_PermissionCheckResultVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static checkUserPermissionUsingPost(
        request: PermissionCheckRequest,
    ): CancelablePromise<BaseResponse_PermissionCheckResultVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/permission/check',
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 导出操作日志
     * @param current
     * @param endTime
     * @param operationResult
     * @param operationType
     * @param operatorId
     * @param operatorName
     * @param pageSize
     * @param sortField
     * @param sortOrder
     * @param startTime
     * @param targetType
     * @param format format
     * @returns BaseResponse_string_ OK
     * @throws ApiError
     */
    public static exportOperationLogsUsingGet(
        current?: number,
        endTime?: string,
        operationResult?: number,
        operationType?: string,
        operatorId?: number,
        operatorName?: string,
        pageSize?: number,
        sortField?: string,
        sortOrder?: string,
        startTime?: string,
        targetType?: string,
        format: string = 'excel',
    ): CancelablePromise<BaseResponse_string_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/permission/log/export',
            query: {
                'current': current,
                'endTime': endTime,
                'operationResult': operationResult,
                'operationType': operationType,
                'operatorId': operatorId,
                'operatorName': operatorName,
                'pageSize': pageSize,
                'sortField': sortField,
                'sortOrder': sortOrder,
                'startTime': startTime,
                'targetType': targetType,
                'format': format,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取操作日志列表
     * @param current
     * @param endTime
     * @param operationResult
     * @param operationType
     * @param operatorId
     * @param operatorName
     * @param pageSize
     * @param sortField
     * @param sortOrder
     * @param startTime
     * @param targetType
     * @returns BaseResponse_Map_string_object_ OK
     * @throws ApiError
     */
    public static getOperationLogListUsingGet(
        current?: number,
        endTime?: string,
        operationResult?: number,
        operationType?: string,
        operatorId?: number,
        operatorName?: string,
        pageSize?: number,
        sortField?: string,
        sortOrder?: string,
        startTime?: string,
        targetType?: string,
    ): CancelablePromise<BaseResponse_Map_string_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/permission/log/list',
            query: {
                'current': current,
                'endTime': endTime,
                'operationResult': operationResult,
                'operationType': operationType,
                'operatorId': operatorId,
                'operatorName': operatorName,
                'pageSize': pageSize,
                'sortField': sortField,
                'sortOrder': sortOrder,
                'startTime': startTime,
                'targetType': targetType,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取权限模块列表
     * @returns BaseResponse_List_PermissionModuleVO_ OK
     * @throws ApiError
     */
    public static getModuleListUsingGet(): CancelablePromise<BaseResponse_List_PermissionModuleVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/permission/module/list',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 创建角色
     * @param request request
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static createRoleUsingPost(
        request: RoleAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/permission/role',
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取角色列表
     * @returns BaseResponse_List_RoleManagementVO_ OK
     * @throws ApiError
     */
    public static getRoleListUsingGet(): CancelablePromise<BaseResponse_List_RoleManagementVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/permission/role/list',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 修改角色
     * @param roleId 角色ID
     * @param request request
     * @returns BaseResponse_string_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateRoleUsingPut(
        roleId: number,
        request: RoleUpdateRequest,
    ): CancelablePromise<BaseResponse_string_ | any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/permission/role/{roleId}',
            path: {
                'roleId': roleId,
            },
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 删除角色
     * @param roleId 角色ID
     * @returns BaseResponse_string_ OK
     * @throws ApiError
     */
    public static deleteRoleUsingDelete(
        roleId: number,
    ): CancelablePromise<BaseResponse_string_> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/permission/role/{roleId}',
            path: {
                'roleId': roleId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * 获取指定角色的权限操作列表
     * @param roleId 角色ID
     * @returns BaseResponse_List_PermissionActionVO_ OK
     * @throws ApiError
     */
    public static getRoleActionsUsingGet(
        roleId: number,
    ): CancelablePromise<BaseResponse_List_PermissionActionVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/permission/role/{roleId}/actions',
            path: {
                'roleId': roleId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 配置角色权限
     * @param roleId 角色ID
     * @param request request
     * @returns BaseResponse_string_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static configureRolePermissionsUsingPost(
        roleId: number,
        request: RolePermissionConfigRequest,
    ): CancelablePromise<BaseResponse_string_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/permission/role/{roleId}/actions',
            path: {
                'roleId': roleId,
            },
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 批量修改用户角色
     * @param request request
     * @returns BaseResponse_string_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static batchUpdateUserRolesUsingPost(
        request: BatchRoleUpdateRequest,
    ): CancelablePromise<BaseResponse_string_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/permission/user/batch-role',
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取用户权限列表
     * @param current
     * @param pageSize
     * @param roleCode
     * @param sortField
     * @param sortOrder
     * @param userAccount
     * @param userName
     * @returns BaseResponse_Map_string_object_ OK
     * @throws ApiError
     */
    public static getUserPermissionListUsingGet(
        current?: number,
        pageSize?: number,
        roleCode?: string,
        sortField?: string,
        sortOrder?: string,
        userAccount?: string,
        userName?: string,
    ): CancelablePromise<BaseResponse_Map_string_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/permission/user/list',
            query: {
                'current': current,
                'pageSize': pageSize,
                'roleCode': roleCode,
                'sortField': sortField,
                'sortOrder': sortOrder,
                'userAccount': userAccount,
                'userName': userName,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取用户权限信息
     * @param userId 用户ID
     * @returns BaseResponse_UserPermissionVO_ OK
     * @throws ApiError
     */
    public static getUserPermissionsUsingGet(
        userId: number,
    ): CancelablePromise<BaseResponse_UserPermissionVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/permission/user/{userId}',
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
     * 修改用户角色
     * @param userId 用户ID
     * @param request request
     * @returns BaseResponse_string_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateUserRoleUsingPut(
        userId: number,
        request: UserRoleUpdateRequest,
    ): CancelablePromise<BaseResponse_string_ | any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/permission/user/{userId}/role',
            path: {
                'userId': userId,
            },
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 新增帖子
     * @param postAddRequest postAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addPostUsingPost(
        postAddRequest: PostAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post/add',
            body: postAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 新增帖子评论
     * @param postCommentAddRequest postCommentAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addCommentUsingPost(
        postCommentAddRequest: PostCommentAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post/addComment',
            body: postCommentAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 删除帖子
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deletePostUsingPost(
        deleteRequest: DeleteRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 删除帖子评论
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteCommentUsingPost(
        deleteRequest: DeleteRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post/deleteComment',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 编辑帖子
     * @param postEditRequest postEditRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static editPostUsingPost(
        postEditRequest: PostEditRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post/edit',
            body: postEditRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 根据id获取帖子
     * @param id id
     * @returns BaseResponse_PostVO_ OK
     * @throws ApiError
     */
    public static getPostVoByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_PostVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/post/get/vo',
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
     * 获取所有帖子
     * @returns BaseResponse_List_Post_ OK
     * @throws ApiError
     */
    public static getAllUsingGet(): CancelablePromise<BaseResponse_List_Post_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/post/getAll',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 根据标题或者帖子内容模糊查询
     * @param titleOrContent titleOrContent
     * @returns BaseResponse_List_Post_ OK
     * @throws ApiError
     */
    public static getByTitleOrContentUsingGet1(
        titleOrContent?: string,
    ): CancelablePromise<BaseResponse_List_Post_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/post/getByTitleOrContent',
            query: {
                'titleOrContent': titleOrContent,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取帖子评论
     * @param postId postId
     * @returns BaseResponse_List_PostCommentVO_ OK
     * @throws ApiError
     */
    public static getCommentUsingGet(
        postId?: number,
    ): CancelablePromise<BaseResponse_List_PostCommentVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/post/getComment',
            query: {
                'postId': postId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 分页获取帖子列表
     * @param postQueryRequest postQueryRequest
     * @returns BaseResponse_Page_PostVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listPostVoByPageUsingPost(
        postQueryRequest: PostQueryRequest,
    ): CancelablePromise<BaseResponse_Page_PostVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post/list/page/vo',
            body: postQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 分页获取当前用户创建的帖子列表
     * @param postQueryRequest postQueryRequest
     * @returns BaseResponse_Page_PostVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listMyPostVoByPageUsingPost(
        postQueryRequest: PostQueryRequest,
    ): CancelablePromise<BaseResponse_Page_PostVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post/my/list/page/vo',
            body: postQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 分页搜索帖子(ES查询)
     * @param postQueryRequest postQueryRequest
     * @returns BaseResponse_Page_PostVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static searchPostVoByPageUsingPost(
        postQueryRequest: PostQueryRequest,
    ): CancelablePromise<BaseResponse_Page_PostVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post/search/page/vo',
            body: postQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 更新帖子(仅管理员)
     * @param postUpdateRequest postUpdateRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updatePostUsingPost(
        postUpdateRequest: PostUpdateRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post/update',
            body: postUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 收藏 / 取消收藏
     * @param postFavourAddRequest postFavourAddRequest
     * @returns BaseResponse_int_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static doPostFavourUsingPost(
        postFavourAddRequest: PostFavourAddRequest,
    ): CancelablePromise<BaseResponse_int_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post_favour/',
            body: postFavourAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 检查是否已收藏
     * @param postId postId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static checkFavourUsingPost(
        postId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post_favour/check/{postId}',
            path: {
                'postId': postId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取用户收藏的帖子列表
     * @param postFavourQueryRequest postFavourQueryRequest
     * @returns BaseResponse_Page_PostVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listFavourPostByPageUsingPost(
        postFavourQueryRequest: PostFavourQueryRequest,
    ): CancelablePromise<BaseResponse_Page_PostVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post_favour/list/page',
            body: postFavourQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取我收藏的帖子列表
     * @param postQueryRequest postQueryRequest
     * @returns BaseResponse_Page_PostVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listMyFavourPostByPageUsingPost(
        postQueryRequest: PostQueryRequest,
    ): CancelablePromise<BaseResponse_Page_PostVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post_favour/my/list/page',
            body: postQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 点赞 / 取消点赞
     * @param postThumbAddRequest postThumbAddRequest
     * @returns BaseResponse_int_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static doThumbUsingPost(
        postThumbAddRequest: PostThumbAddRequest,
    ): CancelablePromise<BaseResponse_int_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post_thumb/',
            body: postThumbAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 检查是否已点赞
     * @param postId postId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static checkThumbUsingPost(
        postId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post_thumb/check/{postId}',
            path: {
                'postId': postId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * addProblemSet
     * @param addRequest addRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addProblemSetUsingPost(
        addRequest: ProblemSetAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/problemSet/add',
            body: addRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * addQuestionToSet
     * @param questionId questionId
     * @param setId setId
     * @param sortOrder sortOrder
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addQuestionToSetUsingPost(
        questionId: number,
        setId: number,
        sortOrder: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/problemSet/addQuestion',
            query: {
                'questionId': questionId,
                'setId': setId,
                'sortOrder': sortOrder,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deleteProblemSet
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteProblemSetUsingPost(
        id: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/problemSet/delete',
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
     * getProblemSetVO
     * @param id id
     * @returns BaseResponse_ProblemSetVO_ OK
     * @throws ApiError
     */
    public static getProblemSetVoUsingGet(
        id: number,
    ): CancelablePromise<BaseResponse_ProblemSetVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/problemSet/get',
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
     * listAllQuestionSetVO
     * @param queryRequest queryRequest
     * @returns BaseResponse_List_ProblemSetVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listAllQuestionSetVoUsingPost(
        queryRequest: ProblemSetQueryRequest,
    ): CancelablePromise<BaseResponse_List_ProblemSetVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/problemSet/list/all/vo',
            body: queryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listProblemSetVOByPage
     * @param queryRequest queryRequest
     * @returns BaseResponse_Page_ProblemSetVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listProblemSetVoByPageUsingPost(
        queryRequest: ProblemSetQueryRequest,
    ): CancelablePromise<BaseResponse_Page_ProblemSetVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/problemSet/list/page/vo',
            body: queryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getQuestionListForPractice
     * @param setId setId
     * @returns BaseResponse_List_QuestionVO_ OK
     * @throws ApiError
     */
    public static getQuestionListForPracticeUsingGet(
        setId: number,
    ): CancelablePromise<BaseResponse_List_QuestionVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/problemSet/practice',
            query: {
                'setId': setId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getUserProgressStat
     * @param setId setId
     * @returns BaseResponse_ProblemSetProgressStat_ OK
     * @throws ApiError
     */
    public static getUserProgressStatUsingGet(
        setId: number,
    ): CancelablePromise<BaseResponse_ProblemSetProgressStat_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/problemSet/progress/stat',
            query: {
                'setId': setId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * removeQuestionFromSet
     * @param questionId questionId
     * @param setId setId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static removeQuestionFromSetUsingPost(
        questionId: number,
        setId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/problemSet/removeQuestion',
            query: {
                'questionId': questionId,
                'setId': setId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateProblemSet
     * @param updateRequest updateRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateProblemSetUsingPost(
        updateRequest: ProblemSetUpdateRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/problemSet/update',
            body: updateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateQuestionOrder
     * @param newOrder newOrder
     * @param questionId questionId
     * @param setId setId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateQuestionOrderUsingPost(
        newOrder: number,
        questionId: number,
        setId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/problemSet/updateQuestionOrder',
            query: {
                'newOrder': newOrder,
                'questionId': questionId,
                'setId': setId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 新增题目
     * @param questionAddRequest questionAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addQuestionUsingPost(
        questionAddRequest: QuestionAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/add',
            body: questionAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 新增题目评论
     * @param questionCommentAddRequest questionCommentAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addQuestionCommentUsingPost(
        questionCommentAddRequest: QuestionCommentAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/addQuestionComment',
            body: questionCommentAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 新增用户已经解决的题目
     * @param questionSolve questionSolve
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static createQuestionSolveUsingPost(
        questionSolve: QuestionSolve,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/createQuestionSolve',
            body: questionSolve,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 删除题目
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteQuestionUsingPost(
        deleteRequest: DeleteRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * @deprecated
     * 编辑题目（用户）
     * @param questionEditRequest questionEditRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static editQuestionUsingPost(
        questionEditRequest: QuestionEditRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/edit',
            body: questionEditRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 根据id获取题目详情
     * @param id id
     * @returns BaseResponse_Question_ OK
     * @throws ApiError
     */
    public static getQuestionByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_Question_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/get',
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
     * 获取用户个人数据
     * @param questionId questionId
     * @returns BaseResponse_Question_ OK
     * @throws ApiError
     */
    public static getQuestionByIdUsingGet1(
        questionId?: number,
    ): CancelablePromise<BaseResponse_Question_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/get/id',
            query: {
                'questionId': questionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 根据id获取题目详情(脱敏)
     * @param id id
     * @returns BaseResponse_QuestionVO_ OK
     * @throws ApiError
     */
    public static getQuestionVoByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_QuestionVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/get/vo',
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
     * 获取所有题目
     * @returns BaseResponse_List_Question_ OK
     * @throws ApiError
     */
    public static getAllUsingGet1(): CancelablePromise<BaseResponse_List_Question_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/getAll',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 根据标题或者题目内容模糊查询
     * @param titleOrContent titleOrContent
     * @returns BaseResponse_List_Question_ OK
     * @throws ApiError
     */
    public static getByTitleOrContentUsingGet2(
        titleOrContent?: string,
    ): CancelablePromise<BaseResponse_List_Question_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/getByTitleOrContent',
            query: {
                'titleOrContent': titleOrContent,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取题目答案
     * @param questionId questionId
     * @returns BaseResponse_string_ OK
     * @throws ApiError
     */
    public static getQuestionAnswerUsingGet(
        questionId?: number,
    ): CancelablePromise<BaseResponse_string_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/getQuestionAnswer',
            query: {
                'questionId': questionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取题目评论
     * @param questionId questionId
     * @returns BaseResponse_List_QuestionCommentVO_ OK
     * @throws ApiError
     */
    public static getQuestionCommentUsingGet(
        questionId?: number,
    ): CancelablePromise<BaseResponse_List_QuestionCommentVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/getQuestionComment',
            query: {
                'questionId': questionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取用户已经解决的题目
     * @returns BaseResponse_List_QuestionSolve_ OK
     * @throws ApiError
     */
    public static getQuestionSolveUsingGet(): CancelablePromise<BaseResponse_List_QuestionSolve_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/getQuestionSolve',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 分页获取题目列表（仅管理员）
     * @param questionQueryRequest questionQueryRequest
     * @returns BaseResponse_Page_Question_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listQuestionByPageUsingPost(
        questionQueryRequest: QuestionQueryRequest,
    ): CancelablePromise<BaseResponse_Page_Question_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/list/page',
            body: questionQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 分页获取题目列表
     * @param questionQueryRequest questionQueryRequest
     * @returns BaseResponse_Page_QuestionVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listQuestionVoByPageUsingPost(
        questionQueryRequest: QuestionQueryRequest,
    ): CancelablePromise<BaseResponse_Page_QuestionVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/list/page/vo',
            body: questionQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取当前用户题目列表
     * @param questionQueryRequest questionQueryRequest
     * @returns BaseResponse_Page_QuestionVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listMyQuestionVoByPageUsingPost(
        questionQueryRequest: QuestionQueryRequest,
    ): CancelablePromise<BaseResponse_Page_QuestionVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/my/list/page/vo',
            body: questionQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 提交题目
     * @param questionSubmitAddRequest questionSubmitAddRequest
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static doQuestionSubmitUsingPost(
        questionSubmitAddRequest: QuestionSubmitAddRequest,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_submit/do',
            body: questionSubmitAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取用户题目提交数据
     * @param questionSubmitId questionSubmitId
     * @returns BaseResponse_QuestionSubmit_ OK
     * @throws ApiError
     */
    public static getQuestionSubmitByIdUsingGet(
        questionSubmitId?: number,
    ): CancelablePromise<BaseResponse_QuestionSubmit_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/question_submit/get/id',
            query: {
                'questionSubmitId': questionSubmitId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 分页获取题目提交列表
     * @param questionSubmitQueryRequest questionSubmitQueryRequest
     * @returns BaseResponse_Page_QuestionSubmitVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listQuestionSubmitByPageUsingPost(
        questionSubmitQueryRequest: QuestionSubmitQueryRequest,
    ): CancelablePromise<BaseResponse_Page_QuestionSubmitVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_submit/list/page',
            body: questionSubmitQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 运行题目自测
     * @param questionRunRequest questionRunRequest
     * @returns BaseResponse_QuestionRunResultVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static runQuestionSubmitUsingPost(
        questionRunRequest: QuestionRunRequest,
    ): CancelablePromise<BaseResponse_QuestionRunResultVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_submit/run',
            body: questionRunRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 更新题目通过率
     * @param questionId questionId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateQuestionByIdUsingPost(
        questionId?: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_submit/updateAccepted',
            query: {
                'questionId': questionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 更新题目
     * @param questionUpdateRequest questionUpdateRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateQuestionUsingPost(
        questionUpdateRequest: QuestionUpdateRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/update',
            body: questionUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取比赛积分历史
     * @param contestId contestId
     * @returns BaseResponse_List_UserRatingHistoryVO_ OK
     * @throws ApiError
     */
    public static getContestRatingHistoryUsingGet(
        contestId: number,
    ): CancelablePromise<BaseResponse_List_UserRatingHistoryVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/rating/contest-history/{contestId}',
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
     * 删除比赛积分记录
     * @param contestId contestId
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static deleteContestRatingUsingDelete(
        contestId: number,
    ): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/rating/contest/{contestId}',
            path: {
                'contestId': contestId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * 获取用户积分历史
     * @param userId userId
     * @returns BaseResponse_List_UserRatingHistoryVO_ OK
     * @throws ApiError
     */
    public static getRatingHistoryUsingGet(
        userId: number,
    ): CancelablePromise<BaseResponse_List_UserRatingHistoryVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/rating/history/{userId}',
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
     * 获取积分排行榜
     * @param page page
     * @param size size
     * @returns BaseResponse_List_UserRatingVO_ OK
     * @throws ApiError
     */
    public static getRatingLeaderboardUsingGet(
        page: number = 1,
        size: number = 50,
    ): CancelablePromise<BaseResponse_List_UserRatingVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/rating/leaderboard',
            query: {
                'page': page,
                'size': size,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取我的积分
     * @returns BaseResponse_UserRatingVO_ OK
     * @throws ApiError
     */
    public static getMyRatingUsingGet(): CancelablePromise<BaseResponse_UserRatingVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/rating/my',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取我的积分历史
     * @returns BaseResponse_List_UserRatingHistoryVO_ OK
     * @throws ApiError
     */
    public static getMyRatingHistoryUsingGet(): CancelablePromise<BaseResponse_List_UserRatingHistoryVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/rating/my-history',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取我的积分排名
     * @returns BaseResponse_int_ OK
     * @throws ApiError
     */
    public static getMyRatingRankUsingGet(): CancelablePromise<BaseResponse_int_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/rating/my-rank',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取我最近的积分变化
     * @param limit limit
     * @returns BaseResponse_List_UserRatingHistoryVO_ OK
     * @throws ApiError
     */
    public static getMyRecentRatingChangesUsingGet(
        limit: number = 10,
    ): CancelablePromise<BaseResponse_List_UserRatingHistoryVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/rating/my-recent',
            query: {
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
     * 获取我的积分统计
     * @returns BaseResponse_Map_string_object_ OK
     * @throws ApiError
     */
    public static getMyRatingStatsUsingGet(): CancelablePromise<BaseResponse_Map_string_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/rating/my-stats',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取用户积分排名
     * @param userId userId
     * @returns BaseResponse_int_ OK
     * @throws ApiError
     */
    public static getUserRatingRankUsingGet(
        userId: number,
    ): CancelablePromise<BaseResponse_int_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/rating/rank/{userId}',
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
     * 重新计算比赛积分
     * @param contestId contestId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static recalculateRatingUsingPost(
        contestId: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/rating/recalculate/{contestId}',
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
     * 获取用户最近的积分变化
     * @param userId userId
     * @param limit limit
     * @returns BaseResponse_List_UserRatingHistoryVO_ OK
     * @throws ApiError
     */
    public static getRecentRatingChangesUsingGet(
        userId: number,
        limit: number = 10,
    ): CancelablePromise<BaseResponse_List_UserRatingHistoryVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/rating/recent/{userId}',
            path: {
                'userId': userId,
            },
            query: {
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
     * 获取积分统计信息
     * @returns BaseResponse_Map_string_object_ OK
     * @throws ApiError
     */
    public static getRatingStatsUsingGet(): CancelablePromise<BaseResponse_Map_string_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/rating/stats',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取用户积分统计
     * @param userId userId
     * @returns BaseResponse_Map_string_object_ OK
     * @throws ApiError
     */
    public static getUserRatingStatsUsingGet(
        userId: number,
    ): CancelablePromise<BaseResponse_Map_string_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/rating/user-stats/{userId}',
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
     * 获取用户积分
     * @param userId userId
     * @returns BaseResponse_UserRatingVO_ OK
     * @throws ApiError
     */
    public static getUserRatingUsingGet(
        userId: number,
    ): CancelablePromise<BaseResponse_UserRatingVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/rating/user/{userId}',
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
     * 设置公众号菜单
     * @returns string OK
     * @throws ApiError
     */
    public static setMenuUsingGet(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/setMenu',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 创建用户 (仅管理员)
     * @param userAddRequest userAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addUserUsingPost(
        userAddRequest: UserAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/add',
            body: userAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 删除用户 (仅管理员)
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteUserUsingPost(
        deleteRequest: DeleteRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 忘记密码
     * @param userForgetPasswordRequest userForgetPasswordRequest
     * @returns BaseResponse_string_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static forgetPasswordUsingPost(
        userForgetPasswordRequest: UserForgetPasswordRequest,
    ): CancelablePromise<BaseResponse_string_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/forgetPassword',
            body: userForgetPasswordRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 根据 id 获取用户(仅管理员)
     * @param id id
     * @returns BaseResponse_User_ OK
     * @throws ApiError
     */
    public static getUserByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_User_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/get',
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
     * 获取当前登录用户
     * @returns BaseResponse_LoginUserVO_ OK
     * @throws ApiError
     */
    public static getLoginUserUsingGet(): CancelablePromise<BaseResponse_LoginUserVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/get/login',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 根据 id 获取用户(脱敏)
     * @param id id
     * @returns BaseResponse_UserVO_ OK
     * @throws ApiError
     */
    public static getUserVoByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse_UserVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/get/vo',
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
     * 获取个人数据
     * @returns BaseResponse_PersonalDataVO_ OK
     * @throws ApiError
     */
    public static getPersonalDataUsingGet(): CancelablePromise<BaseResponse_PersonalDataVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/getPersonalData',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 分页获取用户列表(仅管理员)
     * @param userQueryRequest userQueryRequest
     * @returns BaseResponse_Page_User_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listUserByPageUsingPost(
        userQueryRequest: UserQueryRequest,
    ): CancelablePromise<BaseResponse_Page_User_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/list/page',
            body: userQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 分页获取用户列表(脱敏)
     * @param userQueryRequest userQueryRequest
     * @returns BaseResponse_Page_UserVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listUserVoByPageUsingPost(
        userQueryRequest: UserQueryRequest,
    ): CancelablePromise<BaseResponse_Page_UserVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/list/page/vo',
            body: userQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 用户登录
     * @param userLoginRequest userLoginRequest
     * @returns BaseResponse_LoginUserVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static userLoginUsingPost(
        userLoginRequest: UserLoginRequest,
    ): CancelablePromise<BaseResponse_LoginUserVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/login',
            body: userLoginRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * @deprecated
     * 用户登录（微信开放平台
     * @param code code
     * @returns BaseResponse_LoginUserVO_ OK
     * @throws ApiError
     */
    public static userLoginByWxOpenUsingGet(
        code: string,
    ): CancelablePromise<BaseResponse_LoginUserVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/login/wx_open',
            query: {
                'code': code,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 邮箱登录
     * @param mailRequest mailRequest
     * @returns BaseResponse_LoginUserVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static loginByMailUsingPost(
        mailRequest: UserLoginByMailRequest,
    ): CancelablePromise<BaseResponse_LoginUserVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/loginByMail',
            body: mailRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 用户注销
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static userLogoutUsingPost(): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/logout',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 用户注册
     * @param userRegisterRequest userRegisterRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static userRegisterUsingPost(
        userRegisterRequest: UserRegisterRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/register',
            body: userRegisterRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 发送邮箱验证码
     * @param mail mail
     * @returns BaseResponse_string_ OK
     * @throws ApiError
     */
    public static sendMailCodeUsingGet(
        mail: string,
    ): CancelablePromise<BaseResponse_string_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/sendMailCode',
            query: {
                'mail': mail,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 更新用户 (仅管理员)
     * @param userUpdateRequest userUpdateRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateUserUsingPost(
        userUpdateRequest: UserUpdateRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/update',
            body: userUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 更新个人信息
     * @param userUpdateMyRequest userUpdateMyRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateMyUserUsingPost(
        userUpdateMyRequest: UserUpdateMyRequest,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/update/my',
            body: userUpdateMyRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
