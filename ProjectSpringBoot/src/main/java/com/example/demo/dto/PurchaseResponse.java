package com.example.demo.dto;

import lombok.Data;

@Data
// use this class to send back a java object as Json
public class PurchaseResponse {
	
	private final String orderTrackingNumber;
	
}
