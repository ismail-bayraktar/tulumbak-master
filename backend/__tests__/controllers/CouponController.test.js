import { jest } from '@jest/globals';
import { createCoupon, validateCoupon } from '../../controllers/CouponController.js';
import couponModel from '../../models/CouponModel.js';

jest.mock('../../models/CouponModel.js');

describe('Coupon Controller', () => {
    it('should create a coupon with an uppercase code', async () => {
        const req = {
            body: {
                code: 'testcoupon',
                type: 'sabit',
                value: 10,
                minCart: 50,
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
                usageLimit: 100,
            },
        };
        const res = { json: jest.fn() };
        couponModel.prototype.save = jest.fn().mockResolvedValue(true);

        await createCoupon(req, res);

        expect(couponModel.prototype.save).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                coupon: expect.objectContaining({
                    code: 'TESTCOUPON',
                }),
            })
        );
    });

    it('should validate a coupon with a mismatched case', async () => {
        const req = {
            body: {
                code: 'testcoupon',
                cartTotal: 100,
            },
        };
        const res = { json: jest.fn() };
        const mockCoupon = {
            code: 'TESTCOUPON',
            type: 'sabit',
            value: 10,
            minCart: 50,
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
            usageLimit: 100,
            usageCount: 0,
        };
        couponModel.findOne = jest.fn().mockResolvedValue(mockCoupon);

        await validateCoupon(req, res);

        expect(couponModel.findOne).toHaveBeenCalledWith({ code: 'TESTCOUPON', active: true });
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                discount: 10,
            })
        );
    });
});
