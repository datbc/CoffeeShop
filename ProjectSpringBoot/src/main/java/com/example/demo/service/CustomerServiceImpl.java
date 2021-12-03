package com.example.demo.service;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.demo.dto.CustomerDto;
import com.example.demo.entity.Customer;
import com.example.demo.repository.CustomerRepository;

@Service
public class CustomerServiceImpl implements CustomerService{

	@Autowired
	private CustomerRepository customerRepository;
	
	@Override
	@Transactional
	public Page<CustomerDto> findAll(int page, int size, Pageable pageable) {
		pageable = PageRequest.of(page, size, Sort.by("dateCreated"));
		return customerRepository.findAll(pageable)
								 .map(CustomerDto::new);
	}
	
	@Override
	@Transactional
	public Page<CustomerDto> findByIsAdmin(Integer isAdmin, int page, int size, Pageable pageable) {
		pageable = PageRequest.of(page, size);
		return customerRepository.findByIsAdmin(isAdmin, pageable)
								 .map(CustomerDto::new);
	}
	

	@Override
	@Transactional
	public CustomerDto findByEmail(String email) {
		return new CustomerDto(customerRepository.findByEmail(email));
	}
	
	@Override
	@Transactional
	public CustomerDto save(CustomerDto customerDto) {
		Customer customer = new Customer();
		convert(customer, customerDto);
		customerRepository.save(customer);
		return customerDto;
	}
	
	private void convert(Customer customer, CustomerDto customerDto) {
		customer.setId(customerDto.getId());
		customer.setFirstName(customerDto.getFirstName());
		customer.setLastName(customerDto.getLastName());
		customer.setEmail(customerDto.getEmail());
		customer.setDateCreated(customerDto.getDateCreated());
		customer.setLastUpdated(customerDto.getLastUpdated());
		customer.setIsAdmin(customerDto.getIsAdmin());		
	}
}
