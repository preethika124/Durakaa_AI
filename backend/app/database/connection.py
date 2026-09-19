import sqlite3
import os
from pathlib import Path

DB_PATH = os.environ.get("DARUKAA_DB_PATH", "backend/data/darukaa.db")

def get_db_connection():
    Path(DB_PATH).parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Conversations
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        title TEXT DEFAULT 'Biodiversity Consultation',
        environmental_profile TEXT DEFAULT '{}',
        created_at TEXT,
        updated_at TEXT
    )
    """)

    # Messages
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        analysis TEXT,
        clarification_prompt TEXT,
        created_at TEXT,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    )
    """)

    # Knowledge Documents
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS knowledge_documents (
        id TEXT PRIMARY KEY,
        topic TEXT NOT NULL,
        domain TEXT NOT NULL,
        problem TEXT NOT NULL,
        description TEXT NOT NULL,
        mechanisms TEXT,
        affects_metrics TEXT,
        conditions TEXT,
        expected_time_horizon TEXT,
        time_horizon_detail TEXT,
        evidence TEXT,
        embedding TEXT,
        created_at TEXT
    )
    """)

    # Knowledge Chunks
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS knowledge_chunks (
        id TEXT PRIMARY KEY,
        document_id TEXT,
        topic TEXT NOT NULL,
        domain TEXT NOT NULL,
        content TEXT NOT NULL,
        metrics TEXT,
        source TEXT,
        source_url TEXT,
        publication_year TEXT,
        metadata TEXT,
        embedding TEXT,
        FOREIGN KEY (document_id) REFERENCES knowledge_documents(id) ON DELETE CASCADE
    )
    """)

    # Evidence Sources
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS evidence_sources (
        id TEXT PRIMARY KEY,
        document_id TEXT,
        source TEXT NOT NULL,
        title TEXT NOT NULL,
        url TEXT,
        publication_year TEXT,
        relevance TEXT,
        evidence_type TEXT,
        evidence_summary TEXT,
        credibility_weight REAL,
        created_at TEXT
    )
    """)

    # Retrieval Logs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS retrieval_logs (
        id TEXT PRIMARY KEY,
        query TEXT NOT NULL,
        retrieved_documents TEXT,
        similarity_scores TEXT,
        timestamp TEXT
    )
    """)

    # Recommendations
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS recommendations (
        id TEXT PRIMARY KEY,
        conversation_id TEXT,
        action TEXT NOT NULL,
        why_it_works TEXT NOT NULL,
        metrics TEXT,
        time_horizon TEXT,
        confidence TEXT,
        confidence_score REAL,
        conditions TEXT,
        limitations TEXT,
        evidence TEXT,
        created_at TEXT
    )
    """)

    # Environmental Profiles
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS environmental_profiles (
        id TEXT PRIMARY KEY,
        profile_name TEXT DEFAULT 'Default Ecosystem Profile',
        region TEXT,
        country TEXT,
        latitude REAL,
        longitude REAL,
        climate_zone TEXT,
        metrics TEXT,
        updated_at TEXT
    )
    """)

    conn.commit()
    conn.close()

# Auto-initialize database on import
init_db()
