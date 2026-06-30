import { describe, test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { DigitalPet } from './digital-pet';

describe('DigitalPet', () => {
  let pet: DigitalPet;

  // ── Action tests (default 10s decay — won't fire during these) ──

  beforeEach(() => {
    pet = new DigitalPet();
  });

  afterEach(() => {
    pet.destroy();
  });

  test('starts with default stats of 50', () => {
    assert.deepStrictEqual(pet.getStatus(), { hunger: 50, happiness: 50, energy: 50 });
  });

  test('feed() decreases hunger by 10', async () => {
    await pet.feed();
    assert.strictEqual(pet.getStatus().hunger, 40);
  });

  test('feed() does not drop hunger below 0', async () => {
    for (let i = 0; i < 10; i++) await pet.feed();
    assert.strictEqual(pet.getStatus().hunger, 0);
  });

  test('play() increases happiness by 10 and decreases energy by 10', async () => {
    await pet.play();
    const s = pet.getStatus();
    assert.strictEqual(s.happiness, 60);
    assert.strictEqual(s.energy, 40);
  });

  test('play() throws "Pet is too tired." when energy < 10', async () => {
    pet.energy = 5;
    await assert.rejects(() => pet.play(), { message: 'Pet is too tired.' });
  });

  test('play() does not change stats when it throws', async () => {
    pet.energy = 5;
    try { await pet.play(); } catch { }
    assert.strictEqual(pet.getStatus().energy, 5);
    assert.strictEqual(pet.getStatus().happiness, 50);
  });

  test('sleep() restores energy by 20', async () => {
    await pet.sleep();
    assert.strictEqual(pet.getStatus().energy, 70);
  });

  test('stats stay within 0-100 range', async () => {
    pet.hunger = 0;
    await pet.feed();
    assert.strictEqual(pet.getStatus().hunger, 0);

    pet.happiness = 100;
    await pet.play();
    assert.strictEqual(pet.getStatus().happiness, 100);

    pet.energy = 100;
    await pet.sleep();
    assert.strictEqual(pet.getStatus().energy, 100);
  });

  // ── Decay tests (fast interval so ticks actually fire) ──

  describe('stat decay', () => {
    let decayPet: DigitalPet;

    afterEach(() => {
      decayPet.destroy();
    });

    test('stats decay after one tick', async () => {
      decayPet = new DigitalPet(100);

      await new Promise((resolve) => setTimeout(resolve, 150));

      const s = decayPet.getStatus();
      assert.ok(s.hunger > 50, `hunger should be > 50, got ${s.hunger}`);
      assert.ok(s.happiness < 50, `happiness should be < 50, got ${s.happiness}`);
      assert.ok(s.energy < 50, `energy should be < 50, got ${s.energy}`);
    });

    test('multiple decay ticks accumulate', async () => {
      decayPet = new DigitalPet(50);

      await new Promise((resolve) => setTimeout(resolve, 320));

      const s = decayPet.getStatus();
      assert.ok(s.hunger >= 65, `hunger should be >= 65, got ${s.hunger}`);
      assert.ok(s.happiness <= 35, `happiness should be <= 35, got ${s.happiness}`);
      assert.ok(s.energy <= 35, `energy should be <= 35, got ${s.energy}`);
    });

    test('decay respects 0-100 bounds', async () => {
      decayPet = new DigitalPet(50);
      decayPet.happiness = 2;
      decayPet.energy = 2;
      decayPet.hunger = 99;

      await new Promise((resolve) => setTimeout(resolve, 120));

      const s = decayPet.getStatus();
      assert.strictEqual(s.happiness, 0);
      assert.strictEqual(s.energy, 0);
      assert.strictEqual(s.hunger, 100);
    });
  });

  // ── 24-hour simulation (24 ticks at fast interval) ──

  describe('24-hour simulation', () => {
    test('pet survives a 24-tick simulation with care', async () => {
      const TICK = 100;
      const simPet = new DigitalPet(TICK);

      for (let tick = 1; tick <= 24; tick++) {
        await new Promise((resolve) => setTimeout(resolve, TICK));

        if (tick % 2 === 0) await simPet.feed();
        if (tick % 3 === 0) await simPet.sleep();
        if (tick % 4 === 0 && simPet.energy >= 10) await simPet.play();
      }

      const s = simPet.getStatus();
      assert.ok(s.hunger < 100, `hunger should be < 100, got ${s.hunger}`);
      assert.ok(s.happiness > 0, `happiness should be > 0, got ${s.happiness}`);
      assert.ok(s.energy > 0, `energy should be > 0, got ${s.energy}`);

      simPet.destroy();
    });
  });
});