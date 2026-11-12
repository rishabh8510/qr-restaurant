'use strict';

const { v4: uuidv4 } = require('uuid');

function getMenuData() {
  const now = new Date();
  const oneMonthLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  // 1. Categories
  const categories = [
    {
      id: uuidv4(),
      name: 'Sandwich',
      slug: 'sandwich',
      description: 'Crispy toasted, grilled and cold gourmet sandwiches loaded with fresh veggies and cheese.',
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
      sort_order: 1,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      name: 'French Fries',
      slug: 'french-fries',
      description: 'Golden crispy potato fries tossed in exotic seasonings and rich melted cheese.',
      image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
      sort_order: 2,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      name: 'Burger & Hotdog',
      slug: 'burger-hotdog',
      description: 'Juicy vegetable and paneer patties inside soft toasted buns and stuffed hot dogs.',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      sort_order: 3,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      name: 'Open Toast',
      slug: 'open-toast',
      description: 'Crispy open-faced toasted breads loaded with savoury toppings, herbs, and cheese.',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
      sort_order: 4,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      name: 'Pasta',
      slug: 'pasta',
      description: 'Authentic Italian pastas tossed in aromatic herbs and rich creamy sauces.',
      image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=800&q=80',
      sort_order: 5,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      name: 'Maggi',
      slug: 'maggi',
      description: 'Your favourite comfort noodles cooked with fresh veggies, desi spices, and cheese.',
      image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80',
      sort_order: 6,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      name: 'Pizza',
      slug: 'pizza',
      description: 'Stone-baked thin crust pizzas with mozzarella cheese and fresh garden toppings.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      sort_order: 7,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      name: 'Coffee',
      slug: 'coffee',
      description: 'Artisanal hot espressos and thick refreshing blended cold coffees.',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
      sort_order: 8,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      name: 'Beverages',
      slug: 'beverages',
      description: 'Refreshing iced teas, herbal drinks, and thick gourmet milkshakes.',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80',
      sort_order: 9,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      name: 'Ice-Cream Float',
      slug: 'ice-cream-float',
      description: 'Fizzy chilled sodas paired with creamy dollops of vanilla ice cream.',
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
      sort_order: 10,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      name: 'Ice-Cream Soda',
      slug: 'ice-cream-soda',
      description: 'Refreshing aromatic soda coolers infused with sweet flavors.',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
      sort_order: 11,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
  ];

  const catMap = {};
  categories.forEach((c) => {
    catMap[c.slug] = c.id;
  });

  // 2. SubCategories
  const subCategories = [
    // Sandwich
    {
      id: uuidv4(),
      category_id: catMap['sandwich'],
      name: 'Classic & Masala Sandwiches',
      slug: 'sandwich-classic',
      description: 'Simple, fresh, and spiced veggie sandwiches',
      image: categories[0].image,
      sort_order: 1,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      category_id: catMap['sandwich'],
      name: 'Cheesy Sandwiches',
      slug: 'sandwich-cheese',
      description: 'Melted cheese toasts and layered grills',
      image: categories[0].image,
      sort_order: 2,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      category_id: catMap['sandwich'],
      name: 'Paneer Sandwiches',
      slug: 'sandwich-paneer',
      description: 'Cottage cheese grilled sandwiches in special marinades',
      image: categories[0].image,
      sort_order: 3,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      category_id: catMap['sandwich'],
      name: 'Special & Sweet Sandwiches',
      slug: 'sandwich-special',
      description: 'Nutella, chocolate, and house special creations',
      image: categories[0].image,
      sort_order: 4,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    // French Fries
    {
      id: uuidv4(),
      category_id: catMap['french-fries'],
      name: 'Fries & Loaded Fries',
      slug: 'fries-all',
      description: 'Crisp salted, peri-peri, and cheese-loaded fries',
      image: categories[1].image,
      sort_order: 1,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    // Burger & Hotdog
    {
      id: uuidv4(),
      category_id: catMap['burger-hotdog'],
      name: 'Burgers',
      slug: 'burgers',
      description: 'Crispy veggie and paneer burgers with melted cheese',
      image: categories[2].image,
      sort_order: 1,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      category_id: catMap['burger-hotdog'],
      name: 'Hot Dogs',
      slug: 'hotdogs',
      description: 'Stuffed hot dogs with sauces and cheese',
      image: categories[2].image,
      sort_order: 2,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    // Open Toast
    {
      id: uuidv4(),
      category_id: catMap['open-toast'],
      name: 'Open Toasts',
      slug: 'open-toast-all',
      description: 'Savoury open-faced crusty breads',
      image: categories[3].image,
      sort_order: 1,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    // Pasta
    {
      id: uuidv4(),
      category_id: catMap['pasta'],
      name: 'Pasta Delights',
      slug: 'pasta-all',
      description: 'White sauce, red sauce, pink sauce, and cheesy pastas',
      image: categories[4].image,
      sort_order: 1,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    // Maggi
    {
      id: uuidv4(),
      category_id: catMap['maggi'],
      name: 'Maggi Noodles',
      slug: 'maggi-all',
      description: 'Desi tadka, butter, cheese, and vegetable Maggi',
      image: categories[5].image,
      sort_order: 1,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    // Pizza
    {
      id: uuidv4(),
      category_id: catMap['pizza'],
      name: 'Pizzas',
      slug: 'pizza-all',
      description: 'Cheesy thin-crust and loaded vegetable pizzas',
      image: categories[6].image,
      sort_order: 1,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    // Coffee
    {
      id: uuidv4(),
      category_id: catMap['coffee'],
      name: 'Hot Coffee',
      slug: 'coffee-hot',
      description: 'Freshly brewed hot coffees, hazelnut, and caramel',
      image: categories[7].image,
      sort_order: 1,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      category_id: catMap['coffee'],
      name: 'Cold Coffee',
      slug: 'coffee-cold',
      description: 'Chilled frappes, brownie blends, and iced coffees',
      image: categories[7].image,
      sort_order: 2,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    // Beverages
    {
      id: uuidv4(),
      category_id: catMap['beverages'],
      name: 'Teas & Warm Drinks',
      slug: 'beverages-warm-tea',
      description: 'Green tea, hot chocolate, spiced milk, and iced teas',
      image: categories[8].image,
      sort_order: 1,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      category_id: catMap['beverages'],
      name: 'Gourmet Shakes',
      slug: 'beverages-shakes',
      description: 'Thick fruit shakes, Oreo, Kit Kat, and Nutella shakes',
      image: categories[8].image,
      sort_order: 2,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    // Floats
    {
      id: uuidv4(),
      category_id: catMap['ice-cream-float'],
      name: 'Ice-Cream Floats',
      slug: 'float-all',
      description: 'Coke and Orange fizzy floats with vanilla ice cream',
      image: categories[9].image,
      sort_order: 1,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    // Sodas
    {
      id: uuidv4(),
      category_id: catMap['ice-cream-soda'],
      name: 'Ice-Cream Sodas',
      slug: 'soda-all',
      description: 'Rose, Khus, Lemon, and Orange flavoured sodas',
      image: categories[10].image,
      sort_order: 1,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
  ];

  const subMap = {};
  subCategories.forEach((s) => {
    subMap[s.slug] = s.id;
  });

  // Helper to build products easily
  function p(name, price, catSlug, subSlug, image, desc, opts = {}) {
    return {
      id: uuidv4(),
      name,
      price: Number(price),
      old_price: opts.old_price != null ? Number(opts.old_price) : null,
      discount: opts.discount || null,
      category_id: catMap[catSlug],
      sub_category_id: subMap[subSlug],
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      description: desc || `${name} prepared fresh with quality ingredients.`,
      weight: opts.weight || '1 Portion',
      prep_time: opts.prep_time || '10-15 mins',
      is_veg: true,
      is_egg: false,
      is_vegan: opts.is_vegan || false,
      is_available: true,
      is_active: true,
      is_new: opts.is_new || false,
      is_bestseller: opts.is_bestseller || false,
      tags: JSON.stringify(opts.tags || [name]),
      rating: opts.rating || 4.7,
      review_count: opts.review_count || 24,
      order_count: opts.order_count || 50,
      metadata: null,
      created_at: now,
      updated_at: now,
    };
  }

  // 3. Products (All 119 exact items from the menu photo)
  const products = [
    // --- 1. SANDWICH ---
    // Classic & Masala
    p('Butter Toast', 50, 'sandwich', 'sandwich-classic', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80', 'Crispy toasted golden bread generously topped with butter.', { tags: ['Toast', 'Butter', 'Breakfast'] }),
    p('Vegetable Sandwich', 70, 'sandwich', 'sandwich-classic', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', 'Classic sandwich packed with cucumber, tomato, onion and mild chutney.', { tags: ['Vegetable', 'Healthy', 'Snacks'] }),
    p('Aloo Masala', 70, 'sandwich', 'sandwich-classic', 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80', 'Seasoned mashed potato filling spiced with green chillies and coriander.', { tags: ['Aloo', 'Desi', 'Spicy'] }),
    p('Bombay Kachha', 70, 'sandwich', 'sandwich-classic', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', 'Authentic Mumbai style raw veggie sandwich layered with mint chutney.', { is_bestseller: true, tags: ['Bombay', 'Street Food'] }),
    p('Jain Sandwich', 70, 'sandwich', 'sandwich-classic', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', 'Pure Jain friendly recipe made without root vegetables.', { tags: ['Jain', 'Mild'] }),
    p('Chatni Masala', 70, 'sandwich', 'sandwich-classic', 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80', 'Tangy green chutney and aromatic chaat masala inside buttered bread.', { tags: ['Chutney', 'Tangy'] }),

    // Cheesy Sandwiches
    p('Bombay Kachha Cheese', 120, 'sandwich', 'sandwich-cheese', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', 'Mumbai street style sandwich topped with thick grated cheese.', { is_bestseller: true, tags: ['Bombay', 'Cheese'] }),
    p('Cheese Toast', 120, 'sandwich', 'sandwich-cheese', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80', 'Crispy toasted bread loaded with melted golden cheese.', { tags: ['Cheese', 'Toast'] }),
    p('Cheese Chatni', 120, 'sandwich', 'sandwich-cheese', 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80', 'Spicy coriander-mint chutney paired with rich processed cheese.', { tags: ['Cheese', 'Chutney'] }),
    p('Vegetable Cheese', 120, 'sandwich', 'sandwich-cheese', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', 'Fresh vegetables layered with mozzarella and spiced butter.', { is_bestseller: true, tags: ['Vegetable', 'Cheese'] }),
    p('Cheese & Chillie', 120, 'sandwich', 'sandwich-cheese', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', 'Finely chopped spicy green chillies toasted with melted cheese.', { tags: ['Chilli', 'Cheese', 'Spicy'] }),
    p('Cheesy Veg', 120, 'sandwich', 'sandwich-cheese', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', 'Crisp mixed veggies bound together with luscious liquid cheese.', { tags: ['Cheesy', 'Veg'] }),
    p('Cheese Masala', 120, 'sandwich', 'sandwich-cheese', 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80', 'Aromatic chaat spices blended with creamy melted cheese.', { tags: ['Cheese', 'Masala'] }),
    p('Aloo Makhani', 120, 'sandwich', 'sandwich-cheese', 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80', 'Rich makhani gravy aloo filling toasted with butter and cheese.', { tags: ['Makhani', 'Aloo'] }),
    p('Creamy Cheese', 120, 'sandwich', 'sandwich-cheese', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', 'Decadent double-cream cheese spread toasted to perfection.', { tags: ['Creamy', 'Cheese'] }),
    p('Tandoori Cheese', 120, 'sandwich', 'sandwich-cheese', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', 'Smoky tandoori seasoning infused with warm gooey cheese.', { tags: ['Tandoori', 'Cheese', 'Smoky'] }),
    p('Cole Slaw', 120, 'sandwich', 'sandwich-cheese', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', 'Crunchy cabbage and carrot in a creamy mayonnaise dressing.', { tags: ['Coleslaw', 'Cool'] }),
    p('Hot Chillie Toast', 120, 'sandwich', 'sandwich-cheese', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80', 'Fiery chillies toasted with garlic butter and herbs.', { tags: ['Spicy', 'Chilli', 'Hot'] }),
    p('Jam Cheese', 120, 'sandwich', 'sandwich-cheese', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80', 'Classic sweet mixed fruit jam paired with salty melted cheese.', { tags: ['Sweet', 'Jam', 'Cheese'] }),

    // Paneer Sandwiches
    p('Aachari Paneer', 120, 'sandwich', 'sandwich-paneer', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80', 'Tangy pickled achari spices infused in soft paneer cubes.', { tags: ['Paneer', 'Achari', 'Pickle'] }),
    p('Paneer Masala', 120, 'sandwich', 'sandwich-paneer', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80', 'Spiced cottage cheese filling grilled with bell peppers and onions.', { tags: ['Paneer', 'Masala'] }),
    p('Paneer Corn', 120, 'sandwich', 'sandwich-paneer', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80', 'Sweet American corn and soft paneer tossed in savory herbs.', { tags: ['Paneer', 'Corn'] }),
    p('Paneer Mayo', 120, 'sandwich', 'sandwich-paneer', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80', 'Creamy mayonnaise sauce coated over tender paneer slices.', { tags: ['Paneer', 'Mayo'] }),
    p('Paneer Tandoori', 120, 'sandwich', 'sandwich-paneer', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80', 'Tandoori-spiced paneer grilled with crunchy capsicum.', { is_bestseller: true, tags: ['Paneer', 'Tandoori'] }),
    p('Paneer Cheese', 170, 'sandwich', 'sandwich-paneer', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80', 'Double indulgence of rich cottage cheese and heavy mozzarella.', { is_bestseller: true, tags: ['Paneer', 'Cheese', 'Special'] }),

    // Special & Sweet Sandwiches
    p('Chocolate', 120, 'sandwich', 'sandwich-special', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', 'Warm toasted sandwich filled with rich melted chocolate.', { tags: ['Chocolate', 'Sweet', 'Dessert'] }),
    p('Corn Cheese', 130, 'sandwich', 'sandwich-special', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', 'Juicy golden sweet corn tossed with mozzarella cheese.', { tags: ['Corn', 'Cheese'] }),
    p('Indori Sandwich', 130, 'sandwich', 'sandwich-special', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', 'Signature Indore style spicy tangy sandwich with sev and seasoning.', { is_bestseller: true, tags: ['Indori', 'Sev', 'Spicy'] }),
    p('Peri Peri Cheese', 130, 'sandwich', 'sandwich-special', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', 'Spicy African peri peri seasoning infused in melted cheese.', { tags: ['Peri Peri', 'Cheese'] }),
    p('Nutella', 130, 'sandwich', 'sandwich-special', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', 'Toasted bread filled with generous layers of original Nutella hazelnut spread.', { is_bestseller: true, tags: ['Nutella', 'Sweet'] }),

    // --- 2. FRENCH FRIES ---
    p('Regular / Salted Fries', 100, 'french-fries', 'fries-all', 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80', 'Crispy golden potato fries lightly seasoned with sea salt.', { tags: ['Fries', 'Classic'] }),
    p('Peri Peri Fries', 130, 'french-fries', 'fries-all', 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80', 'Fries tossed in spicy and tangy African peri peri seasoning.', { is_bestseller: true, tags: ['Peri Peri', 'Spicy', 'Fries'] }),
    p('Cheesy Fries', 140, 'french-fries', 'fries-all', 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80', 'Crisp french fries smothered in warm creamy cheese sauce.', { tags: ['Cheese', 'Fries'] }),
    p('Schezwan Fries', 140, 'french-fries', 'fries-all', 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80', 'Golden fries tossed with spicy fiery Schezwan chutney.', { tags: ['Schezwan', 'Spicy'] }),
    p('Tandoori Fries', 140, 'french-fries', 'fries-all', 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80', 'Smoky tandoori marinated crisp fries.', { tags: ['Tandoori', 'Fries'] }),
    p('Mayo Fries', 140, 'french-fries', 'fries-all', 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80', 'Fries topped with creamy rich garlic mayonnaise dressing.', { tags: ['Mayo', 'Fries'] }),
    p('Peri Peri Cheese Fries', 180, 'french-fries', 'fries-all', 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80', 'Peri peri spiced fries drowned in warm melted cheese.', { is_bestseller: true, tags: ['Peri Peri', 'Cheese', 'Fries'] }),
    p('Pizza Fries', 180, 'french-fries', 'fries-all', 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80', 'Loaded fries topped with pizza sauce, veggies, oregano and mozzarella.', { is_bestseller: true, tags: ['Pizza', 'Fries', 'Loaded'] }),

    // --- 3. BURGER & HOTDOG ---
    p('Veg Burger', 100, 'burger-hotdog', 'burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', 'Crispy spiced vegetable patty topped with lettuce, onion, and signature burger sauce.', { tags: ['Burger', 'Veg'] }),
    p('Veg Cheese Burger', 120, 'burger-hotdog', 'burgers', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80', 'Crispy vegetable burger layered with an oozy slice of melted cheese.', { is_bestseller: true, tags: ['Burger', 'Cheese'] }),
    p('Paneer Burger', 120, 'burger-hotdog', 'burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', 'Marinated soft paneer patty grilled with herbs, tomatoes and sauces.', { tags: ['Paneer', 'Burger'] }),
    p('Paneer Cheese Burger', 140, 'burger-hotdog', 'burgers', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80', 'Gourmet paneer patty crowned with a slice of rich cheddar cheese.', { is_bestseller: true, tags: ['Paneer', 'Cheese', 'Burger'] }),
    p('Veg Hot Dog', 100, 'burger-hotdog', 'hotdogs', 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=600&q=80', 'Warm soft bun filled with a savoury spiced vegetable roll and house sauces.', { tags: ['Hot Dog', 'Veg'] }),
    p('Veg Cheese Hot Dog', 120, 'burger-hotdog', 'hotdogs', 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=600&q=80', 'Warm hot dog filled with savory spiced roll and drenched in cheese sauce.', { tags: ['Hot Dog', 'Cheese'] }),
    p('Paneer Hot Dog', 120, 'burger-hotdog', 'hotdogs', 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=600&q=80', 'Tender paneer filling tucked into a toasted hot dog bun with tangy toppings.', { tags: ['Paneer', 'Hot Dog'] }),
    p('Paneer Cheese Hot Dog', 140, 'burger-hotdog', 'hotdogs', 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=600&q=80', 'Signature paneer hot dog topped with melted cheese and fresh herbs.', { is_bestseller: true, tags: ['Paneer', 'Cheese', 'Hot Dog'] }),

    // --- 4. OPEN TOAST ---
    p('Chillie Garlic Open Toast', 150, 'open-toast', 'open-toast-all', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80', 'Crusty bread toasted with roasted garlic butter, green chillies, and herbs.', { tags: ['Garlic', 'Chilli', 'Toast'] }),
    p('Veg Cheese Open Toast', 150, 'open-toast', 'open-toast-all', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80', 'Open face toast loaded with diced peppers, onions, tomatoes and cheese.', { tags: ['Veg', 'Cheese', 'Toast'] }),
    p('Baked Beans Open Toast', 220, 'open-toast', 'open-toast-all', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80', 'Warm savory baked beans in tomato sauce spooned over cheese toast.', { tags: ['Baked Beans', 'Cheese'] }),
    p('Corn Potato Open Toast', 220, 'open-toast', 'open-toast-all', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80', 'Golden sweet corn and seasoned potatoes baked with cheese.', { tags: ['Corn', 'Potato', 'Cheese'] }),
    p('Paneer Makhani Open Toast', 220, 'open-toast', 'open-toast-all', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80', 'Rich paneer butter makhani spread across a crispy open toasted bread.', { is_bestseller: true, tags: ['Paneer', 'Makhani', 'Special'] }),
    p('Mushroom Open Toast', 220, 'open-toast', 'open-toast-all', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80', 'Sautéed garlic mushrooms seasoned with thyme and baked with cheese.', { tags: ['Mushroom', 'Cheese'] }),
    p('Peri Corn Open Toast', 220, 'open-toast', 'open-toast-all', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80', 'Spicy peri peri marinated corn baked on crusty bread with mozzarella.', { tags: ['Peri Peri', 'Corn'] }),

    // --- 5. PASTA ---
    p('White Sauce Pasta', 190, 'pasta', 'pasta-all', 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=600&q=80', 'Creamy rich Alfredo sauce pasta tossed with sauteed veggies and oregano.', { is_bestseller: true, tags: ['Pasta', 'Alfredo', 'White Sauce'] }),
    p('Red Sauce Pasta', 190, 'pasta', 'pasta-all', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80', 'Tangy Italian tomato arrabbiata pasta simmered with fresh basil and garlic.', { tags: ['Pasta', 'Arrabbiata', 'Red Sauce'] }),
    p('Pink Sauce Pasta', 190, 'pasta', 'pasta-all', 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=600&q=80', 'Delightful blend of creamy alfredo and tangy pomodoro sauce with pasta.', { is_bestseller: true, tags: ['Pasta', 'Pink Sauce', 'Chef Special'] }),
    p('Mac N Cheesy Pasta', 190, 'pasta', 'pasta-all', 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80', 'Elbow macaroni baked in rich melted cheddar cheese sauce.', { is_bestseller: true, tags: ['Mac N Cheese', 'Pasta'] }),
    p('Hot Garlic Sauce Pasta', 190, 'pasta', 'pasta-all', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80', 'Spicy pasta tossed in garlic infused chilli oil and roasted herbs.', { tags: ['Pasta', 'Garlic', 'Spicy'] }),

    // --- 6. MAGGI ---
    p('Masala Maggi', 70, 'maggi', 'maggi-all', 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80', 'Classic soul food Maggi noodles cooked with our special tastemaker.', { tags: ['Maggi', 'Classic'] }),
    p('Veg Maggi', 90, 'maggi', 'maggi-all', 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80', 'Maggi noodles tossed with fresh green peas, carrots, onions, and tomatoes.', { tags: ['Maggi', 'Vegetable'] }),
    p('Double Masala Maggi', 90, 'maggi', 'maggi-all', 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80', 'Extra spicy and punchy Maggi loaded with double seasonings.', { is_bestseller: true, tags: ['Maggi', 'Double Masala'] }),
    p('Butter Maggi', 90, 'maggi', 'maggi-all', 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80', 'Steaming hot Maggi noodles cooked with a dollop of fresh butter.', { tags: ['Maggi', 'Butter'] }),
    p('Cheese Maggi', 110, 'maggi', 'maggi-all', 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80', 'Hot Maggi topped with generous grated cheese that melts in your mouth.', { is_bestseller: true, tags: ['Maggi', 'Cheese'] }),
    p('Garlic Maggi', 110, 'maggi', 'maggi-all', 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80', 'Maggi infused with aromatic roasted garlic and fresh chillies.', { tags: ['Maggi', 'Garlic'] }),
    p('Corn Maggi', 110, 'maggi', 'maggi-all', 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80', 'Sweet juicy corn kernels tossed into boiling spiced Maggi.', { tags: ['Maggi', 'Corn'] }),
    p('D.M. Cheese Maggi', 130, 'maggi', 'maggi-all', 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80', 'Double Masala spicy Maggi smothered with creamy grated cheese.', { is_bestseller: true, tags: ['Maggi', 'Double Masala', 'Cheese'] }),
    p('Veg Tandoori Maggi', 140, 'maggi', 'maggi-all', 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80', 'Smoky tandoori sauce tossed with fresh veggies and noodles.', { tags: ['Maggi', 'Tandoori'] }),
    p('Punjabi Tadka Maggi', 140, 'maggi', 'maggi-all', 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80', 'Desi ghee garlic and cumin tadka infused into piping hot Maggi noodles.', { tags: ['Maggi', 'Punjabi', 'Tadka'] }),
    p('Punjabi Tadka Cheese', 180, 'maggi', 'maggi-all', 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80', 'Punjabi tadka Maggi finished with melted cheese and chilli flakes.', { is_bestseller: true, tags: ['Maggi', 'Punjabi', 'Cheese'] }),
    p('Mag N Cheese', 180, 'maggi', 'maggi-all', 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80', 'Creamy, thick cheese sauce cooked with Maggi for cheese lovers.', { is_bestseller: true, tags: ['Maggi', 'Cheese', 'Loaded'] }),
    p('Mushroom Maggi', 220, 'maggi', 'maggi-all', 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80', 'Sautéed mushrooms, herbs, and cheese cooked into flavorful Maggi noodles.', { tags: ['Maggi', 'Mushroom'] }),

    // --- 7. PIZZA ---
    p('Cheese Pizza', 160, 'pizza', 'pizza-all', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', 'Classic Margherita pizza with Italian tomato sauce and 100% mozzarella cheese.', { is_bestseller: true, tags: ['Pizza', 'Cheese', 'Margherita'] }),
    p('Cheese Capsicum Onion', 170, 'pizza', 'pizza-all', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', 'Crunchy bell peppers and sliced red onions on top of mozzarella cheese.', { tags: ['Pizza', 'Capsicum', 'Onion'] }),
    p('Corn Pizza', 220, 'pizza', 'pizza-all', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', 'Sweet golden corn kernels baked into a bubbly cheese crust.', { tags: ['Pizza', 'Corn'] }),
    p('Paneer Pizza', 220, 'pizza', 'pizza-all', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', 'Marinated tandoori paneer cubes, capsicum and melted mozzarella.', { is_bestseller: true, tags: ['Pizza', 'Paneer'] }),
    p('Mushroom Pizza', 220, 'pizza', 'pizza-all', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', 'Herbed button mushrooms with Italian spices and melted cheese.', { tags: ['Pizza', 'Mushroom'] }),
    p('Maggi Pizza', 220, 'pizza', 'pizza-all', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', 'Innovative fusion of cheesy baked pizza crust topped with seasoned Maggi.', { tags: ['Pizza', 'Maggi', 'Fusion'] }),

    // --- 8. COFFEE ---
    // Hot Coffee
    p('Black Hot Coffee', 40, 'coffee', 'coffee-hot', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', 'Pure intense black coffee brewed from freshly roasted beans.', { tags: ['Coffee', 'Black Coffee', 'Hot'] }),
    p('Hot Coffee', 70, 'coffee', 'coffee-hot', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80', 'Creamy frothed milk and strong aromatic espresso.', { is_bestseller: true, tags: ['Coffee', 'Hot'] }),
    p('Hot Coffee (Jumbo)', 90, 'coffee', 'coffee-hot', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80', 'Extra large mug of rich steaming hot frothed coffee.', { tags: ['Coffee', 'Jumbo'] }),
    p('Premium Hot Coffee', 100, 'coffee', 'coffee-hot', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80', 'Artisanal slow roasted blend with velvety crema.', { tags: ['Coffee', 'Premium'] }),
    p('Hot Hazelnut', 100, 'coffee', 'coffee-hot', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80', 'Steaming espresso infused with fragrant hazelnut essence.', { tags: ['Coffee', 'Hazelnut'] }),
    p('Hot Caramel', 100, 'coffee', 'coffee-hot', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80', 'Sweet buttery caramel syrup swirled into rich hot coffee.', { tags: ['Coffee', 'Caramel'] }),
    p('Hot Coffee Brownie', 120, 'coffee', 'coffee-hot', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80', 'Warm chocolate fudge brownie blended with hot espresso.', { tags: ['Coffee', 'Brownie'] }),

    // Cold Coffee
    p('Black Cold Coffee', 100, 'coffee', 'coffee-cold', 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80', 'Chilled iced Americano served crisp and bold over ice.', { tags: ['Cold Coffee', 'Iced'] }),
    p('Cold Coffee', 120, 'coffee', 'coffee-cold', 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80', 'Thick blended creamy cold coffee with chocolate drizzle.', { is_bestseller: true, tags: ['Cold Coffee', 'Classic'] }),
    p('Irish Cold Coffee', 150, 'coffee', 'coffee-cold', 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80', 'Non-alcoholic Irish cream notes shaken into velvety cold coffee.', { tags: ['Cold Coffee', 'Irish'] }),
    p('Creamy Chocolate Cold Coffee', 150, 'coffee', 'coffee-cold', 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80', 'Decadent chocolate sauce blended into thick cold coffee.', { is_bestseller: true, tags: ['Cold Coffee', 'Chocolate'] }),
    p('Cold Coffee with Ice-Cream', 150, 'coffee', 'coffee-cold', 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80', 'Cold coffee crowned with a rich scoop of vanilla ice cream.', { is_bestseller: true, tags: ['Cold Coffee', 'Ice Cream'] }),
    p('Lactose Free Cold Coffee', 170, 'coffee', 'coffee-cold', 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80', 'Smooth lactose-free blend perfect for sensitive diets.', { tags: ['Cold Coffee', 'Lactose Free'] }),
    p('Premium Cold Coffee', 170, 'coffee', 'coffee-cold', 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80', 'Ultra rich cold coffee made with gourmet beans and thick dairy.', { tags: ['Cold Coffee', 'Premium'] }),
    p('Cold Hazelnut', 170, 'coffee', 'coffee-cold', 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80', 'Chilled hazelnut frappe topped with crushed nuts and cocoa.', { tags: ['Cold Coffee', 'Hazelnut'] }),
    p('Caramel Cold Coffee', 170, 'coffee', 'coffee-cold', 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80', 'Sweet salted caramel blended with creamy iced coffee.', { tags: ['Cold Coffee', 'Caramel'] }),
    p('Brownie Cold Coffee', 170, 'coffee', 'coffee-cold', 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80', 'Real chocolate brownie blended inside thick cold coffee frappe.', { is_bestseller: true, tags: ['Cold Coffee', 'Brownie'] }),
    p('Decaf Cold Coffee', 170, 'coffee', 'coffee-cold', 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80', 'Rich refreshing cold coffee crafted from premium decaffeinated beans.', { tags: ['Cold Coffee', 'Decaf'] }),

    // --- 9. BEVERAGES ---
    // Warm / Teas
    p('Green Tea', 40, 'beverages', 'beverages-warm-tea', 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80', 'Soothing antioxidant-rich organic green tea brewed fresh.', { tags: ['Green Tea', 'Healthy'] }),
    p('Hot Chocolate', 100, 'beverages', 'beverages-warm-tea', 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&q=80', 'Warm comforting melted cocoa and steamed milk with marshmallows.', { is_bestseller: true, tags: ['Hot Chocolate', 'Sweet'] }),
    p('Hot Masala Milk', 100, 'beverages', 'beverages-warm-tea', 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80', 'Traditional Indian spiced milk with saffron, almonds, and cardamom.', { tags: ['Masala Milk', 'Desi'] }),
    p('Lemon Iced Tea', 100, 'beverages', 'beverages-warm-tea', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80', 'Chilled black tea infused with fresh tangy lemon and mint.', { is_bestseller: true, tags: ['Iced Tea', 'Lemon'] }),
    p('Peach Iced Tea', 100, 'beverages', 'beverages-warm-tea', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80', 'Sweet peach syrup and freshly steeped tea shaken over ice.', { tags: ['Iced Tea', 'Peach'] }),
    p('Fresh Lime Soda', 100, 'beverages', 'beverages-warm-tea', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', 'Crisp sparkling soda mixed with fresh lime juice, salt and sweet syrup.', { tags: ['Lime Soda', 'Cooler'] }),
    p('Hot Chocolate Brownie', 150, 'beverages', 'beverages-warm-tea', 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&q=80', 'Thick hot chocolate served with a rich fudge brownie soaked inside.', { tags: ['Hot Chocolate', 'Brownie'] }),

    // Shakes & Coolers
    p('Strawberry Milkshake', 120, 'beverages', 'beverages-shakes', 'https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=600&q=80', 'Sweet refreshing milkshake blended with strawberries and vanilla ice cream.', { tags: ['Milkshake', 'Strawberry'] }),
    p('Kiwi Milkshake', 120, 'beverages', 'beverages-shakes', 'https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=600&q=80', 'Tangy sweet green kiwi blended with chilled milk and cream.', { tags: ['Milkshake', 'Kiwi'] }),
    p('Mango Milkshake', 120, 'beverages', 'beverages-shakes', 'https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=600&q=80', 'Golden Alphonso mango pulp blended into thick creamy milkshake.', { is_bestseller: true, tags: ['Milkshake', 'Mango'] }),
    p('Banana Milkshake', 120, 'beverages', 'beverages-shakes', 'https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=600&q=80', 'Nutritious ripe bananas blended with creamy cold milk and honey.', { tags: ['Milkshake', 'Banana'] }),
    p('Chocolate Shake', 140, 'beverages', 'beverages-shakes', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80', 'Rich cocoa fudge and vanilla ice cream blended thick.', { tags: ['Milkshake', 'Chocolate'] }),
    p('Vanilla Shake', 140, 'beverages', 'beverages-shakes', 'https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=600&q=80', 'Classic Madagascar vanilla bean ice cream blended into smooth shake.', { tags: ['Milkshake', 'Vanilla'] }),
    p('Oreo Shake', 180, 'beverages', 'beverages-shakes', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80', 'Crushed crunchy Oreo cookies blended with chocolate and milk.', { is_bestseller: true, tags: ['Milkshake', 'Oreo'] }),
    p('Kit Kat Shake', 180, 'beverages', 'beverages-shakes', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80', 'Crispy Kit Kat wafer bars blended into rich creamy milkshake.', { is_bestseller: true, tags: ['Milkshake', 'Kit Kat'] }),
    p('Paan Shake', 180, 'beverages', 'beverages-shakes', 'https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=600&q=80', 'Aromatic betel leaf and gulkand infused milkshake with a refreshing taste.', { tags: ['Milkshake', 'Paan', 'Special'] }),
    p('Anjeer Shake', 180, 'beverages', 'beverages-shakes', 'https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=600&q=80', 'Sweet dried figs (anjeer) blended with wholesome milk and nuts.', { tags: ['Milkshake', 'Anjeer', 'Healthy'] }),
    p('Cold Masala Milk', 180, 'beverages', 'beverages-shakes', 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80', 'Chilled spiced milk flavored with saffron, pistachios, and almonds.', { tags: ['Masala Milk', 'Desi', 'Cold'] }),
    p('Nutella Milk Shake', 180, 'beverages', 'beverages-shakes', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80', 'Generous scoops of Nutella hazelnut spread blended with vanilla ice cream.', { is_bestseller: true, tags: ['Milkshake', 'Nutella'] }),
    p('Strawberry Cookies Shake', 180, 'beverages', 'beverages-shakes', 'https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=600&q=80', 'Fresh strawberries and crunchy buttery cookies blended together.', { tags: ['Milkshake', 'Strawberry', 'Cookies'] }),
    p('Nutella Kit Kat Shake', 250, 'beverages', 'beverages-shakes', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80', 'Ultimate fusion of Nutella and Kit Kat bars topped with chocolate whipped cream.', { is_bestseller: true, tags: ['Milkshake', 'Nutella', 'Kit Kat', 'Monster Shake'] }),

    // --- 10. ICE-CREAM FLOAT ---
    p('Coke Float', 120, 'ice-cream-float', 'float-all', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80', 'Chilled fizzy Coca-Cola topped with a generous scoop of vanilla ice cream.', { tags: ['Float', 'Coke', 'Ice Cream'] }),
    p('Orange Float', 120, 'ice-cream-float', 'float-all', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80', 'Sparkling orange soda paired with smooth creamy vanilla ice cream.', { tags: ['Float', 'Orange', 'Ice Cream'] }),

    // --- 11. ICE-CREAM SODA ---
    p('Rose Soda', 120, 'ice-cream-soda', 'soda-all', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', 'Fragrant rose syrup infused in fizzy chilled soda with vanilla ice cream.', { tags: ['Soda', 'Rose'] }),
    p('Khus Soda', 120, 'ice-cream-soda', 'soda-all', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', 'Cooling green vetiver (khus) essence mixed with sparkling soda.', { tags: ['Soda', 'Khus'] }),
    p('Lemon Soda', 120, 'ice-cream-soda', 'soda-all', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', 'Tangy fresh citrus lemon syrup in sparkling soda and ice cream.', { tags: ['Soda', 'Lemon'] }),
    p('Orange Soda', 120, 'ice-cream-soda', 'soda-all', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', 'Sweet orange syrup charged with bubbles and vanilla ice cream.', { tags: ['Soda', 'Orange'] }),
  ];

  // 4. Banners
  const banners = [
    {
      id: uuidv4(),
      title: 'Crispy Grilled & Toasted Sandwiches',
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=80',
      link: '/category/sandwich',
      sort_order: 1,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      title: 'Hand-Tossed Cheesy Pizzas & Pastas',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
      link: '/category/pizza',
      sort_order: 2,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      title: 'Thick Gourmet Shakes & Cold Coffees',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=80',
      link: '/category/coffee',
      sort_order: 3,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
  ];

  // 5. Dish of the Day (Selected top sellers from the new menu)
  const dishesOfTheDay = [
    {
      id: uuidv4(),
      product_id: products[24].id, // Paneer Cheese Sandwich
      name: 'Paneer Cheese Grilled Sandwich',
      price: 170.00,
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
      sort_order: 1,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      product_id: products[52].id, // Pink Sauce Pasta
      name: 'Chef Special Pink Sauce Pasta',
      price: 190.00,
      image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=800&q=80',
      sort_order: 2,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      product_id: products[114].id, // Nutella Kit Kat Shake
      name: 'Monster Nutella Kit Kat Shake',
      price: 250.00,
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
      sort_order: 3,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
  ];

  // 6. Offers
  const offers = [
    {
      id: uuidv4(),
      title: 'Flat 15% OFF on Sandwiches',
      description: 'Get 15% discount on all grilled and cheesy sandwiches!',
      discount_type: 'percentage',
      discount_value: 15.00,
      start_date: now,
      end_date: oneMonthLater,
      offer_kind: 'menu',
      applicable_to: 'categories',
      category_ids: JSON.stringify([catMap['sandwich']]),
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      title: 'Combo Special: Shake & Fries',
      description: 'Order any shake and get ₹30 off on fries.',
      discount_type: 'fixed',
      discount_value: 30.00,
      start_date: now,
      end_date: oneMonthLater,
      offer_kind: 'menu',
      applicable_to: 'all',
      image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
      is_active: true,
      created_at: now,
      updated_at: now,
    },
  ];

  return {
    categories,
    subCategories,
    products,
    banners,
    dishesOfTheDay,
    offers,
  };
}

module.exports = {
  getMenuData,
};
