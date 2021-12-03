package com.example.demo.service;

import com.example.demo.dto.PurchaseDto;
import com.example.demo.dto.PurchaseResponse;

public interface CheckoutService {
	PurchaseResponse placeOrder(PurchaseDto purchase);
}
