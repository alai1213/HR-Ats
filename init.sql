-- HR ATS Database Initialization Script
-- Generated for MariaDB 11

USE hr_ats;

-- Roles
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    code VARCHAR(64) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Permissions
CREATE TABLE IF NOT EXISTS permissions (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    code VARCHAR(64) NOT NULL UNIQUE,
    module VARCHAR(64) NOT NULL,
    description VARCHAR(255),
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(128) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(128) NOT NULL,
    avatar VARCHAR(512),
    department VARCHAR(64),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Roles (Many-to-Many)
CREATE TABLE IF NOT EXISTS user_roles (
    user_id VARCHAR(64) NOT NULL,
    role_id VARCHAR(64) NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Role Permissions (Many-to-Many)
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id VARCHAR(64) NOT NULL,
    permission_id VARCHAR(64) NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Positions
CREATE TABLE IF NOT EXISTS positions (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    department VARCHAR(64),
    headcount INT DEFAULT 1,
    hired_count INT DEFAULT 0,
    owner_id VARCHAR(64),
    description LONGTEXT,
    requirements LONGTEXT,
    priority VARCHAR(32),
    status VARCHAR(32),
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Candidates
CREATE TABLE IF NOT EXISTS candidates (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    phone VARCHAR(32),
    email VARCHAR(128),
    wechat VARCHAR(64),
    gender VARCHAR(16),
    age INT,
    city VARCHAR(64),
    avatar VARCHAR(512),
    current_company VARCHAR(128),
    current_position VARCHAR(128),
    work_years INT,
    education VARCHAR(64),
    school VARCHAR(128),
    expected_salary VARCHAR(64),
    position_id VARCHAR(64),
    source VARCHAR(64),
    stage VARCHAR(32),
    owner_id VARCHAR(64),
    portfolio_url VARCHAR(512),
    hr_notes LONGTEXT,
    skills LONGTEXT,
    work_experience LONGTEXT,
    education_history LONGTEXT,
    resume_parsed LONGTEXT,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE SET NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Candidate Tags
CREATE TABLE IF NOT EXISTS candidate_tags (
    id VARCHAR(64) PRIMARY KEY,
    candidate_id VARCHAR(64) NOT NULL,
    tag VARCHAR(64) NOT NULL,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Candidate Files
CREATE TABLE IF NOT EXISTS candidate_files (
    id VARCHAR(64) PRIMARY KEY,
    candidate_id VARCHAR(64) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(512) NOT NULL,
    file_type VARCHAR(64),
    file_size BIGINT,
    is_resume BOOLEAN DEFAULT FALSE,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Interviews
CREATE TABLE IF NOT EXISTS interviews (
    id VARCHAR(64) PRIMARY KEY,
    candidate_id VARCHAR(64) NOT NULL,
    round INT DEFAULT 1,
    scheduled_at DATETIME(6),
    start_time DATETIME(6),
    end_time DATETIME(6),
    interviewer_id VARCHAR(64),
    mode VARCHAR(32),
    status VARCHAR(32),
    notes LONGTEXT,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    FOREIGN KEY (interviewer_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Interview Feedbacks
CREATE TABLE IF NOT EXISTS interview_feedbacks (
    id VARCHAR(64) PRIMARY KEY,
    interview_id VARCHAR(64) NOT NULL,
    candidate_id VARCHAR(64) NOT NULL,
    evaluator_id VARCHAR(64),
    technical_score INT,
    communication_score INT,
    project_score INT,
    overall_comment LONGTEXT,
    result VARCHAR(32),
    suggested_level VARCHAR(32),
    detail_comment LONGTEXT,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    FOREIGN KEY (evaluator_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Offer Approvals
CREATE TABLE IF NOT EXISTS offer_approvals (
    id VARCHAR(64) PRIMARY KEY,
    candidate_id VARCHAR(64) NOT NULL,
    submitter_id VARCHAR(64),
    status VARCHAR(32),
    salary VARCHAR(64),
    start_date DATE,
    notes LONGTEXT,
    approval_notes LONGTEXT,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    FOREIGN KEY (submitter_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Recommendation Pool
CREATE TABLE IF NOT EXISTS recommendation_pool (
    id VARCHAR(64) PRIMARY KEY,
    candidate_id VARCHAR(64) NOT NULL,
    added_by_id VARCHAR(64),
    highlight LONGTEXT,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    FOREIGN KEY (added_by_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Email Templates
CREATE TABLE IF NOT EXISTS email_templates (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    code VARCHAR(64) NOT NULL UNIQUE,
    subject VARCHAR(255) NOT NULL,
    body LONGTEXT NOT NULL,
    variables LONGTEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    action VARCHAR(64) NOT NULL,
    module VARCHAR(64),
    target_id VARCHAR(64),
    target_type VARCHAR(64),
    detail LONGTEXT,
    ip VARCHAR(64),
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Feishu Calendar Events
CREATE TABLE IF NOT EXISTS feishu_calendar_events (
    id VARCHAR(64) PRIMARY KEY,
    interview_id VARCHAR(64) NOT NULL,
    event_id VARCHAR(255) NOT NULL,
    calendar_link VARCHAR(512),
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default roles
INSERT INTO roles (id, name, code, description) VALUES
('role-hr-001', 'HR', 'HR', 'Human Resources role with full system access'),
('role-int-001', 'INTERVIEWER', 'INTERVIEWER', 'Interviewer role for conducting interviews and providing feedback'),
('role-mgr-001', 'HIRING_MANAGER', 'HIRING_MANAGER', 'Hiring manager role for position and offer management');

-- Insert permissions (perm-001 through perm-029)
INSERT INTO permissions (id, name, code, module, description) VALUES
('perm-001', 'View Users', 'user:read', 'USER', 'View user accounts'),
('perm-002', 'Manage Users', 'user:write', 'USER', 'Create, update, and delete user accounts'),
('perm-003', 'View Roles', 'role:read', 'ROLE', 'View roles and permissions'),
('perm-004', 'Manage Roles', 'role:write', 'ROLE', 'Manage roles and permissions'),
('perm-005', 'View Positions', 'position:read', 'POSITION', 'View job positions'),
('perm-006', 'Manage Positions', 'position:write', 'POSITION', 'Create and manage job positions'),
('perm-007', 'View Candidates', 'candidate:read', 'CANDIDATE', 'View candidate profiles'),
('perm-008', 'Manage Candidates', 'candidate:write', 'CANDIDATE', 'Create and manage candidate profiles'),
('perm-009', 'View Interviews', 'interview:read', 'INTERVIEW', 'View interview schedules'),
('perm-010', 'Manage Interviews', 'interview:write', 'INTERVIEW', 'Schedule and manage interviews'),
('perm-011', 'View Offers', 'offer:read', 'OFFER', 'View offer approvals'),
('perm-012', 'Manage Offers', 'offer:write', 'OFFER', 'Create and manage offer approvals'),
('perm-013', 'View Reports', 'report:read', 'REPORT', 'View system reports and analytics'),
('perm-014', 'Manage Settings', 'setting:write', 'SYSTEM', 'Manage system settings'),
('perm-015', 'View Audit Logs', 'audit:read', 'AUDIT', 'View audit logs'),
('perm-016', 'Export Data', 'export:execute', 'EXPORT', 'Export system data'),
('perm-017', 'View All Candidates', 'candidate:read:all', 'CANDIDATE', 'View all candidates'),
('perm-018', 'View Assigned Candidates', 'candidate:read:assigned', 'CANDIDATE', 'View assigned candidates'),
('perm-019', 'Advance Candidate', 'candidate:advance', 'CANDIDATE', 'Advance candidate stage'),
('perm-020', 'Delete Candidate', 'candidate:delete', 'CANDIDATE', 'Delete candidate'),
('perm-021', 'Create Position', 'position:create', 'POSITION', 'Create position'),
('perm-022', 'Create Interview', 'interview:create', 'INTERVIEW', 'Create interview'),
('perm-023', 'Approve Offer', 'offer:approve', 'OFFER', 'Approve offer'),
('perm-024', 'System Manage', 'system:manage', 'SYSTEM', 'System management'),
('perm-025', 'View Dashboard', 'dashboard:read', 'DASHBOARD', 'View dashboard'),
('perm-026', 'View All Feedback', 'feedback:read:all', 'FEEDBACK', 'View all feedbacks'),
('perm-027', 'View Own Feedback', 'feedback:read:own', 'FEEDBACK', 'View own feedbacks'),
('perm-028', 'Manage Feedback', 'feedback:write', 'FEEDBACK', 'Create/update feedback'),
('perm-029', 'Manage Recommendations', 'recommendation:write', 'RECOMMENDATION', 'Manage recommendation pool');

-- Map role permissions
-- HR gets all permissions
INSERT INTO role_permissions (role_id, permission_id) VALUES
('role-hr-001', 'perm-001'), ('role-hr-001', 'perm-002'), ('role-hr-001', 'perm-003'),
('role-hr-001', 'perm-004'), ('role-hr-001', 'perm-005'), ('role-hr-001', 'perm-006'),
('role-hr-001', 'perm-007'), ('role-hr-001', 'perm-008'), ('role-hr-001', 'perm-009'),
('role-hr-001', 'perm-010'), ('role-hr-001', 'perm-011'), ('role-hr-001', 'perm-012'),
('role-hr-001', 'perm-013'), ('role-hr-001', 'perm-014'), ('role-hr-001', 'perm-015'),
('role-hr-001', 'perm-016'), ('role-hr-001', 'perm-017'), ('role-hr-001', 'perm-018'),
('role-hr-001', 'perm-019'), ('role-hr-001', 'perm-020'), ('role-hr-001', 'perm-021'),
('role-hr-001', 'perm-022'), ('role-hr-001', 'perm-023'), ('role-hr-001', 'perm-024'),
('role-hr-001', 'perm-025'), ('role-hr-001', 'perm-026'), ('role-hr-001', 'perm-027'),
('role-hr-001', 'perm-028'), ('role-hr-001', 'perm-029');

-- INTERVIEWER gets view positions, view candidates, view and manage interviews, feedback
INSERT INTO role_permissions (role_id, permission_id) VALUES
('role-int-001', 'perm-005'), ('role-int-001', 'perm-007'), ('role-int-001', 'perm-009'),
('role-int-001', 'perm-010'), ('role-int-001', 'perm-018'), ('role-int-001', 'perm-027'),
('role-int-001', 'perm-028');

-- HIRING_MANAGER gets position, candidate, interview, offer, report, dashboard management
INSERT INTO role_permissions (role_id, permission_id) VALUES
('role-mgr-001', 'perm-005'), ('role-mgr-001', 'perm-006'), ('role-mgr-001', 'perm-007'),
('role-mgr-001', 'perm-009'), ('role-mgr-001', 'perm-011'), ('role-mgr-001', 'perm-012'),
('role-mgr-001', 'perm-013'), ('role-mgr-001', 'perm-017'), ('role-mgr-001', 'perm-021'),
('role-mgr-001', 'perm-022'), ('role-mgr-001', 'perm-023'), ('role-mgr-001', 'perm-025');

-- Insert email templates
INSERT INTO email_templates (id, name, code, subject, body, variables, is_active) VALUES
('tmpl-001', 'INTERVIEW_SCHEDULED', 'INTERVIEW_SCHEDULED', '面试邀请: {{positionTitle}}',
 '<p>尊敬的 {{candidateName}}，</p><p>我们诚邀您参加 <strong>{{positionTitle}}</strong> 岗位的面试。</p><p>时间：{{interviewTime}}</p><p>地点/链接：{{locationOrLink}}</p><p>面试官：{{interviewerName}}</p><p>期待与您的交流！</p>',
 '["candidateName","positionTitle","interviewTime","locationOrLink","interviewerName"]', TRUE),

('tmpl-002', 'FEEDBACK_INVITE', 'FEEDBACK_INVITE', '请填写面试反馈: {{candidateName}}',
 '<p>您好 {{interviewerName}}，</p><p>您于 {{interviewTime}} 面试了候选人 <strong>{{candidateName}}</strong>。</p><p>请在系统中尽快填写面试反馈，谢谢！</p>',
 '["interviewerName","candidateName","interviewTime"]', TRUE),

('tmpl-003', 'OFFER_SENT', 'OFFER_SENT', '录用通知: {{positionTitle}}',
 '<p>尊敬的 {{candidateName}}，</p><p>恭喜您！我们正式向您发放 <strong>{{positionTitle}}</strong> 岗位的录用通知。</p><p>期望入职日期：{{startDate}}</p><p>薪酬：{{salary}}</p><p>如有疑问请联系 HR。</p>',
 '["candidateName","positionTitle","startDate","salary"]', TRUE),

('tmpl-004', 'STATUS_CHANGED', 'STATUS_CHANGED', '候选人状态更新通知',
 '<p>候选人 <strong>{{candidateName}}</strong> 的状态已更新为 <strong>{{newStatus}}</strong>。</p><p>操作人：{{operatorName}}</p><p>时间：{{changeTime}}</p>',
 '["candidateName","newStatus","operatorName","changeTime"]', TRUE);

-- Insert default admin user
-- Password: Admin@123 (bcrypt hash generated with 10 rounds)
INSERT INTO users (id, email, password_hash, name, department, is_active) VALUES
('user-admin-001', 'admin@hrats.local', '$2b$10$NOLGmJWDgmj7K7ZQbARmzOwGxoqwd/sgojQA1DYRznBYwV66Ytu8i', 'System Administrator', 'HR', TRUE);

-- Assign admin to HR role
INSERT INTO user_roles (user_id, role_id) VALUES
('user-admin-001', 'role-hr-001');
