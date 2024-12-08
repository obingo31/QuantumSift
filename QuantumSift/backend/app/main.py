from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import uvicorn
import logging
import sentry_sdk

# Import routers
from routes.contracts import router as contracts_router
from routes.vulnerability import router as vulnerability_router
from routes.analysis import router as analysis_router
from routes import vulnerability, auth

# Sentry Configuration
sentry_sdk.init(
    dsn="YOUR_SENTRY_DSN",  # Replace with your Sentry DSN
    traces_sample_rate=1.0,
    profiles_sample_rate=1.0,
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title="QuantumSift Security Platform",
    description="Advanced Smart Contract Security Analysis Backend",
    version="0.1.0"
)

# Security Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://quantum-sift.vercel.app",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=[
        "localhost",
        "127.0.0.1",
        "quantum-sift.vercel.app",
        "*.vercel.app"
    ]
)

# Include routers
app.include_router(contracts_router, prefix="/contracts", tags=["Contracts"])
app.include_router(vulnerability_router, prefix="/vulnerabilities", tags=["Vulnerabilities"])
app.include_router(analysis_router, prefix="/analysis", tags=["Analysis"])
app.include_router(vulnerability.router, prefix="/api/vulnerability")
app.include_router(auth.router, prefix="/api/auth")

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to QuantumSift Security Platform",
        "status": "operational",
        "version": "0.1.0"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """Basic health check endpoint"""
    return {"status": "healthy"}

# WebSocket for real-time updates
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # Process and broadcast WebSocket messages
            await websocket.send_text(f"Message received: {data}")
    except WebSocketDisconnect:
        logger.info("WebSocket connection closed")

# Run the application (for development)
if __name__ == "__main__":
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True
    )

