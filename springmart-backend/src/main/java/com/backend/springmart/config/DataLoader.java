package com.backend.springmart.config;

import com.backend.springmart.model.Product;
import com.backend.springmart.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * DataLoader is a configuration component that runs during application boot.
 * It seeds the relational database with realistic demo inventory items if the database is currently empty,
 * and self-heals existing demo records by synchronizing updated seed assets and missing items.
 * This guarantees an immediate out-of-the-box working catalog without requiring manual database initialization.
 */
@Configuration
public class DataLoader
{
    /**
     * Creates a {@link CommandLineRunner} bean. Spring Boot automatically executes all registered 
     * CommandLineRunners after the application context is fully loaded and before the startup completes.
     *
     * @param productRepository the persistent repository to check inventory counts and save seed data
     * @return an executable runner containing the data-seeding sequence
     */
    @Bean
    CommandLineRunner loadDemoData(ProductRepository productRepository)
    {
        return args ->
        {
            // A functional helper that extracts binary image bytes from the classpath (src/main/resources).
            // Uses Java's try-with-resources to automatically close the InputStream, preventing resource leaks.
            Function<String, byte[]> loadImage = resourcePath ->
                {
                    Resource res = new ClassPathResource(resourcePath);
                    try (InputStream is = res.getInputStream())
                    {
                        if (is != null)
                        {
                            return is.readAllBytes();
                        }
                    }
                    catch (IOException e)
                    {
                        System.err.println("CRITICAL: Seed image not found at classpath path: " + resourcePath);
                    }
                    return null;
                };

                // Initialize standard seed catalog. Demo items showcase varied data types (e.g., fractional quantities, 
                // different MIME types, large pricing metrics, and various brands) to verify frontend alignment.
                List<Product> demoProducts = List.of(
                        new Product(
                                0,
                                "Wireless Mouse",
                                799,
                                "Ergonomic mouse with USB receiver",
                                "Electronics",
                                50,
                                "LogiTech",
                                true,
                                new Date(),
                                "mouse.webp",
                                "image/webp",
                                loadImage.apply("images/mouse.webp")),
                        new Product(
                                0,
                                "Mechanical Keyboard",
                                1999,
                                "RGB backlit mechanical keyboard",
                                "Electronics",
                                30,
                                "KeyChron",
                                true,
                                new Date(),
                                "keyboard.png",
                                "image/png",
                                loadImage.apply("images/keyboard.png")),
                        new Product(
                                0,
                                "Gaming Headset",
                                2999,
                                "Over-ear gaming headset with mic",
                                "Electronics",
                                20,
                                "Razer",
                                true,
                                new Date(),
                                "headset.webp",
                                "image/webp",
                                loadImage.apply("images/headset.webp")),
                        new Product(
                                0,
                                "Leather Bag for Women",
                                2499,
                                "Premium leather handbag for women",
                                "Fashion",
                                15,
                                "Fossil",
                                true,
                                new Date(),
                                "bag.png",
                                "image/png",
                                loadImage.apply("images/bag.png")),
                        new Product(
                                0,
                                "Whoop Fitness Band",
                                3499,
                                "Advanced fitness and health tracker band",
                                "Health",
                                25,
                                "Whoop",
                                true,
                                new Date(),
                                "whoop_band.png",
                                "image/png",
                                loadImage.apply("images/whoop_band.png")),
                        new Product(
                                0,
                                "Atomic Habits Book",
                                499,
                                "Bestselling self-help book by James Clear",
                                "Books",
                                40,
                                "Penguin",
                                true,
                                new Date(),
                                "book.jpg",
                                "image/jpeg",
                                loadImage.apply("images/book.jpg")),
                        new Product(
                                0,
                                "CMF Buds Pro 2",
                                3499,
                                "Noise-cancelling wireless earbuds",
                                "Electronics",
                                35,
                                "CMF",
                                true,
                                new Date(),
                                "cmf_buds.webp",
                                "image/webp",
                                loadImage.apply("images/cmf_buds.webp")),
                        new Product(
                                0,
                                "Samsung Smart TV",
                                39999,
                                "50-inch 4K Ultra HD Smart LED TV",
                                "Electronics",
                                10,
                                "Samsung",
                                true,
                                new Date(),
                                "samsung_tv.avif",
                                "image/avif",
                                loadImage.apply("images/samsung_tv.avif")),
                        new Product(
                                0,
                                "Puma Running Shoes",
                                2999,
                                "Lightweight running shoes for men",
                                "Sports",
                                28,
                                "Puma",
                                true,
                                new Date(),
                                "shoe.png",
                                "image/png",
                                loadImage.apply("images/shoe.png")));

            List<Product> existingProducts = productRepository.findAll();

            if (existingProducts.isEmpty())
            {
                productRepository.saveAll(demoProducts);
                System.out.println("✅ Database was empty. Successfully loaded " + demoProducts.size() + " demo products with seed images.");
            }
            else
            {
                // Self-healing synchronization:
                // When modern seed images are added or updated in the repository codebase, existing local persistent H2
                // databases may retain legacy image filenames and byte payloads.
                // We synchronize existing seed items with the latest assets and re-seed any missing demo products without altering user products.
                Map<String, Product> existingByName = existingProducts.stream()
                        .collect(Collectors.toMap(Product::getName, p -> p, (p1, p2) -> p1));

                boolean modified = false;
                for (Product demo : demoProducts)
                {
                    Product existing = existingByName.get(demo.getName());
                    if (existing != null)
                    {
                        boolean needsImageUpdate = !demo.getImageName().equals(existing.getImageName())
                                || existing.getImageData() == null
                                || existing.getImageData().length == 0;

                        if (needsImageUpdate && demo.getImageData() != null)
                        {
                            existing.setImageName(demo.getImageName());
                            existing.setImageType(demo.getImageType());
                            existing.setImageData(demo.getImageData());
                            productRepository.save(existing);
                            modified = true;
                            System.out.println("🔄 Updated seed image for product: " + existing.getName() + " -> " + demo.getImageName());
                        }
                    }
                    else
                    {
                        productRepository.save(demo);
                        modified = true;
                        System.out.println("➕ Re-seeded missing demo product: " + demo.getName());
                    }
                }

                if (modified)
                {
                    System.out.println("✅ Successfully synchronized demo catalog with latest seed assets.");
                }
                else
                {
                    System.out.println("ℹ️ Products already exist in H2 database and are up-to-date. Skipping seed execution.");
                }
            }
        };
    }
}
