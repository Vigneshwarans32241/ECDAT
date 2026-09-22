from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field

class AlgorithmInfo(BaseModel):
    family: str
    name: str
    variant: Optional[str] = None
    keySize: Optional[int] = None

class UsageInfo(BaseModel):
    purpose: str
    mode: Optional[str] = None
    padding: Optional[str] = None

class ContextInfo(BaseModel):
    applicationId: str
    applicationName: str
    serviceId: Optional[str] = None
    serviceName: Optional[str] = None
    libraryId: Optional[str] = None
    libraryName: Optional[str] = None
    protocolId: Optional[str] = None

class ClassificationInfo(BaseModel):
    dataSensitivity: str = "medium"
    businessCriticality: str = "medium"
    internetFacing: bool = False

class StatusInfo(BaseModel):
    classical: str = "acceptable"
    quantum: str = "vulnerable"

class CryptoAsset(BaseModel):
    id: str
    assetType: str = "algorithm"
    algorithm: AlgorithmInfo
    usage: UsageInfo
    context: ContextInfo
    classification: ClassificationInfo
    status: StatusInfo
    confidence: float = 0.95
    riskBand: str = "medium"
    migrationStatus: str = "not_started"
    firstSeen: Optional[str] = None
    lastSeen: Optional[str] = None

class CryptoAssetCreate(BaseModel):
    algorithm: AlgorithmInfo
    usage: UsageInfo
    context: ContextInfo
    classification: Optional[ClassificationInfo] = Field(default_factory=ClassificationInfo)
    status: Optional[StatusInfo] = Field(default_factory=StatusInfo)
    confidence: Optional[float] = 0.95
    riskBand: Optional[str] = "medium"
    migrationStatus: Optional[str] = "not_started"

class CryptoAssetUpdate(BaseModel):
    algorithm: Optional[AlgorithmInfo] = None
    usage: Optional[UsageInfo] = None
    context: Optional[ContextInfo] = None
    classification: Optional[ClassificationInfo] = None
    status: Optional[StatusInfo] = None
    confidence: Optional[float] = None
    riskBand: Optional[str] = None
    migrationStatus: Optional[str] = None

class AssetListResponse(BaseModel):
    items: List[CryptoAsset]
    page: int = 1
    pageSize: int = 50
    total: int

class MoscaInput(BaseModel):
    dataShelfLifeYears: float = Field(..., description="Years data must remain secret (X)")
    migrationTimeYears: float = Field(..., description="Years required to migrate systems (Y)")
    threatHorizonYears: float = Field(..., description="Years until cryptanalytically relevant quantum computer (Z)")

class MoscaResult(BaseModel):
    dataShelfLifeYears: float
    migrationTimeYears: float
    threatHorizonYears: float
    totalExposureYears: float
    deficitYears: float
    isUrgent: bool
    status: str
    condition: str
    recommendation: str

class ScanFinding(BaseModel):
    id: str
    ruleId: str
    name: str
    severity: str
    algorithm: str
    file: str
    line: int
    codeSnippet: str
    recommendation: str
    confidence: float = 0.95

class ScanInput(BaseModel):
    projectId: Optional[str] = "P-001"
    targetType: str = "repository"
    target: Optional[Dict[str, Any]] = None
    snippet: Optional[str] = None

class ScanRecord(BaseModel):
    id: str
    name: str
    target: str
    type: str
    status: str
    startedAt: str
    finishedAt: Optional[str] = None
    duration: Optional[str] = None
    stats: Dict[str, Any]
    findings: Optional[List[ScanFinding]] = None

class ChecklistItem(BaseModel):
    id: str
    text: str
    completed: bool = False

class BlastRadius(BaseModel):
    services: int = 0
    apis: int = 0
    dependentTeams: int = 0

class MigrationTask(BaseModel):
    id: str
    title: str
    assetId: str
    applicationId: str
    applicationName: str
    stage: str = "not_started"
    priority: str = "high"
    owner: str = "SecOps Team"
    dueDate: str
    progressPercent: int = 0
    estimatedEffort: str = "4 weeks"
    currentAlgorithm: str
    targetAlgorithm: str
    checklist: List[ChecklistItem]
    blastRadius: BlastRadius

class MigrationTaskCreate(BaseModel):
    title: str
    assetId: str
    applicationId: str
    applicationName: str
    stage: Optional[str] = "not_started"
    priority: Optional[str] = "high"
    owner: Optional[str] = "SecOps Team"
    dueDate: Optional[str] = None
    estimatedEffort: Optional[str] = "4 weeks"
    currentAlgorithm: str
    targetAlgorithm: str
    checklist: Optional[List[ChecklistItem]] = None
    blastRadius: Optional[BlastRadius] = None

class MigrationTaskUpdate(BaseModel):
    title: Optional[str] = None
    stage: Optional[str] = None
    priority: Optional[str] = None
    owner: Optional[str] = None
    dueDate: Optional[str] = None
    progressPercent: Optional[int] = None
    checklist: Optional[List[ChecklistItem]] = None

class RecommendationItem(BaseModel):
    id: str
    assetId: str
    currentAlgorithm: str
    targetAlgorithm: str
    standard: str
    hybridMode: bool
    rationale: str
    priority: str
    estimatedEffortWeeks: int
    fipsStandard: str
