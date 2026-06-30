// TEMPLATE - Copy to digital-pet.ts
import { Pet } from './pet';

export class DigitalPet implements Pet {
  hunger = 50;
  happiness = 50;
  energy = 50;
  private decayTimer: ReturnType<typeof setInterval> | null = null;

  /**
   * @param decayIntervalMs - How often stats decayes oy, in milliseconds.
   *   Defaults to 10_000 (10 seconds) for normal use.
   *   Pass a shorter value (e.g. 100) in tests so decay actually triggers.
   */
  constructor(decayIntervalMs: number = 10_000) {
    // TODO: Start decay timer using decayIntervalMs
    this.decayTimer = setInterval(() => {
      this.hunger = Math.min(100, this.hunger + 5);
      this.happiness = Math.max(0, this.happiness - 5);
      this.energy = Math.max(0, this.energy - 5);
    }, decayIntervalMs);
  }

  async feed(): Promise<void> {
    // TODO: Decrease hunger (min 0)
    this.hunger = Math.max(0, this.hunger - 10);
  }

  async play(): Promise<void> {
    // TODO: Check energy < 10, throw Error("Pet is too tired.")
    // TODO: Increase happiness (max 100), decrease energy (min 0)
    if (this.energy < 10) {
      throw new Error("Pet is too tired.");
    }
    this.happiness = Math.min(100, this.happiness + 10);
    this.energy = Math.max(0, this.energy - 10);
  }

  async sleep(): Promise<void> {
    // TODO: Increase energy (max 100)
    this.energy = Math.min(100, this.energy + 20);
  }

  getStatus() {
    return { hunger: this.hunger, happiness: this.happiness, energy: this.energy };
  }

  /** Cleans up the decay timer. Call in test teardown. */
  destroy(): void {
    // TODO: Clear the interval
    if (this.decayTimer) {
      clearInterval(this.decayTimer);
      this.decayTimer = null;
    }
  }
}