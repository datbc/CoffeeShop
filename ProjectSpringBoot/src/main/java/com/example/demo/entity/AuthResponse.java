package com.example.demo.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;
@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String name;
    private List<String> roles;
}