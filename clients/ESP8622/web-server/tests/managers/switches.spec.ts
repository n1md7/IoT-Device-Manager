import { describe, expect, it } from "vitest";
import { Switches } from "managers/switches";

// `trace` is an XS/Moddable global used by the dev ConsoleLogger; the switch
// driver logs on start/stop, so provide a no-op under Node.
(globalThis as { trace?: (msg: string) => void }).trace = () => {};

// One shared instance: the manager's Map is instance-scoped, so using a distinct
// pin per test keeps them independent without resetting the Preference stub.
describe("Switches manager", () => {
  const switches = new Switches();

  const find = (pin: number) => switches.toArray().find((s) => s.pin === pin);

  it("reports the real pin number, not the GPIO level", () => {
    switches.create({ digitalPin: 5, control: 1 });

    // Regression: toJSON() must not derive `pin` from Digital.read() (a 0/1
    // signal level) — it has to be the configured pin number.
    expect(find(5)?.pin).toBe(5);
  });

  it("tracks active state across start/stop", () => {
    switches.create({ digitalPin: 6, control: 1 });

    switches.startBy(6);
    expect(find(6)?.active).toBe(true);

    switches.stopBy(6);
    expect(find(6)?.active).toBe(false);
  });

  it("exposes stopsAt for a manual auto-off and clears it on stop", () => {
    const stopAt = Date.now() + 60_000;
    switches.create({ digitalPin: 7, control: 1 });

    switches.startBy(7, stopAt);
    expect(find(7)?.stopsAt).toBe(stopAt);

    switches.stopBy(7);
    expect(find(7)?.stopsAt).toBeNull();
  });

  it("leaves stopsAt null for a scheduler-driven start (no stopAt)", () => {
    switches.create({ digitalPin: 8, control: 1 });

    switches.startBy(8);
    expect(find(8)?.stopsAt).toBeNull();
  });
});
