package com.example.demo.dto;
import java.time.LocalDateTime;

import com.example.demo.entity.Customer;

import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor

public class CustomerDto {
	private Long id;
	private String firstName;
	private String lastName;
	private String email;
	private LocalDateTime dateCreated;
	private LocalDateTime lastUpdated;
	private Integer isAdmin;
	
	public CustomerDto(Customer customer) {
		this.id = customer.getId();
		this.firstName = customer.getFirstName();
		this.lastName = customer.getLastName();
		this.email = customer.getEmail();
		this.dateCreated = customer.getDateCreated();
		this.lastUpdated = customer.getLastUpdated();
		this.isAdmin = customer.getIsAdmin();
	}
}
