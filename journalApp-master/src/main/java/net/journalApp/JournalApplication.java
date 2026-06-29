package net.journalApp;

import net.journalApp.entity.JournalEntry;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.MongoTransactionManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@EnableTransactionManagement
@EnableScheduling
public class JournalApplication {

    public static void main(String[] args) {
        SpringApplication.run(JournalApplication.class, args);
    }

    @Bean
    public PlatformTransactionManager transactionManager(MongoDatabaseFactory dbFactory) {
        try {
            org.bson.Document commandResult = dbFactory.getMongoDatabase().runCommand(new org.bson.Document("isMaster", 1));
            if (commandResult.containsKey("setName")) {
                return new MongoTransactionManager(dbFactory);
            }
        } catch (Exception e) {
            // Fallback to NoOp in case of check error
        }
        return new NoOpTransactionManager();
    }

    private static class NoOpTransactionManager implements org.springframework.transaction.PlatformTransactionManager {
        @Override
        public org.springframework.transaction.TransactionStatus getTransaction(org.springframework.transaction.TransactionDefinition definition) throws org.springframework.transaction.TransactionException {
            return new org.springframework.transaction.support.SimpleTransactionStatus();
        }

        @Override
        public void commit(org.springframework.transaction.TransactionStatus status) throws org.springframework.transaction.TransactionException {
            // No-op
        }

        @Override
        public void rollback(org.springframework.transaction.TransactionStatus status) throws org.springframework.transaction.TransactionException {
            // No-op
        }
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();

    }

}
