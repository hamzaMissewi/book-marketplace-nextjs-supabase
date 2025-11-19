-- Seed sample books data
INSERT INTO public.books (id, title, author, description, category, price_cents, book_type, cover_image_url)
VALUES
  (
    'b1-' || gen_random_uuid()::text,
    'Clean Code',
    'Robert C. Martin',
    'A Handbook of Agile Software Craftsmanship - Learn how to write code that is easy to read and maintain.',
    'Development',
    2999,
    'Hardcover',
    '/placeholder.svg?height=300&width=200'
  ),
  (
    'b2-' || gen_random_uuid()::text,
    'Machine Learning Basics',
    'Andrew Ng',
    'Comprehensive guide to machine learning fundamentals and practical applications.',
    'Machine Learning',
    3499,
    'Hardcover',
    '/placeholder.svg?height=300&width=200'
  ),
  (
    'b3-' || gen_random_uuid()::text,
    'Cloud Computing Essentials',
    'Rajkumar Buyya',
    'Master cloud infrastructure, deployment models, and services.',
    'Cloud Computing',
    2899,
    'Paperback',
    '/placeholder.svg?height=300&width=200'
  ),
  (
    'b4-' || gen_random_uuid()::text,
    'AI in Practice',
    'Shannon Vallor',
    'Real-world applications of artificial intelligence and ethical considerations.',
    'AI',
    3199,
    'Hardcover',
    '/placeholder.svg?height=300&width=200'
  ),
  (
    'b5-' || gen_random_uuid()::text,
    'Building AI Agents',
    'Yoav Shoham',
    'Design and implementation of intelligent agents using cutting-edge AI techniques.',
    'AI Agents',
    3599,
    'Hardcover',
    '/placeholder.svg?height=300&width=200'
  ),
  (
    'b6-' || gen_random_uuid()::text,
    'Business Strategy 101',
    'Michael Porter',
    'Fundamental principles of competitive strategy and business planning.',
    'Business',
    2499,
    'Paperback',
    '/placeholder.svg?height=300&width=200'
  ),
  (
    'b7-' || gen_random_uuid()::text,
    'Web Development Advanced',
    'Kyle Simpson',
    'Deep dive into modern web development, frameworks, and best practices.',
    'Development',
    3299,
    'Hardcover',
    '/placeholder.svg?height=300&width=200'
  ),
  (
    'b8-' || gen_random_uuid()::text,
    'Entrepreneurship Blueprint',
    'Steve Blank',
    'Guide to starting and scaling successful business ventures.',
    'Business',
    2799,
    'Paperback',
    '/placeholder.svg?height=300&width=200'
  );
