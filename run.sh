#!/bin/bash

# Run the Spring Boot application without compiling or running tests
# This is useful when you have fixed compilation issues in the main code
# but still have test compilation issues.
mvn spring-boot:run -Dmaven.test.skip=true
