<template>
  <footer class="global-footer">
    <div class="footer-container">
      <!-- 主要内容区域 -->
      <div class="footer-content">
        <!-- 左侧信息 -->
        <div class="footer-section">
          <div class="footer-logo">
            <img src="../assets/oj-logow.png" alt="SOJ Logo" class="footer-logo-img" />
            <div class="footer-brand">
              <h3 class="brand-name">SOJ</h3>
              <p class="brand-desc">在线判题系统</p>
            </div>
          </div>
          <p class="footer-description">
            SOJ是一个专业的在线编程判题系统，致力于为编程学习者提供优质的练习平台。
            通过丰富的题目资源和智能的判题系统，帮助用户提升编程技能。
          </p>
          <div class="social-links">
            <a href="https://github.com" target="_blank" class="social-link" title="GitHub">
              <icon-github />
            </a>
            <a href="#" class="social-link" title="消息">
              <icon-message />
            </a>
            <a href="#" class="social-link" title="微信">
              <icon-wechat />
            </a>
            <a href="mailto:support@soj.com" class="social-link" title="邮箱">
              <icon-email />
            </a>
          </div>
        </div>

        <!-- 中间链接区域 -->
        <div class="footer-section">
          <h4 class="section-title">快速链接</h4>
          <ul class="footer-links">
            <li><a href="/questions" class="footer-link">题目列表</a></li>
            <li><a href="/problemsets" class="footer-link">题单管理</a></li>
            <li><a href="/posts" class="footer-link">讨论区</a></li>
            <li><a href="/workplace" class="footer-link">个人中心</a></li>
            <li><a href="/about" class="footer-link">关于我们</a></li>
          </ul>
        </div>

        <!-- 右侧联系信息 -->
        <div class="footer-section">
          <h4 class="section-title">联系我们</h4>
          <div class="contact-info">
            <div class="contact-item">
              <icon-location class="contact-icon" />
              <span>北京市海淀区中关村大街1号</span>
            </div>
            <div class="contact-item">
              <icon-phone class="contact-icon" />
              <span>400-123-4567</span>
            </div>
            <div class="contact-item">
              <icon-email class="contact-icon" />
              <span>support@soj.com</span>
            </div>
            <div class="contact-item">
              <icon-clock-circle class="contact-icon" />
              <span>周一至周日 9:00-18:00</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部版权信息 -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <div class="copyright">
            <p>&copy; 2024 SOJ 在线判题系统. 保留所有权利.</p>
            <p>
              <a href="/privacy" class="footer-link">隐私政策</a> | 
              <a href="/terms" class="footer-link">服务条款</a> | 
              <a href="/help" class="footer-link">帮助中心</a>
            </p>
          </div>
          <div class="footer-stats">
            <div class="stat-item">
              <span class="stat-number">10,000+</span>
              <span class="stat-label">注册用户</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">5,000+</span>
              <span class="stat-label">题目数量</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">99.9%</span>
              <span class="stat-label">系统可用性</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { 
  IconGithub, 
  IconMessage, 
  IconWechat, 
  IconEmail, 
  IconLocation, 
  IconPhone, 
  IconClockCircle 
} from '@arco-design/web-vue/es/icon';
</script>

<style lang="less" scoped>
.global-footer {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: #e2e8f0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.02)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    pointer-events: none;
  }
}

.footer-container {
  width: 100%;
  margin: 0;
  padding: 0 24px;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 48px;
  padding: 60px 0 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-section {
  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: white;
    margin: 0 0 24px 0;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 40px;
      height: 3px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 2px;
    }
  }
}

// Logo区域
.footer-logo {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.footer-logo-img {
  width: 48px;
  height: 48px;
  filter: brightness(0) invert(1);
}

.footer-brand {
  .brand-name {
    font-size: 24px;
    font-weight: 700;
    color: white;
    margin: 0 0 4px 0;
  }
  
  .brand-desc {
    font-size: 14px;
    color: #94a3b8;
    margin: 0;
  }
}

.footer-description {
  font-size: 14px;
  line-height: 1.6;
  color: #cbd5e1;
  margin-bottom: 24px;
}

// 社交链接
.social-links {
  display: flex;
  gap: 16px;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e2e8f0;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 18px;
  
  &:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
}

// 链接列表
.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-link {
  color: #cbd5e1;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    color: white;
    padding-left: 8px;
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 0;
    height: 2px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transition: width 0.3s ease;
    transform: translateY(-50%);
  }
  
  &:hover::before {
    width: 100%;
  }
}

// 联系信息
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #cbd5e1;
  
  .contact-icon {
    width: 20px;
    height: 20px;
    color: #667eea;
    flex-shrink: 0;
  }
}

// 底部版权区域
.footer-bottom {
  padding: 32px 0;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}

.copyright {
  p {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: #94a3b8;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.footer-stats {
  display: flex;
  gap: 32px;
}

.stat-item {
  text-align: center;
  
  .stat-number {
    display: block;
    font-size: 20px;
    font-weight: 700;
    color: white;
    margin-bottom: 4px;
  }
  
  .stat-label {
    font-size: 12px;
    color: #94a3b8;
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  
  .footer-section:first-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .footer-container {
    padding: 0 16px;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 40px 0 24px;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .footer-stats {
    gap: 24px;
  }
  
  .stat-item .stat-number {
    font-size: 18px;
  }
  
  .footer-logo {
    justify-content: center;
  }
  
  .social-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer-stats {
    flex-direction: column;
    gap: 16px;
  }
  
  .footer-logo {
    flex-direction: column;
    text-align: center;
  }
}
</style> 