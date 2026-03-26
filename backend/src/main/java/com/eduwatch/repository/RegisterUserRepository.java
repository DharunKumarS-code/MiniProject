package com.eduwatch.repository;

import com.eduwatch.model.RegisterUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RegisterUserRepository extends MongoRepository<RegisterUser, String> {
    Optional<RegisterUser> findByEmail(String email);
    boolean existsByEmail(String email);
}