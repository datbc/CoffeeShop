package com.example.demo.service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.demo.dto.CategoryDto;

public interface CategoryService {
	
	Page<CategoryDto> findAll(Integer isDeleted, int page, int size, Pageable pageable);
	
	Page<CategoryDto> findByName(String name, Integer isDeleted, int page, int size, Pageable pageable);
	
	CategoryDto getById(Long id, Integer isDeleted);
	
	CategoryDto save(CategoryDto categoryDto);
}
