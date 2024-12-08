from typing import Dict, Any, Optional, Tuple, List
import math
import eth_utils

class OracleValidator:
    """
    Comprehensive Oracle Price Feed Validation Utility
    
    Provides advanced validation techniques for price oracles,
    with a focus on token address and price feed validation
    """
    
    @staticmethod
    def validate_price_confidence(
        price: float, 
        confidence: float, 
        max_confidence_ratio: float = 0.1
    ) -> Dict[str, Any]:
        """
        Validate price confidence interval
        
        :param price: Current price value
        :param confidence: Confidence interval (standard deviation)
        :param max_confidence_ratio: Maximum allowed confidence ratio
        :return: Validation result dictionary
        """
        validation_result = {
            "is_valid": False,
            "price": price,
            "confidence": confidence,
            "errors": []
        }
        
        try:
            # Basic sanity checks
            if price <= 0:
                validation_result["errors"].append("Price must be positive")
                return validation_result
            
            if confidence < 0:
                validation_result["errors"].append("Confidence cannot be negative")
                return validation_result
            
            # Calculate confidence ratio
            confidence_ratio = confidence / price
            
            # Confidence interval validation
            if confidence_ratio > max_confidence_ratio:
                validation_result["errors"].append(
                    f"Confidence interval too high: {confidence_ratio:.4f} > {max_confidence_ratio}"
                )
                validation_result["confidence_ratio"] = confidence_ratio
                return validation_result
            
            # Additional advanced checks
            validation_result.update({
                "is_valid": True,
                "confidence_ratio": confidence_ratio,
                "confidence_percentage": confidence_ratio * 100
            })
            
            return validation_result
        
        except Exception as e:
            validation_result["errors"].append(str(e))
            return validation_result
    
    @staticmethod
    def calculate_price_deviation(
        prices: list[float], 
        confidence_intervals: list[float]
    ) -> Dict[str, Any]:
        """
        Calculate price deviation and consistency across multiple price sources
        
        :param prices: List of prices from different oracles
        :param confidence_intervals: Corresponding confidence intervals
        :return: Deviation analysis result
        """
        if len(prices) != len(confidence_intervals):
            return {
                "is_consistent": False,
                "error": "Prices and confidence intervals must have equal length"
            }
        
        # Calculate mean price
        mean_price = sum(prices) / len(prices)
        
        # Calculate weighted standard deviation
        weighted_variances = [
            (price - mean_price) ** 2 / (conf ** 2) 
            for price, conf in zip(prices, confidence_intervals)
        ]
        
        # Weighted standard deviation
        weighted_std = math.sqrt(sum(weighted_variances) / len(prices))
        
        return {
            "is_consistent": weighted_std < 1.0,  # Threshold can be adjusted
            "mean_price": mean_price,
            "weighted_std": weighted_std,
            "prices": prices,
            "confidence_intervals": confidence_intervals
        }
    
    @classmethod
    def assess_oracle_reliability(
        cls, 
        prices: list[float], 
        confidence_intervals: list[float],
        max_confidence_ratio: float = 0.1
    ) -> Dict[str, Any]:
        """
        Comprehensive oracle reliability assessment
        
        :param prices: List of prices
        :param confidence_intervals: Corresponding confidence intervals
        :param max_confidence_ratio: Maximum allowed confidence ratio
        :return: Oracle reliability report
        """
        reliability_report = {
            "is_reliable": True,
            "individual_validations": [],
            "deviation_analysis": None
        }
        
        # Validate individual price confidences
        for price, confidence in zip(prices, confidence_intervals):
            validation = cls.validate_price_confidence(
                price, 
                confidence, 
                max_confidence_ratio
            )
            reliability_report["individual_validations"].append(validation)
            
            if not validation["is_valid"]:
                reliability_report["is_reliable"] = False
        
        # Perform deviation analysis
        reliability_report["deviation_analysis"] = cls.calculate_price_deviation(
            prices, 
            confidence_intervals
        )
        
        # Update overall reliability based on deviation
        if not reliability_report["deviation_analysis"]["is_consistent"]:
            reliability_report["is_reliable"] = False
        
        return reliability_report
    
    @staticmethod
    def validate_token_output_calculation(
        input_price: float,
        input_decimals: int,
        output_exponent: int,
        input_exponent: int,
        output_price: float
    ) -> Dict[str, Any]:
        """
        Validate token output calculation for oracle price feeds
        
        :param input_price: Price of input token
        :param input_decimals: Decimal places of input token
        :param output_exponent: Exponent of output price
        :param input_exponent: Exponent of input price
        :param output_price: Price of output token
        :return: Calculation validation result
        """
        validation_result = {
            "is_valid": False,
            "input_price": input_price,
            "output_price": output_price,
            "errors": []
        }
        
        try:
            # Incorrect calculation (original vulnerable method)
            incorrect_output_per_unit_input = (
                input_price * 
                10 ** (input_decimals - output_exponent + input_exponent + 1) / 
                output_price
            )
            
            # Correct calculation
            correct_output_per_unit_input = (
                input_price * 
                10 ** input_decimals / 
                output_price
            )
            
            # Correct exponent calculation
            correct_exponent = input_exponent - output_exponent - input_decimals
            
            # Compare calculations
            relative_error = abs(
                (incorrect_output_per_unit_input - correct_output_per_unit_input) / 
                correct_output_per_unit_input
            )
            
            # Validation checks
            if relative_error > 0.01:  # 1% tolerance
                validation_result["errors"].append(
                    f"Significant calculation error: {relative_error * 100:.2f}% deviation"
                )
                validation_result.update({
                    "incorrect_output": incorrect_output_per_unit_input,
                    "correct_output": correct_output_per_unit_input,
                    "relative_error": relative_error
                })
                return validation_result
            
            # Successful validation
            validation_result.update({
                "is_valid": True,
                "correct_output": correct_output_per_unit_input,
                "correct_exponent": correct_exponent
            })
            
            return validation_result
        
        except Exception as e:
            validation_result["errors"].append(str(e))
            return validation_result
    
    @classmethod
    def analyze_price_calculation_risks(
        cls, 
        price_calculations: list[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Analyze multiple price calculations for systemic risks
        
        :param price_calculations: List of price calculation parameters
        :return: Comprehensive price calculation risk analysis
        """
        risk_analysis = {
            "total_calculations": len(price_calculations),
            "valid_calculations": 0,
            "invalid_calculations": 0,
            "risk_score": 0.0,
            "detailed_results": []
        }
        
        for calc in price_calculations:
            validation_result = cls.validate_token_output_calculation(
                input_price=calc['input_price'],
                input_decimals=calc['input_decimals'],
                output_exponent=calc['output_exponent'],
                input_exponent=calc['input_exponent'],
                output_price=calc['output_price']
            )
            
            risk_analysis['detailed_results'].append(validation_result)
            
            if validation_result['is_valid']:
                risk_analysis['valid_calculations'] += 1
            else:
                risk_analysis['invalid_calculations'] += 1
        
        # Calculate risk score
        risk_analysis['risk_score'] = (
            risk_analysis['invalid_calculations'] / 
            risk_analysis['total_calculations']
        )
        
        return risk_analysis
    
    @staticmethod
    def validate_token_addresses(
        price_update_bytes: bytes, 
        expected_collateral_token: str, 
        expected_credited_token: str
    ) -> Dict[str, Any]:
        """
        Validate token addresses in oracle price update
        
        :param price_update_bytes: Raw bytes of price update
        :param expected_collateral_token: Expected collateral token address
        :param expected_credited_token: Expected credited token address
        :return: Validation result dictionary
        """
        validation_result = {
            "is_valid": False,
            "decoded_tokens": [],
            "errors": []
        }
        
        try:
            # Decode token addresses from price update bytes
            # Note: This is a placeholder. Actual decoding depends on specific oracle implementation
            decoded_tokens = OracleValidator._decode_token_addresses(price_update_bytes)
            
            if len(decoded_tokens) != 2:
                validation_result["errors"].append("Invalid number of tokens decoded")
                return validation_result
            
            token_a, token_b = decoded_tokens
            
            # Validate token address format
            if not (eth_utils.is_address(token_a) and eth_utils.is_address(token_b)):
                validation_result["errors"].append("Invalid token address format")
                return validation_result
            
            # Check for zero addresses
            if token_a == '0x0000000000000000000000000000000000000000' or \
               token_b == '0x0000000000000000000000000000000000000000':
                validation_result["errors"].append("Zero address detected")
                return validation_result
            
            # Validate token addresses match expected tokens
            # Allow for token address order flexibility
            address_match = (
                (token_a == expected_collateral_token and token_b == expected_credited_token) or
                (token_a == expected_credited_token and token_b == expected_collateral_token)
            )
            
            if not address_match:
                validation_result["errors"].append(
                    f"Token address mismatch. Expected: {expected_collateral_token}, {expected_credited_token}. "
                    f"Decoded: {token_a}, {token_b}"
                )
                return validation_result
            
            # Successful validation
            validation_result.update({
                "is_valid": True,
                "decoded_tokens": decoded_tokens,
                "matched_collateral_token": expected_collateral_token,
                "matched_credited_token": expected_credited_token
            })
            
            return validation_result
        
        except Exception as e:
            validation_result["errors"].append(str(e))
            return validation_result
    
    @staticmethod
    def _decode_token_addresses(price_update_bytes: bytes) -> Tuple[str, str]:
        """
        Decode token addresses from price update bytes
        
        :param price_update_bytes: Raw bytes of price update
        :return: Tuple of decoded token addresses
        
        Note: This is a placeholder method. Actual implementation 
        depends on specific oracle's price update encoding
        """
        # Placeholder decoding logic
        # In a real implementation, this would use the specific 
        # decoding method of the oracle (e.g., ABI decoding)
        if len(price_update_bytes) < 40:  # Assuming 20 bytes per address
            raise ValueError("Insufficient bytes for token address decoding")
        
        # Extract first two 20-byte addresses
        token_a = eth_utils.to_checksum_address(
            '0x' + price_update_bytes[:20].hex()
        )
        token_b = eth_utils.to_checksum_address(
            '0x' + price_update_bytes[20:40].hex()
        )
        
        return (token_a, token_b)
    
    @classmethod
    def analyze_token_address_risks(
        cls, 
        price_updates: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Analyze multiple price updates for token address risks
        
        :param price_updates: List of price update scenarios
        :return: Comprehensive token address risk analysis
        """
        risk_analysis = {
            "total_updates": len(price_updates),
            "valid_updates": 0,
            "invalid_updates": 0,
            "risk_score": 0.0,
            "detailed_results": []
        }
        
        for update in price_updates:
            validation_result = cls.validate_token_addresses(
                price_update_bytes=update['price_update_bytes'],
                expected_collateral_token=update['expected_collateral_token'],
                expected_credited_token=update['expected_credited_token']
            )
            
            risk_analysis['detailed_results'].append(validation_result)
            
            if validation_result['is_valid']:
                risk_analysis['valid_updates'] += 1
            else:
                risk_analysis['invalid_updates'] += 1
        
        # Calculate risk score
        risk_analysis['risk_score'] = (
            risk_analysis['invalid_updates'] / 
            risk_analysis['total_updates']
        )
        
        return risk_analysis
