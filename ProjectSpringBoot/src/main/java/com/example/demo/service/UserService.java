package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.entity.RoleEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.repository.RoleEntityRepository;
import com.example.demo.repository.UserEntityRepository;
@Service
public class UserService {
	@Autowired
    private UserEntityRepository userEntityRepository;
    @Autowired
    RoleEntityRepository roleEntityRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    public UserEntity saveUser(UserEntity userEntity){
        RoleEntity userRole = roleEntityRepository.findByName("ROLE_USER");
        userEntity.setRoleEntity(userRole);
        userEntity.setPassword(passwordEncoder.encode(userEntity.getPassword()));
        return userEntityRepository.save(userEntity);
    }

    public UserEntity findByLogin(String login){
        return userEntityRepository.findByLogin(login);
    }

    public UserEntity findByLoginAndPassword(String login , String password){
        UserEntity userEntity = findByLogin(login);
        if(userEntity != null){
            if (passwordEncoder.matches(password , userEntity.getPassword())){
                return userEntity;
            }
        }
        return null;
    }
}
