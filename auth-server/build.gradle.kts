plugins {
    id("org.springframework.boot") version "3.5.9"
    id("io.spring.dependency-management") version "1.1.7"
    kotlin("jvm") version "1.9.25"
    kotlin("plugin.spring") version "1.9.25"
    id("io.gitlab.arturbosch.detekt") version "1.23.8"
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-oauth2-authorization-server")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict")
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
    bootBuildImage {
        imageName = buildString {
            append("untitled-showcase/")
            append(project.name)
            append(":")
            when (project.version) {
                "unspecified", null -> append("latest")
                else -> append(project.version)
            }
        }
    }
}

// DETEKT

dependencies {
    detektPlugins("io.gitlab.arturbosch.detekt:detekt-formatting:1.23.8")
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
