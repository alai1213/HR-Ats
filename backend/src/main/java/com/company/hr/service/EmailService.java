package com.company.hr.service;

import com.company.hr.entity.EmailTemplate;
import com.company.hr.repository.EmailTemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final EmailTemplateRepository emailTemplateRepository;

    public void sendTemplateEmail(String to, String templateCode, Map<String, String> variables) {
        Optional<EmailTemplate> templateOpt = emailTemplateRepository.findByCode(templateCode);
        if (templateOpt.isEmpty()) {
            log.warn("Email template not found: {}", templateCode);
            return;
        }

        EmailTemplate template = templateOpt.get();
        if (!template.isActive()) {
            log.warn("Email template is inactive: {}", templateCode);
            return;
        }

        String subject = template.getSubject();
        String body = template.getBody();

        if (variables != null) {
            for (Map.Entry<String, String> entry : variables.entrySet()) {
                subject = subject.replace("{{" + entry.getKey() + "}}", entry.getValue());
                body = body.replace("{{" + entry.getKey() + "}}", entry.getValue());
            }
        }

        log.info("Sending email to: {}, subject: {}", to, subject);
        // In production, integrate with actual email provider (SMTP, SendGrid, etc.)
    }

    public void sendByTemplate(String templateCode, String toEmail, Map<String, String> variables) {
        EmailTemplate template = emailTemplateRepository.findByCode(templateCode)
                .orElseThrow(() -> new RuntimeException("Email template not found: " + templateCode));

        if (!template.isActive()) {
            throw new RuntimeException("Email template is inactive: " + templateCode);
        }

        String subject = replaceVariables(template.getSubject(), variables);
        String body = replaceVariables(template.getBody(), variables);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);

        javaMailSender.send(message);
        log.info("Email sent to {} with template {}", toEmail, templateCode);
    }

    private String replaceVariables(String template, Map<String, String> variables) {
        if (variables == null || template == null) {
            return template;
        }
        String result = template;
        Pattern pattern = Pattern.compile("\\{\\{([^}]+)\\}\\}");
        Matcher matcher = pattern.matcher(result);
        StringBuffer sb = new StringBuffer();
        while (matcher.find()) {
            String key = matcher.group(1);
            String value = variables.getOrDefault(key, "");
            matcher.appendReplacement(sb, Matcher.quoteReplacement(value));
        }
        matcher.appendTail(sb);
        return sb.toString();
    }
}
