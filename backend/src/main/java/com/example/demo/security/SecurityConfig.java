package com.example.demo.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, 
                    "/api/movies", "/api/movies/**", 
                    "/api/cinemas", "/api/cinemas/**", 
                    "/api/rooms", "/api/rooms/**", 
                    "/api/seats", "/api/seats/**", 
                    "/api/showtimes", "/api/showtimes/**", 
                    "/api/food-drinks", "/api/food-drinks/**",
                    "/api/banners", "/api/banners/**",
                    "/api/promotions", "/api/promotions/**",
                    "/api/invoices/vnpay-callback").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/invoices/momo-callback").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/invoices/vnpay-ipn").permitAll()
                .requestMatchers(HttpMethod.POST, 
                    "/api/movies", "/api/movies/**", 
                    "/api/cinemas", "/api/cinemas/**", 
                    "/api/rooms", "/api/rooms/**", 
                    "/api/seats", "/api/seats/**", 
                    "/api/showtimes", "/api/showtimes/**", 
                    "/api/food-drinks", "/api/food-drinks/**",
                    "/api/banners", "/api/banners/**",
                    "/api/promotions", "/api/promotions/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, 
                    "/api/movies/**", "/api/cinemas/**", "/api/rooms/**", "/api/seats/**", "/api/showtimes/**", "/api/food-drinks/**", "/api/banners/**", "/api/promotions/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, 
                    "/api/movies/**", "/api/cinemas/**", "/api/rooms/**", "/api/seats/**", "/api/showtimes/**", "/api/food-drinks/**", "/api/banners/**", "/api/promotions/**").hasRole("ADMIN")

                .requestMatchers(HttpMethod.GET, "/api/vouchers/apply/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/invoices/my").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/invoices/check-payment-status/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/invoices/{id}").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/invoices").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/users/profile").authenticated()

                .requestMatchers(HttpMethod.PUT, "/api/users/profile").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/users/password").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/invoices", "/api/invoices/**").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers("/api/users", "/api/users/**", "/api/dashboard", "/api/dashboard/**", "/api/vouchers", "/api/vouchers/**").hasRole("ADMIN")
                .requestMatchers("/api/invoices", "/api/invoices/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
        configuration.setAllowedOriginPatterns(java.util.List.of("*"));
        configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(java.util.List.of("*"));
        configuration.setAllowCredentials(true);
        org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
