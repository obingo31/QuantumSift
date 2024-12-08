from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

router = APIRouter()

class AuditReportModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str
    source: str
    blockchain: str
    timestamp: Optional[str] = None

class VulnerabilityPattern(BaseModel):
    type: str
    description: str
    severity: str

class AuditAnalysisRequest(BaseModel):
    reports: List[str]
    blockchain: Optional[str] = None

class AuditAnalysisResult(BaseModel):
    common_vulnerabilities: List[VulnerabilityPattern]
    similarity_matrix: List[List[float]]
    total_reports: int

def extract_vulnerability_patterns(reports: List[str]) -> List[VulnerabilityPattern]:
    """
    Extract vulnerability patterns from audit reports using NLP techniques
    """
    # Predefined vulnerability keywords
    vulnerability_keywords = {
        "Reentrancy": {
            "keywords": ["recursive call", "state update", "external call"],
            "severity": "High"
        },
        "Access Control": {
            "keywords": ["owner", "permission", "access check"],
            "severity": "Medium"
        },
        "Integer Overflow": {
            "keywords": ["arithmetic", "overflow", "underflow"],
            "severity": "High"
        }
    }
    
    detected_patterns = []
    
    for report in reports:
        for vuln_type, details in vulnerability_keywords.items():
            if any(keyword.lower() in report.lower() for keyword in details["keywords"]):
                detected_patterns.append(
                    VulnerabilityPattern(
                        type=vuln_type,
                        description=f"Potential {vuln_type} vulnerability detected",
                        severity=details["severity"]
                    )
                )
    
    return detected_patterns

@router.post("/audit-similarity")
async def analyze_audit_reports(request: AuditAnalysisRequest):
    """
    Analyze similarity between multiple audit reports
    """
    if len(request.reports) < 2:
        raise HTTPException(status_code=400, detail="Provide at least two reports for analysis")
    
    # Use TF-IDF vectorization for text similarity
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(request.reports)
    
    # Compute cosine similarity matrix
    similarity_matrix = cosine_similarity(tfidf_matrix).tolist()
    
    # Extract common vulnerability patterns
    common_vulnerabilities = extract_vulnerability_patterns(request.reports)
    
    return AuditAnalysisResult(
        common_vulnerabilities=common_vulnerabilities,
        similarity_matrix=similarity_matrix,
        total_reports=len(request.reports)
    )

@router.post("/risk-scoring")
async def compute_contract_risk_score(contract_code: str):
    """
    Compute risk score for a smart contract
    """
    # Simulated risk scoring based on multiple factors
    risk_factors = {
        "external_calls": 0.3,
        "access_control": 0.2,
        "state_modifications": 0.2,
        "complexity": 0.3
    }
    
    # Basic heuristics for risk scoring
    risk_score = 0.0
    
    if "transfer(" in contract_code:
        risk_score += risk_factors["external_calls"]
    
    if "msg.sender" in contract_code and "require(" not in contract_code:
        risk_score += risk_factors["access_control"]
    
    # More complex risk assessment could be added here
    
    return {
        "contract_code": contract_code,
        "risk_score": min(risk_score, 1.0),
        "risk_level": (
            "Critical" if risk_score > 0.8 else
            "High" if risk_score > 0.6 else
            "Medium" if risk_score > 0.4 else
            "Low"
        )
    }
