# TypeScript Challenge: Digital Pet

Build a digital pet that survives 24 hours of simulation.

## Requirements

**Node.js**: v18+ recommended  
**TypeScript**: 5.3+

## Installing the tools (first time on your machine)

You don't need to install TypeScript globally — this project installs the exact
version it needs locally via `npm install`. You only need **Node.js** (which comes
with `npm`, the package manager).

### 1. Install Node.js

**Easiest way:** download the **LTS** installer from
[nodejs.org](https://nodejs.org) and run it. This gives you both `node` and `npm`.

Or use a version manager (handy if you juggle multiple Node versions):

- **macOS / Linux** — [nvm](https://github.com/nvm-sh/nvm):
  ```
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
  # restart your terminal, then:
  nvm install --lts
  nvm use --lts
  ```
- **macOS** — [Homebrew](https://brew.sh): `brew install node`
- **Windows** — [nvm-windows](https://github.com/coreybutler/nvm-windows), or the
  installer from nodejs.org.

### 2. Verify the install

Open a terminal and check the versions print without errors:

```
node -v     # should be v18 or higher, e.g. v20.x
npm -v      # any recent version is fine
```

If you get "command not found", close and reopen your terminal (or restart your
computer) so it picks up the newly installed tools.

### 3. Install this project's dependencies

From the project folder (the one containing `package.json`):

```
npm install
```

This reads `package.json` and downloads everything the project needs into a
`node_modules/` folder, including:

- **typescript** — the TypeScript compiler
- **ts-node** — runs `.ts` files directly, no manual compile step
- **@types/node** — type definitions so TypeScript understands Node built-ins
  like `setInterval`

You run this **once** (and again only if dependencies change). You do **not** need
to install TypeScript separately — it's now available inside this project.

### Editor (recommended)

[Visual Studio Code](https://code.visualstudio.com) has TypeScript support built
in — you'll see type errors and autocomplete as you type, no setup required. Open
the project folder in it with **File → Open Folder**.

### Quick sanity check

After `npm install`, run the tests. They will **fail** until you implement the
methods — that's expected — but seeing them *run* confirms your toolchain works:

```
npm test
```

## Task

Implement `digital-pet.ts` with a `DigitalPet` class:

- **Stats** (0-100): `hunger`, `happiness`, `energy`
- **Decay**: Every 10 seconds (use `setInterval`)
  - Hunger increases
  - Happiness decreases
  - Energy decreases
- **Methods** (all async):
  - `feed()` - decrease hunger
  - `play()` - increase happiness, decrease energy
    - Must throw `Error("Pet is too tired.")` if energy < 10
  - `sleep()` - restore energy
  - `getStatus()` - return stats object

See `pet.ts` for the interface. Use `digital-pet.template.ts` as starter.

## Running Tests

1. Make sure you've created `digital-pet.ts` (copy `digital-pet.template.ts` and
   fill in the `TODO`s). The test file already imports it for you.
2. Run:

```
npm test
```

Until you implement the methods, tests will fail — that's expected. Keep running
`npm test` as you go; your goal is to turn every ✖ into a ✔.

## Success Criteria

Pet survives 24 hours:
- Hunger < 100
- Happiness > 0
- Energy > 0
- No unexpected errors

---

## New to TypeScript? Start here

This section is for people who have **never written TypeScript**. It explains
just enough to complete the challenge. If you know JavaScript, TypeScript is
"JavaScript + type labels" — you write normal code, plus you tell the compiler
what *kind* of value each thing is.

### What the pieces mean

A **class** is a blueprint for an object. Our blueprint is `DigitalPet`. Each pet
you create from it has its own `hunger`, `happiness`, and `energy`.

```ts
export class DigitalPet {
  hunger = 50;        // a "property" — a value that belongs to each pet
  happiness = 50;
  energy = 50;
}
```

- `export` means "let other files use this class" (the test file imports it).
- `hunger = 50` creates a property and gives it a starting value of `50`.
- Inside a method, you read/change a property with **`this.`** —
  e.g. `this.hunger` is *this pet's* hunger.

### Types (the ":number" parts)

A **type** is a label saying what kind of value is allowed. If you try to put the
wrong kind in, TypeScript warns you *before* the code ever runs.

```ts
let count: number = 5;        // must be a number
let name: string = "Rex";     // must be text
let isTired: boolean = true;  // true / false
```

In the template you'll see things like `decayIntervalMs: number` (a parameter that
must be a number) and `Promise<void>` (explained below).

### Methods

A **method** is a function attached to the class — an action the pet can do.

```ts
feed() {
  this.hunger = this.hunger - 10;   // lower hunger by 10
}
```

You "call" it on a pet with a dot: `myPet.feed()`.

### `async` and `Promise<void>`

The methods are marked `async`, and their return type is `Promise<void>`:

```ts
async feed(): Promise<void> {
  // ...
}
```

- `async` marks a function that *can* do work that finishes later (waiting on a
  timer, a network call, etc.). For this challenge you don't need to do anything
  special — just write normal code inside.
- `Promise<void>` is the return type: "this eventually finishes and returns
  nothing." `void` = "no value returned."
- Callers use `await` to wait for it: `await myPet.feed();`. You'll see this all
  over the test file.

### Keeping numbers in range: `Math.max` / `Math.min`

Stats must stay between **0 and 100**. Two built-in helpers make this easy:

```ts
Math.max(0, value)     // never goes below 0  (picks the BIGGER of the two)
Math.min(100, value)   // never goes above 100 (picks the SMALLER of the two)
```

Example — lower hunger by 10 but never below 0:

```ts
this.hunger = Math.max(0, this.hunger - 10);
```

If `this.hunger` is `5`, then `5 - 10 = -5`, and `Math.max(0, -5)` gives `0`. 

### Throwing an error

`play()` must refuse to run when the pet is too tired. You stop a method and
report a problem by **throwing** an error:

```ts
if (this.energy < 10) {
  throw new Error("Pet is too tired.");
}
```

`throw` immediately exits the method, so put this check **first** — before you
change any stats. The test checks that nothing changed when it throws.

### Timers: `setInterval` / `clearInterval`

`setInterval(fn, ms)` runs `fn` over and over, every `ms` milliseconds. It returns
a handle you keep so you can stop it later with `clearInterval(handle)`.

```ts
constructor(decayIntervalMs: number = 10_000) {
  this.decayTimer = setInterval(() => {
    // this block runs on every tick
    this.hunger = Math.min(100, this.hunger + 5);
    // ...decrease happiness and energy the same way...
  }, decayIntervalMs);
}

destroy(): void {
  if (this.decayTimer) clearInterval(this.decayTimer);   // stop the timer
}
```

- `decayIntervalMs: number = 10_000` means "a number, defaulting to 10000 if not
  given." (`10_000` is just `10000` — underscores are allowed for readability.)
- `() => { ... }` is an **arrow function** — an inline function. Using an arrow
  here keeps `this` pointing at your pet.
- Always clear the timer in `destroy()`, or the program never stops.

### Putting it together — one worked example

Here is `sleep()` **fully implemented** as a model. Use the same patterns to fill
in `feed()` and `play()` yourself:

```ts
async sleep(): Promise<void> {
  // restore energy by 20, but never above 100
  this.energy = Math.min(100, this.energy + 20);
}
```

Now apply the ideas above to the remaining `TODO`s:
- `feed()` → lower `hunger` by 10, floor at 0 (`Math.max`).
- `play()` → first the "too tired" check + `throw`; then raise `happiness` (cap at
  100) and lower `energy` (floor at 0).
- `constructor` → start the decay `setInterval` and store it in `this.decayTimer`.
- `destroy()` → `clearInterval` the stored timer.

Read `check-pet.test.ts` to see the exact expected numbers (e.g. feed lowers
hunger by 10, sleep raises energy by 20). The tests are your spec — match them.
