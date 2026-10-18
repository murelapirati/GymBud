import { calculateAutoScrollSpeed } from '../useDragAutoScroll';

describe('calculateAutoScrollSpeed', () => {
  const containerTop = 100;
  const containerHeight = 600;
  // container spans Y: 100 to 700
  // Top zone (100px): 100 to 200
  // Neutral zone: 200 to 600
  // Bottom zone (100px): 600 to 700

  describe('neutral zone', () => {
    it('returns 0 when finger is comfortably in the middle', () => {
      expect(calculateAutoScrollSpeed(300, containerTop, containerHeight)).toBe(0);
      expect(calculateAutoScrollSpeed(400, containerTop, containerHeight)).toBe(0);
      expect(calculateAutoScrollSpeed(500, containerTop, containerHeight)).toBe(0);
    });

    it('returns 0 just outside the top and bottom zones', () => {
      // 200.1 is outside the 100-200 top zone
      expect(calculateAutoScrollSpeed(201, containerTop, containerHeight)).toBe(0);
      // 599.9 is outside the 600-700 bottom zone
      expect(calculateAutoScrollSpeed(599, containerTop, containerHeight)).toBe(0);
    });
  });

  describe('top zone (scrolling upwards)', () => {
    it('starts at minSpeed (-2) at the inner boundary of the zone', () => {
      const speed = calculateAutoScrollSpeed(200, containerTop, containerHeight);
      expect(speed).toBeCloseTo(-2, 1);
    });

    it('ramps linearly to mid-speed (-8) at the midpoint of the top zone', () => {
      // halfway between 100 and 200 is 150
      const speed = calculateAutoScrollSpeed(150, containerTop, containerHeight);
      expect(speed).toBeCloseTo(-8, 1);
    });

    it('reaches maxSpeed (-14) at the very top edge of the container', () => {
      const speed = calculateAutoScrollSpeed(100, containerTop, containerHeight);
      expect(speed).toBeCloseTo(-14, 1);
    });

    it('clamps to maxSpeed (-14) when finger moves above the container top', () => {
      expect(calculateAutoScrollSpeed(50, containerTop, containerHeight)).toBe(-14);
      expect(calculateAutoScrollSpeed(0, containerTop, containerHeight)).toBe(-14);
      expect(calculateAutoScrollSpeed(-50, containerTop, containerHeight)).toBe(-14);
    });
  });

  describe('bottom zone (scrolling downwards)', () => {
    it('starts at minSpeed (+2) at the inner boundary of the zone', () => {
      const speed = calculateAutoScrollSpeed(600, containerTop, containerHeight);
      expect(speed).toBeCloseTo(2, 1);
    });

    it('ramps linearly to mid-speed (+8) at the midpoint of the bottom zone', () => {
      // halfway between 600 and 700 is 650
      const speed = calculateAutoScrollSpeed(650, containerTop, containerHeight);
      expect(speed).toBeCloseTo(8, 1);
    });

    it('reaches maxSpeed (+14) at the very bottom edge of the container', () => {
      const speed = calculateAutoScrollSpeed(700, containerTop, containerHeight);
      expect(speed).toBeCloseTo(14, 1);
    });

    it('clamps to maxSpeed (+14) when finger moves below the container bottom', () => {
      expect(calculateAutoScrollSpeed(750, containerTop, containerHeight)).toBe(14);
      expect(calculateAutoScrollSpeed(900, containerTop, containerHeight)).toBe(14);
    });
  });

  describe('edge cases and custom configuration', () => {
    it('returns 0 if containerHeight is 0 or negative', () => {
      expect(calculateAutoScrollSpeed(100, 100, 0)).toBe(0);
      expect(calculateAutoScrollSpeed(100, 100, -50)).toBe(0);
    });

    it('supports custom zoneSize, minSpeed, and maxSpeed', () => {
      const customConfig = {
        zoneSize: 50,
        minSpeed: 4,
        maxSpeed: 20,
      };
      // containerTop: 100, height: 400 (top: 100..150, bottom: 450..500)
      // At top edge (100):
      expect(calculateAutoScrollSpeed(100, 100, 400, customConfig)).toBe(-20);
      // At top zone start (150):
      expect(calculateAutoScrollSpeed(150, 100, 400, customConfig)).toBeCloseTo(-4, 1);
      // In middle (200):
      expect(calculateAutoScrollSpeed(200, 100, 400, customConfig)).toBe(0);
      // At bottom zone start (450):
      expect(calculateAutoScrollSpeed(450, 100, 400, customConfig)).toBeCloseTo(4, 1);
      // At bottom edge (500):
      expect(calculateAutoScrollSpeed(500, 100, 400, customConfig)).toBe(20);
    });

    it('limits effective zone to half of containerHeight when container is small', () => {
      // containerHeight = 100, default zoneSize = 100 -> effectiveZone becomes 50
      // top zone: 100..150, bottom zone: 150..200
      expect(calculateAutoScrollSpeed(100, 100, 100)).toBe(-14);
      expect(calculateAutoScrollSpeed(200, 100, 100)).toBe(14);
    });
  });
});
