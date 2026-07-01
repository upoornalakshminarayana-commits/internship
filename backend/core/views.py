from django.http import HttpResponse

def api_docs(request):
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CareerConnect AI - API Documentation</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
            :root {
                --primary: #6366f1;
                --primary-dark: #4f46e5;
                --bg: #0f172a;
                --card: #1e293b;
                --text: #f8fafc;
                --text-muted: #94a3b8;
                --border: #334155;
                --badge-get: #10b981;
                --badge-post: #6366f1;
                --badge-put: #f59e0b;
                --badge-delete: #ef4444;
            }
            body {
                font-family: 'Inter', sans-serif;
                background-color: var(--bg);
                color: var(--text);
                margin: 0;
                padding: 0;
            }
            header {
                background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
                padding: 40px 20px;
                border-bottom: 1px solid var(--border);
                text-align: center;
            }
            h1 {
                font-family: 'Outfit', sans-serif;
                margin: 0;
                font-size: 2.5rem;
                letter-spacing: -0.05em;
                color: #fff;
            }
            h1 span {
                color: var(--primary);
            }
            p.subtitle {
                color: var(--text-muted);
                margin-top: 10px;
                font-size: 1.1rem;
            }
            main {
                max-width: 1000px;
                margin: 40px auto;
                padding: 0 20px;
            }
            .section-title {
                font-family: 'Outfit', sans-serif;
                font-size: 1.5rem;
                margin-bottom: 20px;
                border-left: 4px solid var(--primary);
                padding-left: 12px;
            }
            .endpoint-card {
                background-color: var(--card);
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
                transition: transform 0.2s, border-color 0.2s;
            }
            .endpoint-card:hover {
                transform: translateY(-2px);
                border-color: var(--primary);
            }
            .endpoint-header {
                display: flex;
                align-items: center;
                gap: 15px;
                flex-wrap: wrap;
                margin-bottom: 12px;
            }
            .method-badge {
                font-weight: 700;
                font-size: 0.85rem;
                padding: 6px 12px;
                border-radius: 6px;
                text-transform: uppercase;
                color: white;
            }
            .GET { background-color: var(--badge-get); }
            .POST { background-color: var(--badge-post); }
            .PUT { background-color: var(--badge-put); }
            .DELETE { background-color: var(--badge-delete); }
            .path {
                font-family: monospace;
                font-size: 1.1rem;
                font-weight: 600;
            }
            .desc {
                color: var(--text-muted);
                font-size: 0.95rem;
                margin-bottom: 15px;
            }
            .details {
                background-color: #0b0f19;
                border-radius: 8px;
                padding: 15px;
                font-size: 0.85rem;
                border: 1px solid #1e293b;
            }
            .details summary {
                cursor: pointer;
                font-weight: 600;
                color: var(--primary);
                outline: none;
            }
            .details-content {
                margin-top: 10px;
                color: #cbd5e1;
                line-height: 1.6;
            }
            .payload-box {
                background-color: #121b2d;
                border: 1px solid #1e293b;
                padding: 10px;
                border-radius: 6px;
                font-family: monospace;
                margin-top: 5px;
                overflow-x: auto;
                color: #38bdf8;
            }
            footer {
                text-align: center;
                padding: 40px 20px;
                color: var(--text-muted);
                font-size: 0.9rem;
                border-top: 1px solid var(--border);
                margin-top: 60px;
            }
        </style>
    </head>
    <body>
        <header>
            <h1>CareerConnect <span>AI</span> API</h1>
            <p class="subtitle">Production-grade job board backend API documentation</p>
        </header>
        <main>
            <div class="section-title">Authentication Endpoints</div>
            
            <div class="endpoint-card">
                <div class="endpoint-header">
                    <span class="method-badge POST">POST</span>
                    <span class="path">/api/auth/register</span>
                </div>
                <div class="desc">Register a new user (EMPLOYER or JOBSEEKER) with standard details and optional profile picture.</div>
                <details class="details">
                    <summary>Request & Response Details</summary>
                    <div class="details-content">
                        <strong>Payload (JSON or Form-data):</strong>
                        <pre class="payload-box">
{
  "username": "candidate123",
  "email": "candidate@gmail.com",
  "password": "strongpassword123",
  "role": "JOBSEEKER", // Or "EMPLOYER"
  "profile_image": File (Optional)
}</pre>
                        <strong>Success Response (201 Created):</strong>
                        <pre class="payload-box">
{
  "message": "User registered successfully.",
  "user": {
    "id": 1,
    "username": "candidate123",
    "email": "candidate@gmail.com",
    "role": "JOBSEEKER",
    "profile_image": null
  }
}</pre>
                    </div>
                </details>
            </div>

            <div class="endpoint-card">
                <div class="endpoint-header">
                    <span class="method-badge POST">POST</span>
                    <span class="path">/api/auth/login</span>
                </div>
                <div class="desc">Obtain JWT Token Pair (Access + Refresh tokens) for authenticating users.</div>
                <details class="details">
                    <summary>Request & Response Details</summary>
                    <div class="details-content">
                        <strong>Payload (JSON):</strong>
                        <pre class="payload-box">
{
  "username": "candidate123",
  "password": "strongpassword123"
}</pre>
                        <strong>Success Response (200 OK):</strong>
                        <pre class="payload-box">
{
  "refresh": "eyJhbGciOiJIUzI1NiIsIn...",
  "access": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "id": 1,
    "username": "candidate123",
    "email": "candidate@gmail.com",
    "role": "JOBSEEKER",
    "profile_image": null
  }
}</pre>
                    </div>
                </details>
            </div>

            <div class="endpoint-card">
                <div class="endpoint-header">
                    <span class="method-badge POST">POST</span>
                    <span class="path">/api/auth/refresh</span>
                </div>
                <div class="desc">Get a new JWT access token using a refresh token.</div>
                <details class="details">
                    <summary>Request & Response Details</summary>
                    <div class="details-content">
                        <strong>Payload (JSON):</strong>
                        <pre class="payload-box">
{
  "refresh": "eyJhbGciOiJIUzI1NiIsIn..."
}</pre>
                        <strong>Success Response (200 OK):</strong>
                        <pre class="payload-box">
{
  "access": "eyJhbGciOiJIUzI1NiIsIn..."
}</pre>
                    </div>
                </details>
            </div>

            <div class="section-title">Jobs Endpoints</div>

            <div class="endpoint-card">
                <div class="endpoint-header">
                    <span class="method-badge GET">GET</span>
                    <span class="path">/api/jobs</span>
                </div>
                <div class="desc">List all jobs with pagination. Supports searching (?search=...) and filtering (?location=...&job_type=...&experience_level=...&category=...).</div>
            </div>

            <div class="endpoint-card">
                <div class="endpoint-header">
                    <span class="method-badge POST">POST</span>
                    <span class="path">/api/jobs</span>
                </div>
                <div class="desc">Post a new job. Allowed for <strong>EMPLOYER</strong> role only. Requires Bearer Token authorization header.</div>
            </div>

            <div class="endpoint-card">
                <div class="endpoint-header">
                    <span class="method-badge PUT">PUT/PATCH</span>
                    <span class="path">/api/jobs/:id</span>
                </div>
                <div class="desc">Update details of a job posting. Restricted to the employer owner of the job.</div>
            </div>

            <div class="endpoint-card">
                <div class="endpoint-header">
                    <span class="method-badge DELETE">DELETE</span>
                    <span class="path">/api/jobs/:id</span>
                </div>
                <div class="desc">Delete a job posting. Restricted to the employer owner of the job.</div>
            </div>

            <div class="section-title">Profile Endpoints</div>

            <div class="endpoint-card">
                <div class="endpoint-header">
                    <span class="method-badge GET">GET</span>
                    <span class="path">/api/profile</span>
                </div>
                <div class="desc">Get the logged-in user's profile details. Automatically serves either Employer or Job Seeker profile structure depending on their role.</div>
            </div>

            <div class="endpoint-card">
                <div class="endpoint-header">
                    <span class="method-badge PUT">PUT</span>
                    <span class="path">/api/profile</span>
                </div>
                <div class="desc">Update profile details. Job seekers can upload files to update their resumes.</div>
            </div>

            <div class="section-title">Applications Endpoints</div>

            <div class="endpoint-card">
                <div class="endpoint-header">
                    <span class="method-badge GET">GET</span>
                    <span class="path">/api/applications</span>
                </div>
                <div class="desc">List applications. Job seekers see their own submissions. Employers see submissions for their posted jobs.</div>
            </div>

            <div class="endpoint-card">
                <div class="endpoint-header">
                    <span class="method-badge POST">POST</span>
                    <span class="path">/api/applications</span>
                </div>
                <div class="desc">Submit a job application with cover_letter and resume. Allowed for <strong>JOBSEEKER</strong> role only.</div>
            </div>

            <div class="endpoint-card">
                <div class="endpoint-header">
                    <span class="method-badge PUT">PUT/PATCH</span>
                    <span class="path">/api/applications/:id</span>
                </div>
                <div class="desc">Update application status (Employers only, e.g., REVIEWING, ACCEPTED, REJECTED) or modify application details (Job Seekers only).</div>
            </div>

            <div class="section-title">Dashboard Endpoints</div>

            <div class="endpoint-card">
                <div class="endpoint-header">
                    <span class="method-badge GET">GET</span>
                    <span class="path">/api/dashboard</span>
                </div>
                <div class="desc">Aggregates analytics stats (totals, breakdown by status, recent jobs, recent applications) customized for each role.</div>
            </div>

        </main>
        <footer>
            &copy; 2026 CareerConnect AI. All rights reserved.
        </footer>
    </body>
    </html>
    """
    return HttpResponse(html_content)
