/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_List_Question_ } from '../models/BaseResponse_List_Question_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_Question_ } from '../models/BaseResponse_Page_Question_';
import type { BaseResponse_Page_QuestionSubmitVO_ } from '../models/BaseResponse_Page_QuestionSubmitVO_';
import type { BaseResponse_Page_QuestionVO_ } from '../models/BaseResponse_Page_QuestionVO_';
import type { BaseResponse_Question_ } from '../models/BaseResponse_Question_';
import type { BaseResponse_QuestionRunResultVO_ } from '../models/BaseResponse_QuestionRunResultVO_';
import type { BaseResponse_QuestionSubmit_ } from '../models/BaseResponse_QuestionSubmit_';
import type { BaseResponse_QuestionVO_ } from '../models/BaseResponse_QuestionVO_';
import type { BaseResponse_string_ } from '../models/BaseResponse_string_';
import type { DeleteRequest } from '../models/DeleteRequest';
import type { QuestionAddRequest } from '../models/QuestionAddRequest';
import type { QuestionEditRequest } from '../models/QuestionEditRequest';
import type { QuestionQueryRequest } from '../models/QuestionQueryRequest';
import type { QuestionRunRequest } from '../models/QuestionRunRequest';
import type { QuestionSolve } from '../models/QuestionSolve';
import type { QuestionSubmitAddRequest } from '../models/QuestionSubmitAddRequest';
import type { QuestionSubmitQueryRequest } from '../models/QuestionSubmitQueryRequest';
import type { QuestionUpdateRequest } from '../models/QuestionUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class QuestionControllerService {
    /**
     * addQuestion
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
     * createQuestionSolve
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
     * deleteQuestion
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
     * editQuestion
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
     * getQuestionById
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
     * getQuestionById
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
     * getQuestionVOById
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
     * getAll
     * @returns BaseResponse_List_Question_ OK
     * @throws ApiError
     */
    public static getAllUsingGet2(): CancelablePromise<BaseResponse_List_Question_> {
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
     * getByTitleOrContent
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
     * listQuestionVOByPage
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
     * listMyQuestionVOByPage
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
     * doQuestionSubmit
     * @param questionSubmitAddRequest questionSubmitAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static doQuestionSubmitUsingPost(
        questionSubmitAddRequest: QuestionSubmitAddRequest,
    ): CancelablePromise<BaseResponse_long_ | any> {
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
     * getQuestionSubmitById
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
     * listQuestionSubmitByPage
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
     * runQuestionSubmit
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
     * updateQuestionById
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
     * updateQuestion
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
}
