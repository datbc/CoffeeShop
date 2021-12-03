package com.example.demo.dto;

import java.time.LocalDateTime;

import com.example.demo.entity.Category;

import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor

public class CategoryDto {
	private Long id;
	private String name;
	private Integer isDeleted;
	private LocalDateTime dateCreated;
	
	public CategoryDto(Category category) {
		this.id = category.getId();
		this.name = category.getName();
		this.isDeleted = category.getIsDeleted();
		this.dateCreated = category.getDateCreated();
	}
}
