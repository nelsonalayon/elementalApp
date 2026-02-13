const paymentService = require('../paymentService');

test('should process payment successfully', () => {
	const result = paymentService.processPayment(100, 'credit_card');
	expect(result).toBe('Payment processed successfully');
});

test('should fail for invalid payment method', () => {
	const result = paymentService.processPayment(100, 'invalid_method');
	expect(result).toBe('Invalid payment method');
});

test('should fail for insufficient funds', () => {
	const result = paymentService.processPayment(1000, 'credit_card');
	expect(result).toBe('Insufficient funds');
});