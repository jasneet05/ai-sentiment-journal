package net.journalApp.repository;

import net.journalApp.entity.ConfigJournalAppEntity;
import net.journalApp.entity.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ConfigJournalAppRepository extends MongoRepository<ConfigJournalAppEntity, ObjectId> {

}

