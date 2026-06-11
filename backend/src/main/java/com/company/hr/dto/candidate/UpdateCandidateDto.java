package com.company.hr.dto.candidate;

import com.company.hr.enums.CandidateSource;
import com.company.hr.enums.CandidateStage;
import com.company.hr.enums.Gender;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "更新候选人")
public class UpdateCandidateDto {

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

    @Schema(description = "应聘职位ID")
    private String positionId;

    @Schema(description = "来源")
    private CandidateSource source;

    @Schema(description = "阶段")
    private CandidateStage stage;

    @Schema(description = "负责人ID")
    private String ownerId;

    @Schema(description = "作品集链接")
    private String portfolioUrl;

    @Schema(description = "HR备注")
    private String hrNotes;

    @Schema(description = "技能")
    private String skills;

    @Schema(description = "标签")
    private List<String> tags;
}
