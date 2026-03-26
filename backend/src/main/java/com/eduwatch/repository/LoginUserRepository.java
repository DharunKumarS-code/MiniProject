package com.eduwatch.repository;

import com.eduwatch.model.LoginUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface LoginUserRepository extends MongoRepository<LoginUser, String> {
    Optional<LoginUser> findByEmail(String email);
}