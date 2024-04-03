<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">
      {{ formStatus ? "在线判题OJ系统" : "注册" }}
    </div>
    <div class="login-form-error-msg"></div>
    <a-form
        ref="loginFormRef"
        :model="userInfo"
        class="login-form"
        layout="vertical"
        @submit="handleSubmit"
    >
      <!--      用户名和密码登录-->
      <div v-if="formStatus && !isEmailLogin">
        <a-form-item
            field="userAccount"
            :rules="[{ required: true, message: '用户名不能为空' }]"
            :validate-trigger="['change', 'blur', 'input']"
            hide-label
        >
          <a-input v-model="userInfo.userAccount" placeholder="请输入用户名">
            <template #prefix>
              <icon-user/>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
            field="userPassword"
            :rules="[
            { required: true, message: '密码不能为空' },
            { minLength: 8, message: '密码不少于 8 位' },
          ]"
            :validate-trigger="['change', 'blur', 'input']"
            hide-label
        >
          <a-input-password
              v-model="userInfo.userPassword"
              placeholder="请输入密码"
              allow-clear
          >
            <template #prefix>
              <icon-lock/>
            </template>
          </a-input-password>
        </a-form-item>
      </div>
      <!--邮箱登录-->
      <div v-if="formStatus && isEmailLogin">
        <a-form-item
            field="email"
            :rules="[
            { required: true, message: '邮箱账号不能为空' },
            {
              type: 'email',
              message: '请输入正确的邮箱',
            },
          ]"
            :validate-trigger="['change', 'blur', 'input']"
            hide-label
        >
          <a-input v-model="userInfo.email" placeholder="请输入邮箱账号">
            <template #prefix>
              <icon-email/>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
            field="emailCode"
            :rules="[
            { required: true, message: '验证码不能为空' },
            { length: 6, message: '验证码为6位' },
          ]"
            :validate-trigger="['change', 'blur', 'input']"
            hide-label
        >
          <a-input-search
              v-model="userInfo.emailCode"
              placeholder="请输入验证码"
              allow-clear
              :button-text="captchaTextRender"
              search-button
              @search="handleSendCaptcha(userInfo.email)"
              :button-props="{ disabled: !isAllowCount }"
          >
            <template #prefix>
              <icon-lock/>
            </template>
          </a-input-search>
        </a-form-item>
      </div>
      <!--用户注册-->
      <div v-if="!formStatus">
        <a-form-item
            field="userAccount"
            :rules="[{ required: true, message: '用户名不能为空' }]"
            :validate-trigger="['change', 'blur', 'input']"
            hide-label
        >
          <a-input v-model="userInfo.userAccount" placeholder="请输入用户名">
            <template #prefix>
              <icon-user/>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
            field="userPassword"
            :rules="[
            { required: true, message: '密码不能为空' },
            { minLength: 8, message: '密码不少于 8 位' },
          ]"
            :validate-trigger="['change', 'blur', 'input']"
            hide-label
        >
          <a-input-password
              v-model="userInfo.userPassword"
              placeholder="请输入密码"
              allow-clear
          >
            <template #prefix>
              <icon-lock/>
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item
            field="checkPassword"
            :rules="[
            { required: true, message: '请再次输入密码' },
            { validator: validPassword, required: true },
          ]"
            :validate-trigger="['change', 'blur', 'input']"
            hide-label
        >
          <a-input-password
              v-model="userInfo.checkPassword"
              placeholder="请再次输入密码"
              allow-clear
          >
            <template #prefix>
              <icon-lock/>
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item
            field="email"
            :rules="[
            { required: true, message: '邮箱账号不能为空' },
            {
              type: 'email',
              message: '请输入正确的邮箱',
            },
          ]"
            :validate-trigger="['change', 'blur', 'input']"
            hide-label
        >
          <a-input v-model="userInfo.email" placeholder="请输入邮箱账号">
            <template #prefix>
              <icon-email/>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
            field="emailCode"
            :rules="[
            { required: true, message: '验证码不能为空' },
            { length: 6, message: '验证码为6位' },
          ]"
            :validate-trigger="['change', 'blur', 'input']"
            hide-label
        >
          <a-input-search
              v-model="userInfo.emailCode"
              placeholder="请输入验证码"
              allow-clear
              :button-text="captchaTextRender"
              search-button
              @search="handleSendCaptcha(userInfo.email)"
              :button-props="{ disabled: !isAllowCount }"
          >
            <template #prefix>
              <icon-lock/>
            </template>
          </a-input-search>
        </a-form-item>
      </div>
      <a-space :size="16" direction="vertical">
        <div v-if="formStatus" class="login-form-password-actions">
          <a-link @click="changeLoginMethod">
            {{ isEmailLogin ? "账号密码登录 " : "邮箱登录" }}
          </a-link>
          <a-link @click="openForgetPasswordModal">忘记密码?</a-link>
        </div>
        <a-button
            v-if="formStatus"
            type="primary"
            html-type="submit"
            long
            :loading="loading"
        >
          登录
        </a-button>
        <div v-if="!formStatus" class="login-form-password-actions">
          <a-link
              @click="
              formStatus = !formStatus;
              loginFormRef?.value?.resetFields();
            "
          >已有账号? 去登陆
          </a-link>
        </div>
        <a-button
            type="text"
            long
            class="login-form-register-btn"
            @click="registerEvent"
            :loading="loading"
        >
          注册账号
        </a-button>
      </a-space>
    </a-form>
    <!-- 忘记密码模态框 -->
    <a-modal v-model:visible="forgetPasswordModalVisible" :footer="false">
      <template #title>
        重置密码
      </template>
      <div>
        <a-form
            ref="forgetPasswordFormRef"
            :model="forgetPasswordForm"
            @submit="handleSubmitForgetPassword"
        >
          <a-form-item
              field="email"
              :rules="[
                { required: true, message: '邮箱账号不能为空' },
                { type: 'email', message: '请输入正确的邮箱' }
              ]"
              :validate-trigger="['change', 'blur', 'input']"
              hide-label
          >
            <a-input v-model="forgetPasswordForm.email" placeholder="请输入注册邮箱">
              <template #prefix>
                <icon-email/>
              </template>
            </a-input>
          </a-form-item>
          <a-form-item
              field="emailCode"
              :rules="[
                { required: true, message: '验证码不能为空' },
                { length: 6, message: '验证码为6位' }
              ]"
              :validate-trigger="['change', 'blur', 'input']"
              hide-label
          >
            <a-input-search
                v-model="forgetPasswordForm.emailCode"
                placeholder="请输入验证码"
                allow-clear
                :button-text="captchaTextRender"
                search-button
                @search="handleSendCaptcha(forgetPasswordForm.email)"
                :button-props="{ disabled: !isAllowCount }"
            >
              <template #prefix>
                <icon-lock/>
              </template>
            </a-input-search>
          </a-form-item>
          <a-form-item
              field="userPassword"
              :rules="[
                { required: true, message: '新密码不能为空' },
                { minLength: 8, message: '密码不少于 8 位' }
              ]"
              :validate-trigger="['change', 'blur', 'input']"
              hide-label
          >
            <a-input-password v-model="forgetPasswordForm.userPassword" placeholder="请输入新密码">
              <template #prefix>
                <icon-lock/>
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item
              field="checkPassword"
              :rules="[
                { required: true, message: '请再次输入密码' },
                { validator: validConfirmPassword, required: true }
              ]"
              :validate-trigger="['change', 'blur', 'input']"
              hide-label
          >
            <a-input-password v-model="forgetPasswordForm.checkPassword" placeholder="请再次输入密码">
              <template #prefix>
                <icon-lock/>
              </template>
            </a-input-password>
          </a-form-item>
          <div class="login-form-button">
            <a-form-item>
              <a-button type="primary" html-type="submit" long :loading="loading">提交</a-button>
            </a-form-item>
          </div>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import {ref, reactive, onMounted} from "vue";
import {useRouter} from "vue-router";
import {ValidatedError} from "@arco-design/web-vue/es/form/interface";
import {useStore} from "vuex";
import useLoading from "@/hooks/loading";
import message from "@arco-design/web-vue/es/message";
import {Service, UserControllerService} from "../../../generated";

const router = useRouter();
const errorMessage = ref("");
//表单状态、用于判断是登录功能还是注册功能
const formStatus = ref(true);
const {loading, setLoading} = useLoading();
const isEmailLogin = ref(false);
const store = useStore();
const captchaTextRender = ref("发送验证码");
const timer = ref(60); //倒计时
const isAllowCount = ref(true);
const loginFormRef = ref(null) as any;
const forgetPasswordModalVisible = ref(false);
const forgetPasswordForm = reactive({
  email: '',
  emailCode: '',
  userPassword: '',
  checkPassword: ''
});
const userInfo = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
  email: "",
  emailCode: "",
});

/**
 * 处理忘记密码
 */
const openForgetPasswordModal = () => {
  forgetPasswordModalVisible.value = true;
};

const handleSubmitForgetPassword = async () => {
  try {
    const {userPassword, checkPassword} = forgetPasswordForm;
    if (userPassword !== checkPassword) {
      message.error('两次输入的密码不一致');
      return;
    }
    // 发送请求到后端，处理忘记密码逻辑
    const res = await Service.forgetPasswordUsingPost(forgetPasswordForm);
    if (res.code === 200) {
      message.success('密码重置成功');
    }
    forgetPasswordModalVisible.value = false;
  } catch (error) {
    //console.error('忘记密码请求失败:', error);
    message.error('密码重置失败');
  }
};

/**
 * 处理发送邮箱验证码请求
 */
// const handleSendCaptcha = async () => {
//   loginFormRef?.value?.validateField(
//       "email",
//       async (errors: undefined | Record<string, ValidatedError>) => {
//         if (errors == void 0) {
//           //校验通过
//           if (isAllowCount.value) {
//             // 允许计时
//             const times = setInterval(() => {
//               if (timer.value === 0) {
//                 clearInterval(times);
//                 isAllowCount.value = true;
//                 timer.value = 60;
//                 captchaTextRender.value = "发送验证码";
//                 return;
//               } else {
//                 isAllowCount.value = false;
//                 timer.value--;
//                 captchaTextRender.value = timer.value + "后可重新发送";
//               }
//             }, 1000);
//             try {
//               const res = await UserControllerService.sendMailCodeUsingGet(
//                   userInfo.email
//               );
//               if (res.code === 200) {
//                 message.success("验证码发送成功");
//               }
//             } catch (e) {
//               message.error("发送失败，" + (e as Error).message);
//             }
//           }
//         }
//       }
//   );
// };

const handleSendCaptcha = async (email: string) => {

  if (!isValidEmail(email)) {
    // 邮箱格式不正确，进行错误处理
    message.error("邮箱格式不正确");
    return;
  }

  if (isAllowCount.value) {
    // 允许计时
    localStorage.setItem('captchaTimer', timer.value.toString());
    console.log(localStorage.key(0))
    const times = setInterval(() => {
      if (timer.value === 0) {
        clearInterval(times);
        localStorage.removeItem('captchaTimer'); // 清除本地存储中的倒计时时间
        isAllowCount.value = true;
        timer.value = 60;
        captchaTextRender.value = "发送验证码";
        return;
      } else {
        isAllowCount.value = false;
        timer.value--;
        localStorage.setItem('captchaTimer', timer.value.toString());
        captchaTextRender.value = timer.value + "后可重新发送";
      }
    }, 1000);
    try {
      const res = await UserControllerService.sendMailCodeUsingGet(email);
      if (res.code === 200) {
        message.success("验证码发送成功");
      }
    } catch (e) {
      message.error("发送失败，" + (e as Error).message);
    }
  }
};

onMounted(() => {
  // 在组件挂载时检查本地存储是否有倒计时的数据
  const savedTimer = parseInt(localStorage.getItem('captchaTimer') || '');
  if (savedTimer && !isNaN(savedTimer)) {
    timer.value = savedTimer;
  }
})

// 辅助函数，检查邮箱格式是否有效
function isValidEmail(email: string) {
  // 使用正则表达式检查邮箱格式
  const regex = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  console.log(regex.test(email));
  return regex.test(email);
}


/**
 * 登录：处理提交请求
 * @param errors
 * @param values
 */
const handleSubmit = async ({
                              errors,
                              values,
                            }: {
  errors: Record<string, ValidatedError> | undefined;
  values: Record<string, any>;
}) => {
  if (loading.value) return;
  if (!errors) {
    setLoading(true);
    let res;
    if (!isEmailLogin.value) {
      // 通过账号密码进行登录
      try {
        res = await Service.userLoginUsingPost(values);
      } catch (err) {
        //出现异常就return
        message.error("登陆失败，请重试");
        setLoading(false);
        return;
      }
    } else {
      // 通过邮箱进行登录
      try {
        const UserLoginByMailRequest = {
          email: values.email,
          emailCode: values.emailCode,
        };
        res = await UserControllerService.loginByMailUsingPost(
            UserLoginByMailRequest
        );
      } catch (e) {
        // 出现异常就return
        message.error("登陆失败，请重试");
        setLoading(false);
        return;
      }
    }
    // 登录成功，跳转到主页
    if (res.code === 200) {
      console.log(res)
      // 拿到请求路径中的重定向路径，如果有的话，就跳转到携带的路径上如果没有，就跳转到个人页面
      const toPath = router.currentRoute.value.fullPath.split("=");
      await store.dispatch("user/getLoginUser");

      // 跳转到首页
      await router.push({
        path: "/",
        replace: true,
      });
      message.success("登陆成功");
    } else {
      message.error("登陆失败，" + res.message);
    }
    setLoading(false);
  }
};

/**
 * 注册按钮点击事件
 */
const registerEvent = () => {
  if (formStatus.value) {
    //如果为真，表明当前为登录页面，需要切换到注册页面
    formStatus.value = false;
    loginFormRef?.value?.resetFields();
  } else {
    // 否则，进行注册操作
    loginFormRef?.value?.validate(
        async (errors: undefined | Record<string, ValidatedError>) => {
          if (errors == void 0) {
            setLoading(true);
            // 表单验证通过
            try {
              const res = await Service.userRegisterUsingPost(
                  userInfo
              );
              if (res.code === 200) {
                message.success("注册成功");
                loginFormRef?.value?.resetFields();
                formStatus.value = true;
              }
            } catch (e) {
              message.error("注册失败，" + (e as Error).message);
            } finally {
              setLoading(false);
            }
          }
        }
    );
  }
};

/**
 * 校验密码是否一致
 * @param value
 * @param callback
 */
const validPassword = (value: any, callback: any) => {
  if (value === "") {
    callback("请再次输入密码");
  } else if (value !== userInfo.userPassword) {
    callback("两次密码输入不一致");
  } else {
    callback();
  }
};

const validConfirmPassword = (value: any, callback: any) => {
  if (value === "") {
    callback("请再次输入密码");
  } else if (value !== forgetPasswordForm.userPassword) {
    callback("两次密码输入不一致");
  } else {
    callback();
  }
};

/**
 * 更换登录方式
 */
const changeLoginMethod = () => {
  isEmailLogin.value = !isEmailLogin.value;
  //重置表单数据
  loginFormRef?.value?.resetFields();
};
</script>

<style lang="less" scoped>

.login-form {
  width: 400px;
  text-align: center;
  justify-content: center;

  &-wrapper {
    width: 320px;
  }

  &-title {
    color: var(--color-text-1);
    font-weight: 700;
    font-size: 24px;
    line-height: 32px;
    align-items: center;
    text-align: left;
  }

  &-sub-title {
    color: var(--color-text-3);
    font-size: 16px;
    line-height: 24px;
  }

  &-error-msg {
    height: 32px;
    color: rgb(var(--red-6));
    line-height: 32px;
  }

  &-password-actions {
    display: flex;
    justify-content: space-between;
  }

  &-register-btn {
    color: var(--color-text-3) !important;
  }

  &-button {
    margin-top: 16px;
    display: flex;
    justify-content: center;
    text-align: center;
  }
}

</style>
