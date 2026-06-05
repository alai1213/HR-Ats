export const STAGE_LABELS: Record<string, string> = {
  PENDING_SCREENING: '待筛选',
  RESUME_REVIEW: '简历评估',
  HR_INTERVIEW: 'HR初试',
  BUSINESS_INTERVIEW: '业务面',
  FINAL_INTERVIEW: '终面',
  OFFER_APPROVAL: 'Offer审批',
  OFFER_SENT: 'Offer发放',
  ONBOARDED: '已入职',
  RESUME_REJECTED: '简历淘汰',
  INTERVIEW_REJECTED: '面试淘汰',
  OFFER_REJECTED: 'Offer拒绝',
  ONBOARDING_ABANDONED: '入职放弃',
};

export const STAGE_GROUPS = {
  active: [
    'PENDING_SCREENING',
    'RESUME_REVIEW',
    'HR_INTERVIEW',
    'BUSINESS_INTERVIEW',
    'FINAL_INTERVIEW',
    'OFFER_APPROVAL',
    'OFFER_SENT',
    'ONBOARDED',
  ],
  rejected: [
    'RESUME_REJECTED',
    'INTERVIEW_REJECTED',
    'OFFER_REJECTED',
    'ONBOARDING_ABANDONED',
  ],
};

export const SOURCE_LABELS: Record<string, string> = {
  BOSS_ZHIPIN: 'Boss直聘',
  LIEPIN: '猎聘',
  ZHILIAN: '智联',
  LAGOU: '拉勾',
  EMPLOYEE_REFERRAL: '员工推荐',
  HEADHUNTER: '猎头',
  OFFICIAL_WEBSITE: '官网投递',
  OTHER: '其他',
};

export const POSITION_STATUS_LABELS: Record<string, string> = {
  OPEN: '招聘中',
  PAUSED: '暂停招聘',
  CLOSED: '已关闭',
};
