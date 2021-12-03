package com.example.demo.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.example.demo.dto.CustomerDto;

public interface CustomerService {
	
	Page<CustomerDto> findAll(int page, int size, Pageable pageable);
	
	Page<CustomerDto> findByIsAdmin(Integer isAdmin, int page, int size, Pageable pageable);
	
	CustomerDto findByEmail(String email);
	
	CustomerDto save(CustomerDto customerDto);
}
