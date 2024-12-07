
import { dd1 } from '@/lib/dd1';

describe('dd1 function', () => {
    it('should throw an error if the system is unstable without finite capacity',
        () => {
            expect(() => dd1(5, 3, 10))
                .toThrow("System is unstable without finite capacity.");
        });

    it('should calculate the time of the first balk (t1) for unstable systems with finite capacity',
        () => {
            const result = dd1(5, 3, 10, 10);
            expect(result.t1).toBeDefined();
        });

    it('should calculate n and Wq for stable systems',
        () => {
            const result = dd1(3, 5, 10);
            expect(result.n).toBeDefined();
            expect(result.Wq).toBeDefined();
        });
});