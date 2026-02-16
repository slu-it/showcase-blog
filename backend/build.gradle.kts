plugins {
    id("org.springframework.boot") version "4.0.2"
    id("io.spring.dependency-management") version "1.1.7"
    kotlin("jvm") version "2.2.21"
    kotlin("plugin.spring") version "2.2.21"
    id("io.gitlab.arturbosch.detekt") version "1.23.8"
    id("org.asciidoctor.jvm.convert") version "4.0.5"
}

extra["snippetsDir"] = file("build/generated-snippets")

repositories {
    mavenCentral()
}

dependencyManagement {
    dependencies {
        dependency("io.mockk:mockk-jvm:1.14.7")
        dependency("com.ninja-squad:springmockk:5.0.1")
        dependency("io.kotest:kotest-assertions-core-jvm:6.1.1")
        dependency("io.gitlab.arturbosch.detekt:detekt-formatting:1.23.8")
    }
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-flyway")
    implementation("org.springframework.boot:spring-boot-starter-hateoas")
    implementation("org.springframework.boot:spring-boot-starter-jdbc")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-security-oauth2-resource-server")
    implementation("org.springframework.boot:spring-boot-starter-webmvc")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("tools.jackson.module:jackson-module-kotlin")
    runtimeOnly("io.micrometer:micrometer-registry-prometheus")
    runtimeOnly("org.flywaydb:flyway-database-postgresql")
    runtimeOnly("org.postgresql:postgresql")
    testImplementation("org.springframework.boot:spring-boot-restdocs")
    testImplementation("org.springframework.boot:spring-boot-starter-flyway-test")
    testImplementation("org.springframework.boot:spring-boot-starter-hateoas-test")
    testImplementation("org.springframework.boot:spring-boot-starter-jdbc-test")
    testImplementation("org.springframework.boot:spring-boot-starter-security-oauth2-resource-server-test")
    testImplementation("org.springframework.boot:spring-boot-starter-security-test")
    testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
    testImplementation("org.springframework.boot:spring-boot-testcontainers")
    testImplementation("org.springframework.restdocs:spring-restdocs-mockmvc")
    testImplementation("org.testcontainers:testcontainers-junit-jupiter")
    testImplementation("org.testcontainers:testcontainers-postgresql")
    testImplementation("com.ninja-squad:springmockk")
    testImplementation("io.kotest:kotest-assertions-core-jvm")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict", "-Xannotation-default-target=param-property")
    }
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

tasks {
    withType<Test> {
        useJUnitPlatform()
    }
}

// SPRING BOOT


tasks {
    bootJar {
        dependsOn(asciidoctor)
        from(asciidoctor) {
            into("BOOT-INF/classes/static/docs")
        }
    }
    bootBuildImage {
        imageName =  buildString {
            append("showcase-blog/")
            append(project.name)
            append(":")
            when (project.version) {
                "unspecified", null -> append("latest")
                else -> append(project.version)
            }
        }
    }
}

// ASCIIDOC

tasks.asciidoctor {
    inputs.dir(project.extra["snippetsDir"]!!)
    dependsOn(tasks.test)
    attributes(mapOf("snippets" to project.extra["snippetsDir"]!!))
}

// DETEKT

dependencies {
    detektPlugins("io.gitlab.arturbosch.detekt:detekt-formatting")
}

detekt {
    buildUponDefaultConfig = true // Uses Detekt defaults, then applies your overrides
    config.setFrom("$projectDir/detekt.yml") // Your override file
}

configurations.matching { it.name.startsWith("detekt") }
    .all {
        resolutionStrategy.eachDependency {
            // Detekt uses another Kotlin version internally
            if (requested.group == "org.jetbrains.kotlin") useVersion("2.0.21")
        }
    }
