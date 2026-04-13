package org.example.AppDataAPI;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.Properties;

@Configuration
@EnableJpaRepositories(basePackages = "org.example.WebAPI")
public class AppDbContext {

    // Настройки подключения к БД
    public static final String DB_HOST = "192.168.0.107";
    public static final int DB_PORT = 5432;
    public static final String DB_NAME = "TechnicsJava";
    public static final String DB_USERNAME = "Ershik286";
    public static final String DB_PASSWORD = "CyberBiba227";

    // Свойства для Hibernate
    public Properties hibernateProperties() {
        Properties properties = new Properties();
        properties.setProperty("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
        properties.setProperty("hibernate.hbm2ddl.auto", "update");
        properties.setProperty("hibernate.show_sql", "true");
        properties.setProperty("hibernate.format_sql", "true");
        return properties;
    }
}
