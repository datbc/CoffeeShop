package com.example.demo.entity;

import lombok.Data;
import javax.validation.constraints.NotEmpty;
@Data
public class RegistrationRequest {
    @NotEmpty
    private String login;
    @NotEmpty
    private String password;
}
