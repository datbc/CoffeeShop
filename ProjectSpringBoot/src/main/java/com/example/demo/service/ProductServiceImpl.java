package com.example.demo.service;

import javax.transaction.Transactional;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
//import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.dto.ProductDto;
import com.example.demo.entity.Product;

@Service
public class ProductServiceImpl implements ProductService {
	
	@Autowired
	private ProductRepository productRepository;
	
	@Autowired
	private CategoryRepository categoryRepository;
	
	@Override
	@Transactional
	public Page<ProductDto> findByIsDeleted(int isDeleted, int page, int size, String sort, Pageable pageable) {
		pageable = PageRequest.of(page, size, Sort.by(sort));
		return productRepository.findByIsDeleted(isDeleted, pageable)
								.map(ProductDto::new);
	}
	
	@Override
	@Transactional
	public Page<ProductDto> findByIsDeletedDesc(int isDeleted, int page, int size, String sort, Pageable pageable) {
		pageable = PageRequest.of(page, size, Sort.by(sort).descending());
		return productRepository.findByIsDeleted(isDeleted, pageable)
								.map(ProductDto::new);
	}

	@Override
	@Transactional
	public Page<ProductDto> findByCategoryIdAndIsDeleted(Long categoryId, int isDeleted, 
														 int page, int size, 
														 String sort, Pageable pageable) {
		pageable = PageRequest.of(page, size, Sort.by(sort));
		return productRepository.findByCategoryIdAndIsDeleted(categoryId, isDeleted, pageable)
								.map(ProductDto::new);
	}

	@Override
	@Transactional
	public Page<ProductDto> findByNameContainingAndIsDeleted(String productName, int isDeleted, 
															 int page, int size, 
															 String sort, Pageable pageable) {
		pageable = PageRequest.of(page, size, Sort.by(sort));
		return productRepository.findByNameContainingAndIsDeleted(productName, isDeleted, pageable)
								.map(ProductDto::new);
	}
	
	@Override
	@Transactional
	public ProductDto findById(Long id, Integer isDeleted) {
		ProductDto productDto = null;
		if (productRepository.findByIdAndIsDeleted(id, isDeleted) != null) {
			productDto = new ProductDto(productRepository.findByIdAndIsDeleted(id, isDeleted));
		}
		return productDto;
	}
	
	@Override
	@Transactional
	public ProductDto save(ProductDto productDto) {
		Optional<Product> optional = productRepository.findById(productDto.getId());
		Product product = new Product();
		if (optional.isPresent()) {
			product = optional.get();
		}
		convert(product, productDto);
		productRepository.save(product);
		return productDto;
	}

	@Override
	@Transactional
	public Integer countProductByCategory(Long categoryId, Integer isDeleted) {
		int count = 0;
		if (productRepository.findByCategoryIdAndIsDeleted(categoryId, isDeleted) != null) {
			count = productRepository.findByCategoryIdAndIsDeleted(categoryId, isDeleted).size();
		}
		return Integer.valueOf(count);
	}
	
	@Override
	public Integer deleteMultiple(List<Long> ids) {
		for(long item: ids) {
			Product pro = productRepository.findById(item).orElseThrow();
			pro.setIsDeleted(1);
			productRepository.save(pro);
		}
		return 1;
	}
	
	private void convert(Product product, ProductDto productDto) {
		product.setId(productDto.getId());
		product.setName(productDto.getName());
		product.setDescription(productDto.getDescription());
		product.setUnitPrice(productDto.getUnitPrice());
		product.setImageUrl(productDto.getImageUrl());
		product.setActive(productDto.getActive());
		product.setDateCreated(product.getDateCreated());
		product.setLastUpdated(product.getLastUpdated());
		product.setIsDeleted(productDto.getIsDeleted());
		product.setCategory(categoryRepository.getById(productDto.getCategory().getId()));
	}
}
