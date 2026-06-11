package com.company.hr.dto.candidate;

import com.company.hr.enums.CandidateSource;
import com.company.hr.enums.CandidateStage;
import com.company.hr.enums.Gender;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "候选人响应")
public class CandidateResponse {

    @Schema(description = "候选人ID")
    private String id;

    @Schema(description = "姓名")
    private String name;

    @Schema(description = "电话")
    private String phone;

    @Schema(description = "邮箱")
    private String email;

    @Schema(description = "微信")
    private String wechat;

    @Schema(description = "性别")
    private Gender gender;

    @Schema(description = "年龄")
    private Integer age;

    @Schema(description = "城市")
    private String city;

    @Schema(description = "头像")
    private String avatar;

    @Schema(description = "当前公司")
    private String currentCompany;

    @Schema(description = "当前职位")
    private String currentPosition;

    @Schema(description = "工作年限")
    private Double workYears;

    @Schema(description = "学历")
    private String education;

    @Schema(description = "毕业院校")
    private String school;

    @Schema(description = "期望薪资")
    private String expectedSalary;

    @Schema(description = "职位ID")
    private String positionId;

    @Schema(description = "职位名称")
    private String positionTitle;

    @Schema(description = "来源")
    private CandidateSource source;

    @Schema(description = "阶段")
    private CandidateStage stage;

    @Schema(description = "负责人ID")
    private String ownerId;

    @Schema(description = "负责人姓名")
    private String ownerName;

    @Schema(description = "作品集链接")
    private String portfolioUrl;

    @Schema(description = "HR备注")
    private String hrNotes;

    @Schema(description = "技能")
    private String skills;

    @Schema(description = "是否已解析简历")
    private Boolean resumeParsed;

    @Schema(description = "标签")
    private List<String> tags;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;
}
