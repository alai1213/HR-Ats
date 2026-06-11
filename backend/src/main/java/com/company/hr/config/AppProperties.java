package com.company.hr.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private JwtProperties jwt = new JwtProperties();
    private MinioProperties minio = new MinioProperties();
    private FeishuProperties feishu = new FeishuProperties();
    private FrontendProperties frontend = new FrontendProperties();

    @Getter
    @Setter
    public static class JwtProperties {
        private String secret;
        private long expirationMs;
    }

    @Getter
    @Setter
    public static class MinioProperties {
        private String endpoint;
        private int port;
        private boolean secure;
        private String accessKey;
        private String secretKey;
        private String bucket;
        private String publicUrl;
    }

    @Getter
    @Setter
    public static class FeishuProperties {
        private String appId;
        private String appSecret;
    }

    @Getter
    @Setter
    public static class FrontendProperties {
        private String url;
    }
}
