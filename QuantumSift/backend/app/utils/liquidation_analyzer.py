from typing import Dict, Any, Optional, Tuple
from dataclasses import dataclass, field

@dataclass
class LiquidationFeeAnalysis:
    """
    Comprehensive analysis of liquidation fee risks
    """
    total_liquidations: int = 0
    risky_liquidations: int = 0
    fee_calculation_methods: Dict[str, int] = field(default_factory=dict)
    
    # Risk indicators
    potential_insolvency_risk: bool = False
    inconsistent_fee_calculation: bool = False
    
    def add_liquidation(self, is_risky: bool = False):
        """
        Record a liquidation attempt
        
        :param is_risky: Whether the liquidation has potential insolvency risk
        """
        self.total_liquidations += 1
        if is_risky:
            self.risky_liquidations += 1
    
    def analyze_fee_calculation(self, calculation_method: str):
        """
        Track and analyze fee calculation methods
        
        :param calculation_method: Identifier for fee calculation method
        """
        self.fee_calculation_methods[calculation_method] = \
            self.fee_calculation_methods.get(calculation_method, 0) + 1
    
    def calculate_risk_score(self) -> float:
        """
        Calculate overall liquidation fee risk score
        
        :return: Risk score between 0.0 and 1.0
        """
        # Base risk from risky liquidations
        risky_liquidation_weight = min(
            self.risky_liquidations / max(self.total_liquidations, 1), 
            0.5
        )
        
        # Additional risk from inconsistent calculations
        calculation_method_risk = (
            len(self.fee_calculation_methods) > 1
        ) * 0.3
        
        # Potential insolvency risk
        insolvency_risk = 0.2 if self.potential_insolvency_risk else 0
        
        return min(risky_liquidation_weight + calculation_method_risk + insolvency_risk, 1.0)

class LiquidationFeeValidator:
    """
    Advanced liquidation fee validation utility
    """
    
    @staticmethod
    def validate_liquidation_fee(
        collateral_amount: float,
        liquidation_fee: float,
        required_collateral: float
    ) -> Dict[str, Any]:
        """
        Validate liquidation fee against collateral requirements
        
        :param collateral_amount: Current collateral amount
        :param liquidation_fee: Proposed liquidation fee
        :param required_collateral: Minimum collateral required
        :return: Validation result
        """
        validation_result = {
            "is_valid": False,
            "errors": []
        }
        
        # Check if liquidation fee exceeds available collateral
        if liquidation_fee > collateral_amount:
            validation_result["errors"].append(
                "Liquidation fee exceeds available collateral"
            )
            return validation_result
        
        # Check if collateral remains sufficient after fee
        remaining_collateral = collateral_amount - liquidation_fee
        if remaining_collateral < required_collateral:
            validation_result["errors"].append(
                "Liquidation fee reduces collateral below required amount"
            )
            return validation_result
        
        # Successful validation
        validation_result.update({
            "is_valid": True,
            "remaining_collateral": remaining_collateral,
            "fee_percentage": (liquidation_fee / collateral_amount) * 100
        })
        
        return validation_result
    
    @classmethod
    def analyze_liquidation_scenarios(
        cls, 
        liquidation_scenarios: list[Dict[str, float]]
    ) -> LiquidationFeeAnalysis:
        """
        Analyze multiple liquidation scenarios
        
        :param liquidation_scenarios: List of liquidation scenario parameters
        :return: Comprehensive liquidation fee analysis
        """
        analysis = LiquidationFeeAnalysis()
        
        for scenario in liquidation_scenarios:
            validation_result = cls.validate_liquidation_fee(
                collateral_amount=scenario['collateral_amount'],
                liquidation_fee=scenario['liquidation_fee'],
                required_collateral=scenario['required_collateral']
            )
            
            # Record liquidation attempt
            analysis.add_liquidation(not validation_result['is_valid'])
            
            # Track fee calculation method
            analysis.analyze_fee_calculation(
                scenario.get('fee_calculation_method', 'default')
            )
        
        # Determine potential insolvency risk
        analysis.potential_insolvency_risk = (
            analysis.risky_liquidations / 
            max(analysis.total_liquidations, 1)
        ) > 0.3
        
        # Check for inconsistent fee calculations
        analysis.inconsistent_fee_calculation = (
            len(analysis.fee_calculation_methods) > 1
        )
        
        return analysis

# Example usage
def example_liquidation_analysis():
    scenarios = [
        {
            'collateral_amount': 1000,
            'liquidation_fee': 100,
            'required_collateral': 800,
            'fee_calculation_method': 'solvent_loc'
        },
        {
            'collateral_amount': 500,
            'liquidation_fee': 200,
            'required_collateral': 600,
            'fee_calculation_method': 'insolvent_loc'
        }
    ]
    
    analysis = LiquidationFeeValidator.analyze_liquidation_scenarios(scenarios)
    print(f"Risk Score: {analysis.calculate_risk_score()}")
    print(f"Risky Liquidations: {analysis.risky_liquidations}")
