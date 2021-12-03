package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.demo.entity.District;

@RepositoryRestResource(collectionResourceRel = "districts", path = "districts")
@CrossOrigin("http://localhost:4200")
public interface DistrictRepository extends JpaRepository<District, Integer> {
	
	List<District> findByCityCode(@Param("code") String code);
}
