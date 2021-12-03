package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.demo.entity.City;
@CrossOrigin("http://localhost:4200")
@RepositoryRestResource(collectionResourceRel="cities",path = "cities")
public interface CityRepository extends JpaRepository<City, Integer>{
	
}
