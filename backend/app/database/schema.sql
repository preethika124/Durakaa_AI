-- PostgreSQL + pgvector Schema for DARUKAA.EARTH
-- Production database configuration adhering to Section 21

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'researcher',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Environmental Profiles
CREATE TABLE IF NOT EXISTS environmental_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    profile_name VARCHAR(255) DEFAULT 'Current Farm / Ecosystem',
    region VARCHAR(255),
    country VARCHAR(255),
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    climate_zone VARCHAR(100),
    metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Conversations
CREATE TABLE IF NOT EXISTS conversations (
    id VARCHAR(100) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) DEFAULT 'Biodiversity Consultation',
    environmental_profile JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Messages
CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(100) PRIMARY KEY,
    conversation_id VARCHAR(100) REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    analysis JSONB,
    clarification_prompt JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Knowledge Documents
CREATE TABLE IF NOT EXISTS knowledge_documents (
    id VARCHAR(100) PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    domain VARCHAR(100) NOT NULL,
    problem TEXT NOT NULL,
    description TEXT NOT NULL,
    mechanisms JSONB DEFAULT '[]'::jsonb,
    affects_metrics JSONB DEFAULT '[]'::jsonb,
    conditions JSONB DEFAULT '{}'::jsonb,
    expected_time_horizon VARCHAR(50),
    time_horizon_detail TEXT,
    evidence JSONB DEFAULT '[]'::jsonb,
    embedding vector(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Knowledge Chunks with Vector Embeddings
CREATE TABLE IF NOT EXISTS knowledge_chunks (
    id VARCHAR(150) PRIMARY KEY,
    document_id VARCHAR(100) REFERENCES knowledge_documents(id) ON DELETE CASCADE,
    topic VARCHAR(255) NOT NULL,
    domain VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    metrics JSONB DEFAULT '[]'::jsonb,
    source VARCHAR(255) NOT NULL,
    source_url TEXT NOT NULL,
    publication_year VARCHAR(20),
    metadata JSONB DEFAULT '{}'::jsonb,
    embedding vector(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for vector similarity and metadata filtering
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_vector 
ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 20);

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_domain ON knowledge_chunks(domain);
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_metrics ON knowledge_chunks USING gin (metrics);

-- 7. Recommendations
CREATE TABLE IF NOT EXISTS recommendations (
    id VARCHAR(100) PRIMARY KEY,
    conversation_id VARCHAR(100) REFERENCES conversations(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    why_it_works TEXT NOT NULL,
    metrics JSONB NOT NULL,
    time_horizon VARCHAR(100),
    confidence VARCHAR(20),
    confidence_score NUMERIC(4, 3),
    conditions TEXT,
    limitations TEXT,
    evidence JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Evidence Sources
CREATE TABLE IF NOT EXISTS evidence_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_name VARCHAR(255) NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    publication_year INT,
    evidence_type VARCHAR(100),
    credibility_weight NUMERIC(3, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Retrieval Logs
CREATE TABLE IF NOT EXISTS retrieval_logs (
    id VARCHAR(100) PRIMARY KEY,
    query TEXT NOT NULL,
    retrieved_documents JSONB DEFAULT '[]'::jsonb,
    similarity_scores JSONB DEFAULT '[]'::jsonb,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
