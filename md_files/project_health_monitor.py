import os
import datetime

def check_project_health(path="."):
    required_files = [
        "01_vision.md", "02_project_status.md", "03_TODO.md", 
        "04_architecture.md", "11_CHANGELOG.md"
    ]
    
    print(f"--- Project Health Report [{datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}] ---")
    
    missing = []
    for f in required_files:
        if not os.path.exists(os.path.join(path, f)):
            missing.append(f)
            
    if not missing:
        print("✅ All core documentation files are present.")
    else:
        print(f"❌ Missing critical files: {', '.join(missing)}")
        
    # Check if project_status was updated recently
    if os.path.exists("02_project_status.md"):
        mtime = os.path.getmtime("02_project_status.md")
        last_update = datetime.datetime.fromtimestamp(mtime)
        delta = datetime.datetime.now() - last_update
        
        if delta.days > 0:
            print(f"⚠️ Warning: 02_project_status.md was last updated {delta.days} days ago. Documentation is stale!")
        else:
            print("✅ Documentation is up-to-date.")

if __name__ == "__main__":
    check_project_health()
