import type { WorkItem } from "@/lib/types/database";

export function roundWeight(weight: number): number {
  return Math.round(weight * 100) / 100;
}

/** Root siblings use 100; children use their parent's weight as the cap. */
export function getSiblingWeightBudget(parent: Pick<WorkItem, "weight"> | null): number {
  if (!parent) return 100;
  return Number(parent.weight);
}

export type WeightedSibling = { id: string; weight: number };

export function computeRebalancedSiblingWeights(
  siblings: WeightedSibling[],
  requestedWeight: number,
  budget: number
): { weight: number; siblingUpdates: Map<string, number> } {
  const clampedWeight = roundWeight(Math.min(Math.max(0, requestedWeight), budget));
  const siblingUpdates = new Map<string, number>();

  if (siblings.length === 0) {
    return { weight: clampedWeight, siblingUpdates };
  }

  const siblingSum = siblings.reduce((sum, sibling) => sum + Number(sibling.weight), 0);
  if (siblingSum + clampedWeight <= budget + 0.001) {
    return { weight: clampedWeight, siblingUpdates };
  }

  const remaining = Math.max(0, budget - clampedWeight);
  if (remaining <= 0 || siblingSum <= 0) {
    for (const sibling of siblings) {
      siblingUpdates.set(sibling.id, 0);
    }
    return { weight: clampedWeight, siblingUpdates };
  }

  let allocated = 0;
  for (let i = 0; i < siblings.length; i++) {
    const sibling = siblings[i];
    const scaled =
      i === siblings.length - 1
        ? roundWeight(remaining - allocated)
        : roundWeight((Number(sibling.weight) / siblingSum) * remaining);
    siblingUpdates.set(sibling.id, scaled);
    allocated += scaled;
  }

  return { weight: clampedWeight, siblingUpdates };
}
