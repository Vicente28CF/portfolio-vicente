import re

def calculate_match(job_description: str, skills_dict: dict) -> dict:
    desc = job_description.lower()
    
    all_skills = []
    for category in skills_dict.values():
        for skill in category:
            all_skills.append(skill["name"])
            
    variants = {
        "FastAPI": ["fastapi", "fast api"],
        "PostgreSQL": ["postgresql", "postgres"],
        "React": ["react", "reactjs", "react.js"],
        "Next.js": ["next.js", "nextjs", "next js", "next"],
        "Tailwind CSS": ["tailwind", "tailwindcss", "tailwind css"],
        "GitHub Actions": ["github actions", "gh actions"],
        "Django REST": ["django rest", "drf", "django rest framework", "django"],
        "Node.js": ["node.js", "nodejs", "node"],
        "TypeScript": ["typescript", "type script", "ts"],
        "JavaScript": ["javascript", "java script", "js"],
    }

    matched = []
    missing = []
    
    for skill in all_skills:
        terms = variants.get(skill, [skill.lower()])
        
        found = False
        for term in terms:
            # Regex boundary to prevent partial matches like 'git' inside 'digital'
            pattern = r'\b' + re.escape(term) + r'\b'
            if re.search(pattern, desc):
                found = True
                break
        
        if found:
            matched.append(skill)
        else:
            missing.append(skill)
            
    total = len(all_skills)
    percentage = (len(matched) / total) * 100 if total > 0 else 0.0
    
    return {
        "percentage": percentage,
        "matched": matched,
        "missing": missing
    }
