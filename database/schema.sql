-- ============================================================
-- AI COOKING ASSISTANT
-- DATABASE SCHEMA
-- ============================================================
-- Database: PostgreSQL
-- Purpose: Users, recipes, states, districts, ingredients,
--          festivals, cuisines, submissions, favorites,
--          recipe history and admin management.
-- ============================================================


-- ============================================================
-- 1. EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================
-- 2. USERS
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL,

    mobile VARCHAR(15) NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    role VARCHAR(20) NOT NULL DEFAULT 'user'
        CHECK (role IN ('user', 'admin')),

    is_verified BOOLEAN NOT NULL DEFAULT FALSE,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    profile_photo TEXT,

    submitted_recipe_count INTEGER NOT NULL DEFAULT 0,

    last_login_at TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 3. STATES
-- ============================================================

CREATE TABLE IF NOT EXISTS states (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,

    capital VARCHAR(100),

    region VARCHAR(50),

    image_url TEXT,

    description TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 4. DISTRICTS
-- ============================================================

CREATE TABLE IF NOT EXISTS districts (
    id SERIAL PRIMARY KEY,

    state_id INTEGER NOT NULL,

    name VARCHAR(100) NOT NULL,

    image_url TEXT,

    description TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_district_state
        FOREIGN KEY (state_id)
        REFERENCES states(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_state_district
        UNIQUE (state_id, name)
);


-- ============================================================
-- 5. CUISINES
-- ============================================================

CREATE TABLE IF NOT EXISTS cuisines (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,

    description TEXT,

    image_url TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 6. FESTIVALS
-- ============================================================

CREATE TABLE IF NOT EXISTS festivals (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,

    description TEXT,

    image_url TEXT,

    start_date DATE,

    end_date DATE,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 7. RECIPE CATEGORIES
-- ============================================================

CREATE TABLE IF NOT EXISTS recipe_categories (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,

    description TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 8. RECIPES
-- ============================================================

CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title VARCHAR(200) NOT NULL,

    slug VARCHAR(220) NOT NULL UNIQUE,

    description TEXT,

    state_id INTEGER,

    district_id INTEGER,

    cuisine_id INTEGER,

    category_id INTEGER,

    festival_id INTEGER,

    image_url TEXT,

    video_url TEXT,

    prep_time_minutes INTEGER DEFAULT 0,

    cook_time_minutes INTEGER DEFAULT 0,

    total_time_minutes INTEGER DEFAULT 0,

    servings INTEGER DEFAULT 1,

    difficulty VARCHAR(20) DEFAULT 'Medium'
        CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),

    is_vegetarian BOOLEAN NOT NULL DEFAULT FALSE,

    is_vegan BOOLEAN NOT NULL DEFAULT FALSE,

    is_famous BOOLEAN NOT NULL DEFAULT FALSE,

    is_featured BOOLEAN NOT NULL DEFAULT FALSE,

    is_published BOOLEAN NOT NULL DEFAULT FALSE,

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (
            status IN (
                'draft',
                'pending',
                'approved',
                'rejected',
                'archived'
            )
        ),

    views_count INTEGER NOT NULL DEFAULT 0,

    likes_count INTEGER NOT NULL DEFAULT 0,

    created_by UUID,

    approved_by UUID,

    approved_at TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_recipe_state
        FOREIGN KEY (state_id)
        REFERENCES states(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_recipe_district
        FOREIGN KEY (district_id)
        REFERENCES districts(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_recipe_cuisine
        FOREIGN KEY (cuisine_id)
        REFERENCES cuisines(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_recipe_category
        FOREIGN KEY (category_id)
        REFERENCES recipe_categories(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_recipe_festival
        FOREIGN KEY (festival_id)
        REFERENCES festivals(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_recipe_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_recipe_approved_by
        FOREIGN KEY (approved_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);


-- ============================================================
-- 9. RECIPE INGREDIENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS ingredients (
    id SERIAL PRIMARY KEY,

    name VARCHAR(150) NOT NULL UNIQUE,

    description TEXT,

    image_url TEXT,

    category VARCHAR(100),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 10. RECIPE INGREDIENT MAPPING
-- ============================================================

CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id SERIAL PRIMARY KEY,

    recipe_id UUID NOT NULL,

    ingredient_id INTEGER,

    ingredient_name VARCHAR(150) NOT NULL,

    quantity VARCHAR(100),

    unit VARCHAR(50),

    optional BOOLEAN NOT NULL DEFAULT FALSE,

    sort_order INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT fk_recipe_ingredient_recipe
        FOREIGN KEY (recipe_id)
        REFERENCES recipes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_recipe_ingredient
        FOREIGN KEY (ingredient_id)
        REFERENCES ingredients(id)
        ON DELETE SET NULL
);


-- ============================================================
-- 11. RECIPE COOKING STEPS
-- ============================================================

CREATE TABLE IF NOT EXISTS recipe_steps (
    id SERIAL PRIMARY KEY,

    recipe_id UUID NOT NULL,

    step_number INTEGER NOT NULL,

    title VARCHAR(200),

    instruction TEXT NOT NULL,

    image_url TEXT,

    video_url TEXT,

    CONSTRAINT fk_recipe_step_recipe
        FOREIGN KEY (recipe_id)
        REFERENCES recipes(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_recipe_step
        UNIQUE (recipe_id, step_number)
);


-- ============================================================
-- 12. USER FAVORITES
-- ============================================================

CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,

    user_id UUID NOT NULL,

    recipe_id UUID NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_favorite_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_favorite_recipe
        FOREIGN KEY (recipe_id)
        REFERENCES recipes(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_user_favorite
        UNIQUE (user_id, recipe_id)
);


-- ============================================================
-- 13. RECIPE HISTORY
-- ============================================================

CREATE TABLE IF NOT EXISTS recipe_history (
    id SERIAL PRIMARY KEY,

    user_id UUID NOT NULL,

    recipe_id UUID NOT NULL,

    viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_history_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_history_recipe
        FOREIGN KEY (recipe_id)
        REFERENCES recipes(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 14. USER RECIPE SUBMISSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS recipe_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    recipe_id UUID,

    title VARCHAR(200) NOT NULL,

    description TEXT,

    state_id INTEGER,

    district_id INTEGER,

    cuisine_id INTEGER,

    category_id INTEGER,

    festival_id INTEGER,

    prep_time_minutes INTEGER DEFAULT 0,

    cook_time_minutes INTEGER DEFAULT 0,

    servings INTEGER DEFAULT 1,

    difficulty VARCHAR(20) DEFAULT 'Medium'
        CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),

    ingredients JSONB NOT NULL DEFAULT '[]',

    steps JSONB NOT NULL DEFAULT '[]',

    image_url TEXT,

    video_url TEXT,

    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (
            status IN (
                'pending',
                'approved',
                'rejected'
            )
        ),

    admin_note TEXT,

    reviewed_by UUID,

    reviewed_at TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_submission_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_submission_recipe
        FOREIGN KEY (recipe_id)
        REFERENCES recipes(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_submission_state
        FOREIGN KEY (state_id)
        REFERENCES states(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_submission_district
        FOREIGN KEY (district_id)
        REFERENCES districts(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_submission_cuisine
        FOREIGN KEY (cuisine_id)
        REFERENCES cuisines(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_submission_category
        FOREIGN KEY (category_id)
        REFERENCES recipe_categories(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_submission_festival
        FOREIGN KEY (festival_id)
        REFERENCES festivals(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_submission_reviewer
        FOREIGN KEY (reviewed_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);


-- ============================================================
-- 15. OTP VERIFICATION
-- ============================================================

CREATE TABLE IF NOT EXISTS otp_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    mobile VARCHAR(15) NOT NULL,

    otp_code VARCHAR(10) NOT NULL,

    purpose VARCHAR(30) NOT NULL
        CHECK (
            purpose IN (
                'signup',
                'login',
                'forgot_password',
                'change_mobile'
            )
        ),

    expires_at TIMESTAMP NOT NULL,

    is_verified BOOLEAN NOT NULL DEFAULT FALSE,

    attempts INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 16. USER LOGIN SESSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    token_hash TEXT NOT NULL UNIQUE,

    ip_address INET,

    user_agent TEXT,

    expires_at TIMESTAMP NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_session_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 17. AI CHAT HISTORY
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID,

    title VARCHAR(200),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ai_session_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS ai_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    session_id UUID NOT NULL,

    role VARCHAR(20) NOT NULL
        CHECK (
            role IN (
                'user',
                'assistant',
                'system'
            )
        ),

    message TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ai_message_session
        FOREIGN KEY (session_id)
        REFERENCES ai_chat_sessions(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 18. AI GENERATED RECIPES
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_generated_recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID,

    title VARCHAR(200) NOT NULL,

    ingredients JSONB NOT NULL DEFAULT '[]',

    steps JSONB NOT NULL DEFAULT '[]',

    preferences JSONB NOT NULL DEFAULT '{}',

    ai_provider VARCHAR(50),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ai_recipe_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);


-- ============================================================
-- 19. INGREDIENT SUBSTITUTIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS ingredient_substitutions (
    id SERIAL PRIMARY KEY,

    ingredient_id INTEGER NOT NULL,

    substitute_name VARCHAR(150) NOT NULL,

    ratio VARCHAR(100),

    notes TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_substitution_ingredient
        FOREIGN KEY (ingredient_id)
        REFERENCES ingredients(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 20. IMAGE AI ANALYSIS
-- ============================================================

CREATE TABLE IF NOT EXISTS image_ai_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID,

    image_url TEXT NOT NULL,

    detected_food VARCHAR(200),

    detected_ingredients JSONB DEFAULT '[]',

    suggested_recipes JSONB DEFAULT '[]',

    ai_response JSONB DEFAULT '{}',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_image_analysis_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);


-- ============================================================
-- 21. RECIPE REVIEWS
-- ============================================================

CREATE TABLE IF NOT EXISTS recipe_reviews (
    id SERIAL PRIMARY KEY,

    user_id UUID NOT NULL,

    recipe_id UUID NOT NULL,

    rating INTEGER NOT NULL
        CHECK (rating BETWEEN 1 AND 5),

    review TEXT,

    is_approved BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_recipe
        FOREIGN KEY (recipe_id)
        REFERENCES recipes(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_user_recipe_review
        UNIQUE (user_id, recipe_id)
);


-- ============================================================
-- 22. ADMIN ACTIVITY LOG
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    admin_id UUID NOT NULL,

    action VARCHAR(100) NOT NULL,

    target_type VARCHAR(100),

    target_id VARCHAR(100),

    description TEXT,

    ip_address INET,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_admin_log_user
        FOREIGN KEY (admin_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 23. MEDIA / UPLOADS
-- ============================================================

CREATE TABLE IF NOT EXISTS media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    uploaded_by UUID,

    file_name VARCHAR(255) NOT NULL,

    original_name VARCHAR(255),

    file_type VARCHAR(100),

    file_size BIGINT,

    file_url TEXT NOT NULL,

    media_type VARCHAR(30)
        CHECK (
            media_type IN (
                'image',
                'video',
                'audio',
                'document'
            )
        ),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_media_user
        FOREIGN KEY (uploaded_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);


-- ============================================================
-- 24. SITE SETTINGS
-- ============================================================

CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,

    setting_key VARCHAR(150) NOT NULL UNIQUE,

    setting_value TEXT,

    setting_type VARCHAR(30) DEFAULT 'text',

    description TEXT,

    updated_by UUID,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_setting_admin
        FOREIGN KEY (updated_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);


-- ============================================================
-- 25. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_users_mobile
ON users(mobile);

CREATE INDEX IF NOT EXISTS idx_users_role
ON users(role);

CREATE INDEX IF NOT EXISTS idx_users_active
ON users(is_active);

CREATE INDEX IF NOT EXISTS idx_states_name
ON states(name);

CREATE INDEX IF NOT EXISTS idx_districts_state
ON districts(state_id);

CREATE INDEX IF NOT EXISTS idx_districts_name
ON districts(name);

CREATE INDEX IF NOT EXISTS idx_recipes_title
ON recipes(title);

CREATE INDEX IF NOT EXISTS idx_recipes_state
ON recipes(state_id);

CREATE INDEX IF NOT EXISTS idx_recipes_district
ON recipes(district_id);

CREATE INDEX IF NOT EXISTS idx_recipes_cuisine
ON recipes(cuisine_id);

CREATE INDEX IF NOT EXISTS idx_recipes_category
ON recipes(category_id);

CREATE INDEX IF NOT EXISTS idx_recipes_famous
ON recipes(is_famous);

CREATE INDEX IF NOT EXISTS idx_recipes_featured
ON recipes(is_featured);

CREATE INDEX IF NOT EXISTS idx_recipes_published
ON recipes(is_published);

CREATE INDEX IF NOT EXISTS idx_recipes_status
ON recipes(status);

CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe
ON recipe_ingredients(recipe_id);

CREATE INDEX IF NOT EXISTS idx_recipe_steps_recipe
ON recipe_steps(recipe_id);

CREATE INDEX IF NOT EXISTS idx_favorites_user
ON favorites(user_id);

CREATE INDEX IF NOT EXISTS idx_favorites_recipe
ON favorites(recipe_id);

CREATE INDEX IF NOT EXISTS idx_history_user
ON recipe_history(user_id);

CREATE INDEX IF NOT EXISTS idx_submissions_user
ON recipe_submissions(user_id);

CREATE INDEX IF NOT EXISTS idx_submissions_status
ON recipe_submissions(status);

CREATE INDEX IF NOT EXISTS idx_otp_mobile
ON otp_verifications(mobile);

CREATE INDEX IF NOT EXISTS idx_sessions_user
ON user_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_ai_sessions_user
ON ai_chat_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_ai_messages_session
ON ai_chat_messages(session_id);


-- ============================================================
-- 26. DEFAULT RECIPE CATEGORIES
-- ============================================================

INSERT INTO recipe_categories (name, description)
VALUES
    ('Breakfast', 'Breakfast recipes'),
    ('Lunch', 'Lunch recipes'),
    ('Dinner', 'Dinner recipes'),
    ('Snack', 'Snack recipes'),
    ('Dessert', 'Sweet and dessert recipes'),
    ('Main Course', 'Main course recipes'),
    ('Street Food', 'Indian and international street food'),
    ('Beverage', 'Drinks and beverages'),
    ('Festival', 'Festival special recipes'),
    ('Vegetarian', 'Vegetarian recipes'),
    ('Non-Vegetarian', 'Non-vegetarian recipes'),
    ('Quick Recipes', 'Recipes that can be prepared quickly')
ON CONFLICT (name) DO NOTHING;


-- ============================================================
-- 27. DEFAULT CUISINES
-- ============================================================

INSERT INTO cuisines (name, description)
VALUES
    ('Odia', 'Traditional cuisine of Odisha'),
    ('Bihari', 'Traditional cuisine of Bihar'),
    ('Punjabi', 'Traditional Punjabi cuisine'),
    ('Bengali', 'Traditional Bengali cuisine'),
    ('Maharashtrian', 'Traditional cuisine of Maharashtra'),
    ('South Indian', 'South Indian cuisine'),
    ('Gujarati', 'Traditional Gujarati cuisine'),
    ('Rajasthani', 'Traditional Rajasthani cuisine'),
    ('Kashmiri', 'Traditional Kashmiri cuisine'),
    ('Hyderabadi', 'Traditional Hyderabadi cuisine'),
    ('Chinese', 'Chinese cuisine'),
    ('Italian', 'Italian cuisine'),
    ('Mexican', 'Mexican cuisine'),
    ('Thai', 'Thai cuisine'),
    ('Japanese', 'Japanese cuisine'),
    ('American', 'American cuisine')
ON CONFLICT (name) DO NOTHING;


-- ============================================================
-- 28. DEFAULT FESTIVALS
-- ============================================================

INSERT INTO festivals (name, description)
VALUES
    ('Diwali', 'Festival of Lights special recipes'),
    ('Holi', 'Holi special recipes'),
    ('Dussehra', 'Dussehra special recipes'),
    ('Durga Puja', 'Durga Puja special recipes'),
    ('Ganesh Chaturthi', 'Ganesh Chaturthi special recipes'),
    ('Makar Sankranti', 'Makar Sankranti special recipes'),
    ('Raksha Bandhan', 'Raksha Bandhan special recipes'),
    ('Eid', 'Eid special recipes'),
    ('Christmas', 'Christmas special recipes'),
    ('Pongal', 'Pongal special recipes'),
    ('Onam', 'Onam special recipes'),
    ('Janmashtami', 'Janmashtami special recipes'),
    ('Navratri', 'Navratri special recipes')
ON CONFLICT (name) DO NOTHING;


-- ============================================================
-- 29. DEFAULT SITE SETTINGS
-- ============================================================

INSERT INTO site_settings
    (setting_key, setting_value, setting_type, description)
VALUES
    (
        'site_name',
        'AI Cooking Assistant',
        'text',
        'Website name'
    ),
    (
        'site_description',
        'AI-powered cooking assistant for Indian and international recipes.',
        'text',
        'Website description'
    ),
    (
        'default_language',
        'en',
        'text',
        'Default website language'
    ),
    (
        'supported_languages',
        'English,Hindi,Odia',
        'text',
        'Supported languages'
    ),
    (
        'ai_enabled',
        'true',
        'boolean',
        'Enable AI features'
    ),
    (
        'voice_enabled',
        'true',
        'boolean',
        'Enable voice assistant'
    ),
    (
        'image_ai_enabled',
        'true',
        'boolean',
        'Enable image recipe AI'
    )
ON CONFLICT (setting_key) DO NOTHING;


-- ============================================================
-- 30. UPDATED_AT TRIGGER FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- 31. UPDATED_AT TRIGGERS
-- ============================================================

DROP TRIGGER IF EXISTS update_users_updated_at
ON users;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


DROP TRIGGER IF EXISTS update_states_updated_at
ON states;

CREATE TRIGGER update_states_updated_at
BEFORE UPDATE ON states
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


DROP TRIGGER IF EXISTS update_districts_updated_at
ON districts;

CREATE TRIGGER update_districts_updated_at
BEFORE UPDATE ON districts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


DROP TRIGGER IF EXISTS update_cuisines_updated_at
ON cuisines;

CREATE TRIGGER update_cuisines_updated_at
BEFORE UPDATE ON cuisines
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


DROP TRIGGER IF EXISTS update_festivals_updated_at
ON festivals;

CREATE TRIGGER update_festivals_updated_at
BEFORE UPDATE ON festivals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


DROP TRIGGER IF EXISTS update_recipes_updated_at
ON recipes;

CREATE TRIGGER update_recipes_updated_at
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


DROP TRIGGER IF EXISTS update_submissions_updated_at
ON recipe_submissions;

CREATE TRIGGER update_submissions_updated_at
BEFORE UPDATE ON recipe_submissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


DROP TRIGGER IF EXISTS update_reviews_updated_at
ON recipe_reviews;

CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON recipe_reviews
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- 32. USEFUL VIEWS
-- ============================================================

CREATE OR REPLACE VIEW published_recipes AS
SELECT
    r.id,
    r.title,
    r.slug,
    r.description,
    r.image_url,
    r.video_url,
    r.prep_time_minutes,
    r.cook_time_minutes,
    r.total_time_minutes,
    r.servings,
    r.difficulty,
    r.is_vegetarian,
    r.is_vegan,
    r.is_famous,
    r.is_featured,
    s.name AS state_name,
    d.name AS district_name,
    c.name AS cuisine_name,
    rc.name AS category_name,
    f.name AS festival_name
FROM recipes r
LEFT JOIN states s
    ON r.state_id = s.id
LEFT JOIN districts d
    ON r.district_id = d.id
LEFT JOIN cuisines c
    ON r.cuisine_id = c.id
LEFT JOIN recipe_categories rc
    ON r.category_id = rc.id
LEFT JOIN festivals f
    ON r.festival_id = f.id
WHERE
    r.is_published = TRUE
    AND r.status = 'approved';


-- ============================================================
-- 33. ADMIN DASHBOARD STATISTICS VIEW
-- ============================================================

CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM users) AS total_users,

    (SELECT COUNT(*)
     FROM users
     WHERE role = 'admin') AS total_admins,

    (SELECT COUNT(*) FROM recipes) AS total_recipes,

    (SELECT COUNT(*)
     FROM recipes
     WHERE status = 'approved') AS approved_recipes,

    (SELECT COUNT(*)
     FROM recipes
     WHERE status = 'pending') AS pending_recipes,

    (SELECT COUNT(*)
     FROM recipe_submissions
     WHERE status = 'pending') AS pending_submissions,

    (SELECT COUNT(*) FROM states) AS total_states,

    (SELECT COUNT(*) FROM districts) AS total_districts,

    (SELECT COUNT(*) FROM cuisines) AS total_cuisines,

    (SELECT COUNT(*) FROM festivals) AS total_festivals;


-- ============================================================
-- 34. SAMPLE ADMIN USER
-- ============================================================
-- IMPORTANT:
-- The password below is only a PLACEHOLDER HASH.
-- The real admin password should be generated by the backend.
--
-- Do NOT put a plain-text password in this SQL file.
--
-- The backend admin creation route should create the first
-- admin securely using bcrypt/argon2.
-- ============================================================


-- ============================================================
-- 35. FINAL DATABASE CHECK
-- ============================================================

SELECT 'AI Cooking Assistant database schema loaded successfully.'
AS message;