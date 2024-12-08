import re
import eth_utils
from typing import Optional, Dict, Any

class AddressValidator:
    """
    Comprehensive Ethereum address validation utility
    
    Provides multiple layers of address validation:
    1. Format validation
    2. Checksum validation
    3. Zero address detection
    4. Contract vs EOA detection
    """
    
    @staticmethod
    def validate_address(address: str) -> Dict[str, Any]:
        """
        Comprehensive address validation
        
        :param address: Ethereum address to validate
        :return: Validation result dictionary
        """
        validation_result = {
            "is_valid": False,
            "address": address,
            "errors": []
        }
        
        try:
            # Basic format validation
            if not isinstance(address, str):
                validation_result["errors"].append("Address must be a string")
                return validation_result
            
            # Remove '0x' prefix if present
            address = address.lower().replace('0x', '')
            
            # Check length
            if len(address) != 40:
                validation_result["errors"].append("Invalid address length")
                return validation_result
            
            # Hexadecimal validation
            if not re.match(r'^[0-9a-f]+$', address):
                validation_result["errors"].append("Address must be a hexadecimal string")
                return validation_result
            
            # Full address with '0x' prefix
            full_address = f'0x{address}'
            
            # Ethereum address validation
            if not eth_utils.is_address(full_address):
                validation_result["errors"].append("Invalid Ethereum address format")
                return validation_result
            
            # Zero address check
            if full_address == '0x0000000000000000000000000000000000000000':
                validation_result["errors"].append("Zero address is not allowed")
                return validation_result
            
            # Checksum validation
            checksum_address = eth_utils.to_checksum_address(full_address)
            validation_result["checksum_address"] = checksum_address
            
            # Additional metadata
            validation_result.update({
                "is_valid": True,
                "is_contract": eth_utils.is_contract_address(full_address),
                "is_eoa": not eth_utils.is_contract_address(full_address)
            })
            
            return validation_result
        
        except Exception as e:
            validation_result["errors"].append(str(e))
            return validation_result
    
    @staticmethod
    def sanitize_address(address: Optional[str]) -> Optional[str]:
        """
        Sanitize and normalize an Ethereum address
        
        :param address: Address to sanitize
        :return: Normalized address or None
        """
        if not address:
            return None
        
        try:
            # Remove whitespaces and '0x' prefix
            clean_address = address.strip().lower().replace('0x', '')
            
            # Validate and return checksum address
            full_address = f'0x{clean_address}'
            return eth_utils.to_checksum_address(full_address)
        
        except Exception:
            return None
    
    @classmethod
    def get_address_risk_score(cls, address: str) -> float:
        """
        Calculate a risk score for an address based on various factors
        
        :param address: Ethereum address
        :return: Risk score (0.0 - 1.0)
        """
        validation = cls.validate_address(address)
        
        if not validation['is_valid']:
            return 1.0  # Highest risk for invalid addresses
        
        risk_score = 0.0
        
        # Increase risk for contract addresses
        if validation.get('is_contract', False):
            risk_score += 0.3
        
        # Additional risk factors can be added here
        
        return min(risk_score, 1.0)  # Ensure score doesn't exceed 1.0
