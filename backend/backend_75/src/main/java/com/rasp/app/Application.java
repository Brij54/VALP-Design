package com.rasp.app;

import com.rasp.app.decorator.StudentDecorator;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import platform.decorator.DecoratorManager;

@SpringBootApplication
@ComponentScan(basePackages = {"com.rasp.app.controller","controller", "platform.webservice.map", "platform.webservice.controller.base", "com.rasp.app.config", "platform.defined.account.controller", "com.rasp.app.service", "com.rasp.app.decorator"})

public class Application {
	public static void main(String[] args) {
		Registry.register();
        DecoratorManager.getInstance().register(new StudentDecorator());
		SpringApplication.run(Application.class, args);
	}
}
