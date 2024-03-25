import {scheduleJob} from 'node-schedule'

import Coupon from '../../DB/Models/coupon.model.js';
import { DateTime } from 'luxon';

// generate a cron job to check the coupon status
export const scheduleCronsForCouponCheck = () => {
    scheduleJob('*/5 * * * * *', async () => {
        console.log('scheduleCronsForCouponCheck() is running  ............');
        const coupons  = await Coupon.find({couponStatus:'valid'});
        
        for (const coupon of coupons) {
            if(DateTime.fromISO(coupon.toDate) < DateTime.now()){
                coupon.couponStatus = 'expired';
                await coupon.save();
            }            
        }
    });
}

export const scheduleCronsForCouponCheck2 = () => {
    scheduleJob('*/5 * * * * *', async () => {
        console.log('scheduleCronsForCouponCheck() is running v2 ............');
        
    });
}

export const scheduleCronsForCouponCheck3 = () => {
    scheduleJob('*/5 * * * * *', async () => {
        console.log('scheduleCronsForCouponCheck() is running v3............');
        
    });
}