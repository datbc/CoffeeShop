package com.example.demo.dto;

import java.util.Set;

import com.example.demo.entity.Address;
import com.example.demo.entity.Customer;
import com.example.demo.entity.Order;
import com.example.demo.entity.OrderItem;

import lombok.Data;

@Data
public class PurchaseDto {
	private Customer customer;
	private Address shippingAddress;
	private Order order;
	private Set<OrderItem> orderItems;
		
}
