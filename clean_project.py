#!/usr/bin/env python3
"""
TechResolve AI - Cross-Platform Project Cleanup & Optimization Tool
Run with: python clean_project.py [--deep]
"""

import os
import sys
import shutil
import sqlite3
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent

def log(msg, status="INFO"):
    colors = {
        "INFO": "\033[94m",
        "SUCCESS": "\033[92m",
        "WARN": "\033[93m",
        "RESET": "\033[0m"
    }
    print(f"{colors.get(status, '')}[{status}] {msg}{colors['RESET']}")

def clean_pycache():
    log("Cleaning Python bytecode and test cache...", "INFO")
    count = 0
    for root, dirs, files in os.walk(ROOT_DIR):
        for d in list(dirs):
            if d in ("__pycache__", ".pytest_cache"):
                full_path = os.path.join(root, d)
                try:
                    shutil.rmtree(full_path, ignore_errors=True)
                    count += 1
                except Exception:
                    pass
    log(f"Removed {count} cache directory/directories.", "SUCCESS")

def clean_temp_files():
    log("Cleaning temporary scratch files and logs...", "INFO")
    temp_files = ["scratch_videos.json"]
    count = 0
    for tf in temp_files:
        path = ROOT_DIR / tf
        if path.exists():
            try:
                path.unlink()
                count += 1
            except Exception:
                pass
    
    # Also remove root *.log files
    for log_file in ROOT_DIR.glob("*.log"):
        try:
            log_file.unlink()
            count += 1
        except Exception:
            pass
            
    log(f"Removed {count} temporary file(s).", "SUCCESS")

def clean_uploads():
    log("Cleaning test uploads in backend/uploads/...", "INFO")
    uploads_dir = ROOT_DIR / "backend" / "uploads"
    count = 0
    if uploads_dir.exists():
        for file in uploads_dir.iterdir():
            if file.is_file() and file.name != ".gitkeep":
                try:
                    file.unlink()
                    count += 1
                except Exception:
                    pass
    log(f"Removed {count} test uploaded file(s).", "SUCCESS")

def optimize_sqlite():
    log("Optimizing SQLite database (VACUUM & defragment)...", "INFO")
    db_path = ROOT_DIR / "backend" / "techresolve.db"
    if db_path.exists():
        size_before = db_path.stat().st_size
        try:
            conn = sqlite3.connect(str(db_path))
            cursor = conn.cursor()
            # Clean expired or used OTPs
            cursor.execute("DELETE FROM otp_codes WHERE used = 1")
            conn.commit()
            # Vacuum and optimize
            cursor.execute("VACUUM")
            cursor.execute("PRAGMA optimize")
            conn.close()
            size_after = db_path.stat().st_size
            saved = max(0, size_before - size_after)
            log(f"Database optimized. Reclaimed {saved / 1024:.2f} KB.", "SUCCESS")
        except Exception as e:
            log(f"Database optimization error: {e}", "WARN")
    else:
        log("No local database found to optimize.", "INFO")

def deep_clean():
    log("Deep clean: clearing build caches...", "INFO")
    # Clean frontend dist
    dist_dir = ROOT_DIR / "frontend" / "dist"
    if dist_dir.exists():
        shutil.rmtree(dist_dir, ignore_errors=True)
        log("Cleared frontend/dist", "SUCCESS")
        
    # Clean android build
    android_build = ROOT_DIR / "frontend" / "android" / "app" / "build"
    if android_build.exists():
        shutil.rmtree(android_build, ignore_errors=True)
        log("Cleared Android app build cache", "SUCCESS")

def main():
    print("=" * 60)
    print("  TechResolve AI - Project Cleanup Utility")
    print("=" * 60)
    
    clean_pycache()
    clean_temp_files()
    clean_uploads()
    optimize_sqlite()
    
    if "--deep" in sys.argv:
        deep_clean()
        
    print("=" * 60)
    log("All cleanup tasks completed successfully!", "SUCCESS")
    print("=" * 60)

if __name__ == "__main__":
    main()
